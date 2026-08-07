from typing import Union, List, Dict, Any, Optional
from fastapi import APIRouter, HTTPException, Depends, Query, status
from pydantic import BaseModel, Field, field_validator
from sqlalchemy.orm import Session

try:
    from ai.config import AIConfigurationError
    from ai.insight_service import AIInsightService, AIProviderError, InsightService
except ImportError:
    from .config import AIConfigurationError
    from .insight_service import AIInsightService, AIProviderError, InsightService

try:
    from database import get_db
except ImportError:
    from backend.database import get_db

router = APIRouter(
    prefix="/ai",
    tags=["AI"],
)


# --------------------------------------------------------------------
# Pydantic Schemas for Request & Response Validation
# --------------------------------------------------------------------

class AISummaryRequest(BaseModel):
    """
    Request model for generating AI business insights from sales or order data.
    Accepts raw text, a list of JSON records, or aggregated metrics dictionaries.
    """
    dataset: Union[str, List[Dict[str, Any]], Dict[str, Any]] = Field(
        ...,
        description="Dataset content to analyze. Can be formatted text, list of order records, or aggregated metrics dictionary.",
        examples=[
            {
                "total_orders": 1250,
                "total_sales": 345000.75,
                "total_profit": 48200.50,
                "top_category": "Technology",
                "underperforming_category": "Furniture"
            }
        ]
    )
    data_type: str = Field(
        default="sales",
        description="Category/type of dataset (e.g., 'sales', 'orders', 'financial').",
        examples=["sales"]
    )
    question: Optional[str] = Field(
        default=None,
        description="Optional custom focus area or query objective for the AI service.",
        examples=["Summarize key profit drivers, risks, and recommendations."]
    )

    @field_validator("dataset")
    @classmethod
    def validate_dataset_not_empty(cls, v):
        if isinstance(v, str) and not v.strip():
            raise ValueError("Dataset input string cannot be empty or whitespace.")
        if isinstance(v, (list, dict)) and len(v) == 0:
            raise ValueError("Dataset payload cannot be empty.")
        return v


class AISummaryResponseData(BaseModel):
    """Structured data payload inside AISummaryResponse."""
    data_type: str = Field(..., description="Dataset type processed.")
    summary: str = Field(..., description="AI-generated business summary in Markdown format.")
    question: Optional[str] = Field(None, description="Objective or prompt query used.")


class AISummaryResponse(BaseModel):
    """Response model for AI summary generation."""
    success: bool = Field(True, description="Operation success status.")
    message: str = Field("AI summary generated successfully.", description="Status message.")
    summary: str = Field(..., description="AI-generated markdown summary.")
    data: AISummaryResponseData = Field(..., description="Structured payload containing summary details.")


class AIOrdersRequest(BaseModel):
    """Request model for order-specific AI business insights."""
    orders: Union[str, List[Dict[str, Any]], Dict[str, Any]] = Field(
        ...,
        description="Order details or metrics summary to analyze.",
        examples=[
            {
                "total_orders": 500,
                "total_sales": 125000.50,
                "total_profit": 18250.00,
                "top_category": "Technology"
            }
        ]
    )

    @field_validator("orders")
    @classmethod
    def validate_orders_not_empty(cls, v):
        if isinstance(v, str) and not v.strip():
            raise ValueError("Orders input string cannot be empty or whitespace.")
        if isinstance(v, (list, dict)) and len(v) == 0:
            raise ValueError("Orders payload cannot be empty.")
        return v


class AIOrdersResponseData(BaseModel):
    """Structured data payload inside AIOrdersResponse."""
    data_type: str = Field("orders", description="Type of dataset processed.")
    summary: str = Field(..., description="AI-generated markdown summary.")


class AIOrdersResponse(BaseModel):
    """Response model for order insights endpoint."""
    success: bool = Field(True, description="Operation success status.")
    message: str = Field("Order insights generated successfully.", description="Status message.")
    summary: str = Field(..., description="AI-generated markdown summary.")
    data: AIOrdersResponseData = Field(..., description="Structured payload containing summary details.")


