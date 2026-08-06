from typing import Union, List, Dict, Any, Optional
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field

try:
    from ai.insight_service import AIInsightService, InsightService
except ImportError:
    from insight_service import AIInsightService, InsightService

router = APIRouter(
    prefix="/ai",
    tags=["AI"],
)


class AIRequest(BaseModel):
    dataset: Union[str, List[Dict[str, Any]], Dict[str, Any]] = Field(
        ...,
        description="Dataset content to summarize. Can be formatted text, a list of records, or a metrics dictionary.",
        examples=["Sales: 100, 200, 300\nProfit: 20, 40, 50"]
    )
    data_type: str = Field(
        default="sales",
        description="Type of dataset (e.g., 'sales', 'orders', 'financial').",
        examples=["sales"]
    )
    question: Optional[str] = Field(
        default=None,
        description="Optional custom query or prompt objective for the AI service.",
        examples=["Summarize key profit drivers and risks."]
    )


class AIOrdersRequest(BaseModel):
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


@router.post(
    "/summarize",
    summary="Generate AI Summary",
    description="Generate an AI-powered business insights summary from raw text or structured sales/order datasets."
)
def summarize_dataset(request: AIRequest):
    """
    Generate an AI-powered summary of the provided sales/order dataset.
    """
    try:
        summary = AIInsightService.generate_summary(
            data=request.dataset,
            data_type=request.data_type,
            question=request.question
        )

        return {
            "success": True,
            "message": "AI summary generated successfully.",
            "summary": summary,
            "data": {
                "data_type": request.data_type,
                "summary": summary
            }
        }

    except ValueError as ve:
        raise HTTPException(
            status_code=400,
            detail=str(ve)
        )
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"AI Service Error: {str(e)}"
        )


@router.post(
    "/summarize-orders",
    summary="Generate AI Order Insights",
    description="Generate targeted AI business insights specifically for order dataset records or aggregated order metrics."
)
def summarize_orders(request: AIOrdersRequest):
    """
    Generate targeted AI business insights specifically for orders.
    """
    try:
        summary = AIInsightService.summarize_orders(request.orders)

        return {
            "success": True,
            "message": "Order insights generated successfully.",
            "summary": summary,
            "data": {
                "data_type": "orders",
                "summary": summary
            }
        }

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"AI Service Error: {str(e)}"
        )