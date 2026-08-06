import json
from typing import Union, List, Dict, Any

try:
    from ai.chains import summary_chain, order_summary_chain
except ImportError:
    from chains import summary_chain, order_summary_chain


class AIInsightService:
    """
    Service class responsible for generating AI-powered business insights
    from sales, order, or general datasets using LangChain and Gemini.
    """

    @staticmethod
    def _format_data(data: Union[str, List[Any], Dict[str, Any]]) -> str:
        """
        Formats raw input data (string, list, or dict) into a readable string format.
        """
        if isinstance(data, str):
            return data.strip()
        elif isinstance(data, (list, dict)):
            try:
                return json.dumps(data, indent=2, default=str)
            except Exception:
                return str(data)
        else:
            return str(data)

    @classmethod
    def generate_summary(
        cls,
        data: Union[str, List[Any], Dict[str, Any]],
        data_type: str = "sales",
        question: str | None = None
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

        response = summary_chain.invoke(
            {
                "question": query_prompt,
                "data_type": data_type,
                "dataset": formatted_data,
            }
        )

        return response

    @classmethod
    def summarize_dataset(
        cls,
        data: Union[str, List[Any], Dict[str, Any]],
        data_type: str = "sales",
        question: str | None = None
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

        response = order_summary_chain.invoke(
            {
                "dataset": formatted_orders
            }
        )

        return response


# Class alias for convenient importing
InsightService = AIInsightService