class AILiveOrdersResponse(BaseModel):
    """Response model for live database order insights."""
    success: bool = Field(True, description="Operation success status.")
    message: str = Field("Live database order insights generated successfully.", description="Status message.")
    metrics: Dict[str, Any] = Field(..., description="Aggregated metrics computed from live database.")
    summary: str = Field(..., description="AI-generated markdown summary based on live database metrics.")


# --------------------------------------------------------------------
# API Endpoint Handlers
# --------------------------------------------------------------------

@router.post(
    "/summary",
    response_model=AISummaryResponse,
    status_code=status.HTTP_200_OK,
    summary="Generate AI Business Summary (Primary Endpoint)",
    description="Production-ready endpoint that accepts sales/order data in text or JSON format and returns a structured AI-generated business summary."
)
def generate_ai_summary(request: AISummaryRequest):
    """
    Primary endpoint for generating AI-powered business summaries from sales or order datasets.
    """
    try:
        summary_text = AIInsightService.generate_summary(
            data=request.dataset,
            data_type=request.data_type,
            question=request.question
        )

        return AISummaryResponse(
            success=True,
            message="AI summary generated successfully.",
            summary=summary_text,
            data=AISummaryResponseData(
                data_type=request.data_type,
                summary=summary_text,
                question=request.question
            )
        )

    except ValueError as ve:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid Request Input: {str(ve)}"
        )
    except AIConfigurationError as exc:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail=str(exc),
        ) from exc
    except AIProviderError as exc:
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail="The AI provider is temporarily unavailable. Please try again.",
        ) from exc
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"AI Service Error: {str(e)}"
        )


@router.post(
    "/summarize",
    response_model=AISummaryResponse,
    status_code=status.HTTP_200_OK,
    summary="Generate AI Summary (Alias)",
    description="Alias endpoint for `/ai/summary` to ensure backward compatibility across client applications."
)
def summarize_dataset_alias(request: AISummaryRequest):
    """Alias handler mapping `/ai/summarize` to `generate_ai_summary`."""
    return generate_ai_summary(request)


@router.post(
    "/summarize-orders",
    response_model=AIOrdersResponse,
    status_code=status.HTTP_200_OK,
    summary="Generate Order Insights",
    description="Generates targeted business insights specifically tailored for order dataset records or aggregated order metrics."
)
def summarize_orders_endpoint(request: AIOrdersRequest):
    """Targeted order insights endpoint."""
    try:
        summary_text = AIInsightService.summarize_orders(request.orders)

        return AIOrdersResponse(
            success=True,
            message="Order insights generated successfully.",
            summary=summary_text,
            data=AIOrdersResponseData(
                data_type="orders",
                summary=summary_text
            )
        )

    except ValueError as ve:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid Request Input: {str(ve)}"
        )
    except AIConfigurationError as exc:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail=str(exc),
        ) from exc
    except AIProviderError as exc:
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail="The AI provider is temporarily unavailable. Please try again.",
        ) from exc
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"AI Service Error: {str(e)}"
        )


@router.get(
    "/summarize-live-orders",
    response_model=AILiveOrdersResponse,
    status_code=status.HTTP_200_OK,
    summary="Generate AI Summary from Live Database Orders",
    description="Queries live orders from the database with optional filters, computes aggregated metrics, and generates AI business insights."
)
def summarize_live_orders_endpoint(
    region: Optional[str] = Query(default=None, description="Optional region filter (e.g., East, West, South, Central)"),
    category: Optional[str] = Query(default=None, description="Optional category filter (e.g., Technology, Furniture, Office Supplies)"),
    segment: Optional[str] = Query(default=None, description="Optional segment filter (e.g., Consumer, Corporate, Home Office)"),
    db: Session = Depends(get_db)
):
    """Live database orders AI summary handler."""
    try:
        result = AIInsightService.summarize_db_orders(
            db_session=db,
            region=region,
            category=category,
            segment=segment
        )

        return AILiveOrdersResponse(
            success=True,
            message="Live database order insights generated successfully.",
            metrics=result["metrics"],
            summary=result["ai_summary"]
        )

    except AIConfigurationError as exc:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail=str(exc),
        ) from exc
    except AIProviderError as exc:
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail="The AI provider is temporarily unavailable. Please try again.",
        ) from exc
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"AI Live Order Service Error: {str(e)}"
        )


