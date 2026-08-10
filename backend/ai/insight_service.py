import json
import logging
import os
import time
from typing import Union, List, Dict, Any, Optional

try:
    from ai.chains import get_order_summary_chain, get_summary_chain
    from ai.config import AIConfigurationError
except ImportError:
    from .chains import get_order_summary_chain, get_summary_chain
    from .config import AIConfigurationError


logger = logging.getLogger(__name__)
MAX_DATASET_CHARACTERS = 50_000


class AIProviderError(RuntimeError):
    """Raised when the configured LLM cannot produce a summary."""


class AIInsightService:
    """
    Service class responsible for generating AI-powered business insights
    from sales, order, or general datasets using LangChain and Gemini.
    """

    @staticmethod
    def _sanitize_error_msg(msg: str) -> str:
        """Sanitizes error strings to prevent accidental exposure of API keys."""
        api_key = os.getenv("GOOGLE_API_KEY", "").strip()
        if api_key and len(api_key) > 5 and api_key in msg:
            return msg.replace(api_key, "***KEY_HIDDEN***")
        return msg

    @staticmethod
    def _format_data(data: Union[str, List[Any], Dict[str, Any]]) -> str:
        """
        Formats raw input data (string, list, or dict) into a readable string format.
        Rejects empty or whitespace-only data.
        """
        if data is None:
            raise ValueError("Dataset input cannot be empty or whitespace-only.")
        if isinstance(data, bool) or isinstance(data, (int, float)):
            raise ValueError("Invalid dataset format. Expected text string, list of records, or object dictionary.")
        if isinstance(data, str):
            formatted = data.strip()
            if not formatted:
                raise ValueError("Dataset input cannot be empty or whitespace-only.")
        elif isinstance(data, (list, dict)):
            if len(data) == 0:
                raise ValueError("Dataset payload cannot be empty.")
            try:
                formatted = json.dumps(data, indent=2, default=str)
            except Exception:
                formatted = str(data)
        else:
            formatted = str(data).strip()
            if not formatted:
                raise ValueError("Dataset input cannot be empty or whitespace-only.")

        if len(formatted) > MAX_DATASET_CHARACTERS:
            raise ValueError(
                f"Dataset is too large. Limit input to {MAX_DATASET_CHARACTERS:,} characters."
            )
        return formatted

    @classmethod
    def _invoke_with_retry(cls, chain: Any, input_data: Dict[str, Any], max_retries: int = 1) -> str:
        """
        Invokes a LangChain chain with retry logic for transient API issues.
        """
        last_error = None
        for attempt in range(1, max_retries + 1):
            try:
                return chain.invoke(input_data)
            except AIConfigurationError:
                raise
            except Exception as e:
                err_msg = cls._sanitize_error_msg(str(e))
                # Fail fast on auth, bad key, or provider deadline errors without waiting for multiple retries
                if any(k in err_msg for k in ["API_KEY_INVALID", "UNAUTHENTICATED", "401", "API key not valid", "API_KEY_SERVICE_BLOCKED", "INVALID_ARGUMENT", "400", "504", "DEADLINE_EXHAUSTED"]):
                    logger.error("AI provider authentication, key validation, or deadline failed.")
                    raise AIConfigurationError("Invalid GOOGLE_API_KEY configuration or AI service unavailable.") from e
                if "RESOURCE_EXHAUSTED" in err_msg or "429" in err_msg or "Quota exceeded" in err_msg:
                    logger.warning("AI provider quota exceeded: %s", err_msg)
                    raise AIProviderError("AI quota exceeded. Please try again later or check your API plan.") from e

                last_error = e
                if attempt < max_retries:
                    time.sleep(1.0 * attempt)
        logger.error("AI provider failed after %s attempt(s)", max_retries)
        raise AIProviderError("The AI provider is temporarily unavailable. Please try again.") from last_error

    @classmethod
    def generate_summary(
        cls,
        data: Union[str, List[Any], Dict[str, Any]],
        data_type: str = "sales",
        question: Optional[str] = None
    ) -> str:
        """
        Generates an AI summary for business data.

        Args:
            data (Union[str, list, dict]): Sales, order, or custom dataset.
            data_type (str): Type of dataset (e.g., 'sales', 'orders', 'financial').
            question (str, optional): Custom prompt or question. Defaults to automatic summary prompt.

        Returns:
            str: AI-generated business summary in Markdown format.
        """
        formatted_data = cls._format_data(data)
        query_prompt = question or f"Summarize key insights, metrics, trends, and recommendations for this {data_type} dataset."

        return cls._invoke_with_retry(
            get_summary_chain(),
            {
                "question": query_prompt,
                "data_type": data_type,
                "dataset": formatted_data,
            }
        )

    @classmethod
    def summarize_dataset(
        cls,
        data: Union[str, List[Any], Dict[str, Any]],
        data_type: str = "sales",
        question: Optional[str] = None
    ) -> str:
        """
        Alias for generate_summary to ensure backward compatibility across backend code and tests.
        """
        return cls.generate_summary(data, data_type=data_type, question=question)

    @classmethod
    def summarize_orders(
        cls,
        orders_data: Union[str, List[Any], Dict[str, Any]]
    ) -> str:
        """
        Generates targeted AI business insights specifically for order datasets.

        Args:
            orders_data (Union[str, list, dict]): Order records or order metrics.

        Returns:
            str: Business insights for orders.
        """
        formatted_orders = cls._format_data(orders_data)

        return cls._invoke_with_retry(
            get_order_summary_chain(),
            {
                "dataset": formatted_orders
            }
        )

    @classmethod
    def summarize_db_orders(
        cls,
        db_session: Any,
        region: Optional[str] = None,
        category: Optional[str] = None,
        segment: Optional[str] = None
    ) -> Dict[str, Any]:
        """
        Fetches live order records from SQLite database, computes aggregated metrics,
        and generates an AI business summary using LangChain.

        Args:
            db_session: SQLAlchemy Session instance
            region (str, optional): Region filter
            category (str, optional): Category filter
            segment (str, optional): Segment filter

        Returns:
            dict: Aggregated metrics & AI summary markdown
        """
        try:
            from database import get_all_orders
        except ImportError:
            from backend.database import get_all_orders

        orders = get_all_orders(db_session)

        # Apply optional filters
        if region:
            orders = [o for o in orders if str(o.get("Region", "")).lower() == region.lower()]
        if category:
            orders = [o for o in orders if str(o.get("Category", "")).lower() == category.lower()]
        if segment:
            orders = [o for o in orders if str(o.get("Segment", "")).lower() == segment.lower()]

        total_orders = len(orders)
        total_sales = sum(float(o.get("Sales", 0) or 0) for o in orders)
        total_profit = sum(float(o.get("Profit", 0) or 0) for o in orders)
        avg_order_value = total_sales / total_orders if total_orders > 0 else 0.0

        # Category performance breakdown
        cat_breakdown = {}
        for o in orders:
            cat = str(o.get("Category", "Unknown"))
            s = float(o.get("Sales", 0) or 0)
            p = float(o.get("Profit", 0) or 0)
            if cat not in cat_breakdown:
                cat_breakdown[cat] = {"sales": 0.0, "profit": 0.0, "count": 0}
            cat_breakdown[cat]["sales"] += s
            cat_breakdown[cat]["profit"] += p
            cat_breakdown[cat]["count"] += 1

        top_category = max(cat_breakdown.items(), key=lambda x: x[1]["sales"])[0] if cat_breakdown else "N/A"

        metrics_summary = {
            "filters_applied": {
                "region": region,
                "category": category,
                "segment": segment
            },
            "total_orders": total_orders,
            "total_sales": round(total_sales, 2),
            "total_profit": round(total_profit, 2),
            "average_order_value": round(avg_order_value, 2),
            "top_category_by_sales": top_category,
            "category_performance": cat_breakdown
        }

        ai_summary = cls.summarize_orders(metrics_summary)

        return {
            "metrics": metrics_summary,
            "ai_summary": ai_summary
        }


# Class alias for convenient importing
InsightService = AIInsightService

