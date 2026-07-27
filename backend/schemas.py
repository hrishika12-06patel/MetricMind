"""
schemas.py

Pydantic response models for MetricMind APIs.
These models improve API validation and Swagger/OpenAPI documentation.
"""

from datetime import date
from typing import List, Optional

from pydantic import BaseModel, Field


# --------------------------------------------------------------------
# Order Response
# --------------------------------------------------------------------

class OrderResponse(BaseModel):
    """Response model representing a single order."""

    order_id: str = Field(..., description="Unique order identifier")
    order_date: date = Field(..., description="Order date")
    customer_id: str = Field(..., description="Unique customer identifier")

    customer_name: Optional[str] = Field(
        None,
        description="Customer name"
    )

    category: str = Field(..., description="Product category")

    sub_category: Optional[str] = Field(
        None,
        description="Product sub-category"
    )

    segment: str = Field(..., description="Customer segment")
    region: str = Field(..., description="Sales region")

    ship_mode: Optional[str] = Field(
        None,
        description="Shipping method"
    )

    sales: float = Field(..., ge=0, description="Sales amount")
    quantity: int = Field(..., ge=0, description="Quantity sold")

    discount: Optional[float] = Field(
        None,
        ge=0,
        le=1,
        description="Discount applied (0–1)"
    )

    profit: Optional[float] = Field(
        None,
        description="Profit earned"
    )


# --------------------------------------------------------------------
# Order Count
# --------------------------------------------------------------------

class OrderCountResponse(BaseModel):
    """Response model for total order count."""

    total_orders: int = Field(
        ...,
        ge=0,
        description="Total number of orders"
    )


# --------------------------------------------------------------------
# Total Sales
# --------------------------------------------------------------------

class TotalSalesResponse(BaseModel):
    """Response model for sales summary."""

    net_sales: float = Field(
        ...,
        ge=0,
        description="Net sales after discounts"
    )

    gross_sales: float = Field(
        ...,
        ge=0,
        description="Gross sales before discounts"
    )


# --------------------------------------------------------------------
# Total Profit
# --------------------------------------------------------------------

class TotalProfitResponse(BaseModel):
    """Response model for profit summary."""

    total_profit: float = Field(
        ...,
        description="Total profit"
    )

    profit_margin: float = Field(
        ...,
        ge=-1,
        le=1,
        description="Profit margin ratio"
    )


# --------------------------------------------------------------------
# Sales by Region
# --------------------------------------------------------------------

class SalesByRegionItem(BaseModel):
    """Sales summary for a region."""

    region: str = Field(..., description="Region name")

    total_sales: float = Field(
        ...,
        ge=0,
        description="Total sales"
    )

    total_orders: Optional[int] = Field(
        None,
        ge=0,
        description="Total orders"
    )


class SalesByRegionResponse(BaseModel):
    """Response containing regional sales."""

    results: List[SalesByRegionItem]


# --------------------------------------------------------------------
# Sales by Category
# --------------------------------------------------------------------

class SalesByCategoryItem(BaseModel):
    """Sales summary for a category."""

    category: str = Field(..., description="Product category")

    total_sales: float = Field(
        ...,
        ge=0,
        description="Total sales"
    )

    total_orders: Optional[int] = Field(
        None,
        ge=0,
        description="Total orders"
    )


class SalesByCategoryResponse(BaseModel):
    """Response containing category-wise sales."""

    results: List[SalesByCategoryItem]


# --------------------------------------------------------------------
# Sales by Segment
# --------------------------------------------------------------------

class SalesBySegmentItem(BaseModel):
    """Sales summary for a customer segment."""

    segment: str = Field(..., description="Customer segment")

    total_sales: float = Field(
        ...,
        ge=0,
        description="Total sales"
    )

    total_orders: Optional[int] = Field(
        None,
        ge=0,
        description="Total orders"
    )


class SalesBySegmentResponse(BaseModel):
    """Response containing segment-wise sales."""

    results: List[SalesBySegmentItem]