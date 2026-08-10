from typing import Union, List, Dict, Any, Optional
from fastapi import APIRouter, HTTPException, Depends, Query, status
from fastapi.responses import JSONResponse
from pydantic import BaseModel, Field, field_validator, model_validator
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
    Supports input via 'data' or 'dataset'.
    """
    data: Optional[Union[str, List[Dict[str, Any]], Dict[str, Any]]] = Field(
        default=None,
        description="Dataset content to analyze. Can be formatted text, list of order records, or aggregated metrics object.",
        examples=["Sales: 120,340,280,560,410\nProfit: 20,55,45,120,70"]
    )
    dataset: Optional[Union[str, List[Dict[str, Any]], Dict[str, Any]]] = Field(
        default=None,
        description="Dataset content to analyze (alias for 'data').",
        examples=[
            {
                "total_orders": 1250,
                "total_sales": 345000.75,
                "total_profit": 48200.50,
                "top_category": "Technology"
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

    model_config = {
        "json_schema_extra": {
            "examples": [
                {
                    "summary": "Sales Dataset Example",
                    "value": {
                        "data": "Sales: 120,340,280,560,410\nProfit: 20,55,45,120,70",
                        "data_type": "sales"
                    }
                },
                {
                    "summary": "Orders Dataset Example",
                    "value": {
                        "data": {
                            "total_orders": 1250,
                            "total_sales": 345000.75,
                            "total_profit": 48200.50,
                            "top_category": "Technology",
                            "underperforming_category": "Furniture"
                        },
                        "data_type": "orders",
                        "question": "Analyze order performance and suggest optimizations."
                    }
                }
            ]
        }
    }

    @model_validator(mode="before")
    @classmethod
    def normalize_and_validate_inputs(cls, values: Any) -> Any:
        if isinstance(values, dict):
            if "dataset" not in values or values.get("dataset") is None:
                if "data" in values and values.get("data") is not None:
                    values["dataset"] = values["data"]

            raw_dataset = values.get("dataset")
            if raw_dataset is None:
                raise ValueError("Dataset input is required (use 'data' or 'dataset' field).")

            if isinstance(raw_dataset, bool) or isinstance(raw_dataset, (int, float)):
                raise ValueError("Dataset input must be a formatted text string, list of records, or object dictionary.")
            if isinstance(raw_dataset, str) and not raw_dataset.strip():
                raise ValueError("Dataset input string cannot be empty or whitespace.")
            if isinstance(raw_dataset, (list, dict)) and len(raw_dataset) == 0:
                raise ValueError("Dataset payload cannot be empty.")
        return values


class AISummaryResponseData(BaseModel):
    """Structured data payload inside AISummaryResponse."""
    data_type: str = Field(..., description="Dataset type processed.")
    summary: str = Field(..., description="AI-generated business summary in Markdown format.")
    question: Optional[str] = Field(None, description="Objective or prompt query used.")


class AISummaryResponse(BaseModel):
    """Response model for AI summary generation."""
    success: bool = Field(True, description="Operation success status.")
    summary: str = Field(..., description="AI-generated markdown summary.")
    data_type: str = Field("sales", description="Type of dataset analyzed.")
    message: Optional[str] = Field("AI summary generated successfully.", description="Status message.")
    data: Optional[AISummaryResponseData] = Field(None, description="Structured payload containing summary details.")


class AIErrorDetails(BaseModel):
    """Structured error payload details."""
    code: str = Field(..., description="Error code identifier (e.g., 'INVALID_INPUT', 'CONFIG_ERROR', 'PROVIDER_ERROR', 'INTERNAL_ERROR').")
    message: str = Field(..., description="Human-readable error description.")


class AIErrorResponse(BaseModel):
    """Standardized error response model for AI API endpoints."""
    success: bool = Field(False, description="Operation success status (always false for errors).")
    error: AIErrorDetails = Field(..., description="Structured error details.")


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
        if isinstance(v, bool) or isinstance(v, (int, float)):
            raise ValueError("Orders input must be a text string, list of records, or object dictionary.")
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
    description="""
### POST /ai/summary - Production AI Summary Endpoint

Generates structured business intelligence insights from sales or order datasets using **LangChain** and **Google Gemini LLM**.

#### Contract & Usage Information for Frontend Integration:
- **Method**: `POST`
- **Endpoint**: `/ai/summary`
- **Headers**: `Content-Type: application/json`

#### Example Frontend Fetch Request:
```javascript
fetch(`${API_BASE_URL}/ai/summary`, {
  method: "POST",
  headers: {
    "Content-Type": "application/json"
  },
  body: JSON.stringify({
    data: "Sales: 120,340,280,560,410\\nProfit: 20,55,45,120,70",
    data_type: "sales"
  })
})
.then(res => res.json())
.then(data => console.log(data.summary));
```
*Note: The frontend must use its configured backend API base URL (e.g. `process.env.NEXT_PUBLIC_API_BASE_URL` or `API_BASE_URL`), without hardcoding production hostnames.*
""",
    responses={
        200: {
            "model": AISummaryResponse,
            "description": "Successful AI summary generation",
            "content": {
                "application/json": {
                    "example": {
                        "success": True,
                        "summary": "# Executive Summary\nSales increased by 25%...",
                        "data_type": "sales"
                    }
                }
            }
        },
        400: {
            "model": AIErrorResponse,
            "description": "Validation error / Empty dataset / Invalid data types",
            "content": {
                "application/json": {
                    "example": {
                        "success": False,
                        "error": {
                            "code": "INVALID_INPUT",
                            "message": "Dataset input cannot be empty or whitespace-only."
                        }
                    }
                }
            }
        },
        502: {
            "model": AIErrorResponse,
            "description": "AI provider service failure or quota limit",
            "content": {
                "application/json": {
                    "example": {
                        "success": False,
                        "error": {
                            "code": "PROVIDER_ERROR",
                            "message": "The AI provider is temporarily unavailable. Please try again."
                        }
                    }
                }
            }
        },
        503: {
            "model": AIErrorResponse,
            "description": "AI configuration error (missing GOOGLE_API_KEY)",
            "content": {
                "application/json": {
                    "example": {
                        "success": False,
                        "error": {
                            "code": "CONFIG_ERROR",
                            "message": "GOOGLE_API_KEY is not configured. Add it to the project .env file."
                        }
                    }
                }
            }
        }
    }
)
def generate_ai_summary(request: AISummaryRequest):
    """
    Primary endpoint for generating AI-powered business summaries from sales or order datasets.
    """
    try:
        dataset_to_use = request.dataset or request.data
        summary_text = AIInsightService.generate_summary(
            data=dataset_to_use,
            data_type=request.data_type,
            question=request.question
        )

        return AISummaryResponse(
            success=True,
            summary=summary_text,
            data_type=request.data_type,
            message="AI summary generated successfully.",
            data=AISummaryResponseData(
                data_type=request.data_type,
                summary=summary_text,
                question=request.question
            )
        )

    except ValueError as ve:
        return JSONResponse(
            status_code=status.HTTP_400_BAD_REQUEST,
            content={
                "success": False,
                "error": {
                    "code": "INVALID_INPUT",
                    "message": str(ve)
                }
            }
        )
    except AIConfigurationError as exc:
        return JSONResponse(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            content={
                "success": False,
                "error": {
                    "code": "CONFIG_ERROR",
                    "message": str(exc)
                }
            }
        )
    except AIProviderError as exc:
        return JSONResponse(
            status_code=status.HTTP_502_BAD_GATEWAY,
            content={
                "success": False,
                "error": {
                    "code": "PROVIDER_ERROR",
                    "message": str(exc)
                }
            }
        )
    except Exception:
        return JSONResponse(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            content={
                "success": False,
                "error": {
                    "code": "INTERNAL_ERROR",
                    "message": "An internal server error occurred while processing the AI summary request."
                }
            }
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
        return JSONResponse(
            status_code=status.HTTP_400_BAD_REQUEST,
            content={
                "success": False,
                "error": {
                    "code": "INVALID_INPUT",
                    "message": str(ve)
                }
            }
        )
    except AIConfigurationError as exc:
        return JSONResponse(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            content={
                "success": False,
                "error": {
                    "code": "CONFIG_ERROR",
                    "message": str(exc)
                }
            }
        )
    except AIProviderError as exc:
        return JSONResponse(
            status_code=status.HTTP_502_BAD_GATEWAY,
            content={
                "success": False,
                "error": {
                    "code": "PROVIDER_ERROR",
                    "message": str(exc)
                }
            }
        )
    except Exception:
        return JSONResponse(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            content={
                "success": False,
                "error": {
                    "code": "INTERNAL_ERROR",
                    "message": "An internal server error occurred while processing order insights."
                }
            }
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
        return JSONResponse(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            content={
                "success": False,
                "error": {
                    "code": "CONFIG_ERROR",
                    "message": str(exc)
                }
            }
        )
    except AIProviderError as exc:
        return JSONResponse(
            status_code=status.HTTP_502_BAD_GATEWAY,
            content={
                "success": False,
                "error": {
                    "code": "PROVIDER_ERROR",
                    "message": str(exc)
                }
            }
        )
    except Exception:
        return JSONResponse(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            content={
                "success": False,
                "error": {
                    "code": "INTERNAL_ERROR",
                    "message": "An internal server error occurred while generating live order insights."
                }
            }
        )


