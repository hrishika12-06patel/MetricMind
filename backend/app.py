from contextlib import asynccontextmanager
from fastapi import FastAPI, Depends, Query
from sqlalchemy.orm import Session
from sqlalchemy import text
from database import (
    Base, engine, test_connection, get_db,
    get_all_orders, count_total_orders,
    calculate_total_sales, calculate_total_profit,
    create_indexes, open_session, close_session
)

@asynccontextmanager
async def lifespan(app: FastAPI):
    Base.metadata.create_all(bind=engine)
    test_connection()
    create_indexes(engine)
    yield

app = FastAPI(
    title="MetricMind",
    description="Sales Analytics Backend API built using FastAPI and SQLite.",
    version="1.0.0",
    lifespan=lifespan,
    contact={
        "name": "MetricMind Team"
    }
)

@app.get("/")
def root():
    return {"message": "Backend is running!"}

@app.get("/db-test")
def db_test():
    return {"status": "Database connected successfully!"}

@app.get(
    "/orders",
    tags=["Orders"],
    summary="Get Orders",
    description="Returns all orders with optional filtering, sorting and pagination."
)
def get_orders(
    region: str | None = Query(default=None, description="Filter by region"),
    category: str | None = Query(default=None, description="Filter by category"),
    segment: str | None = Query(default=None, description="Filter by segment"),
    page: int = Query(default=1, ge=1, description="Page number"),
    limit: int = Query(default=20, ge=1, le=100, description="Number of records per page"),
    sort_by: str | None = Query(
        default=None,
        description="Sort by Sales, Profit, Region or Category"
    ),
    order: str = Query(
        default="asc",
        description="Sorting order: asc or desc"
    ),
    db: Session = Depends(get_db)
):
    orders = get_all_orders(db)

    # Filter by Region
    if region:
        orders = [
            o for o in orders
            if str(o.get("Region", "")).lower() == region.lower()
        ]

    # Filter by Category
    if category:
        orders = [
            o for o in orders
            if str(o.get("Category", "")).lower() == category.lower()
        ]

    # Filter by Segment
    if segment:
        orders = [
            o for o in orders
            if str(o.get("Segment", "")).lower() == segment.lower()
        ]

    # Sorting
    allowed_fields = [
        "Sales",
        "Profit",
        "Region",
        "Category"
    ]

    if sort_by:

        if sort_by not in allowed_fields:
            return {
                "error": "Invalid sort field.",
                "allowed_fields": allowed_fields
            }

        reverse = order.lower() == "desc"

        orders = sorted(
            orders,
            key=lambda x: x.get(sort_by),
            reverse=reverse
        )

    # Pagination
    start = (page - 1) * limit
    end = start + limit

    return {
        "page": page,
        "limit": limit,
        "total_records": len(orders),
        "data": orders[start:end]
    }

@app.get("/orders/count")
def orders_count(db: Session = Depends(get_db)):
    return {"total_orders": count_total_orders(db)}

@app.get("/orders/total-sales")
def total_sales(db: Session = Depends(get_db)):
    return {"total_sales": calculate_total_sales(db)}

@app.get("/orders/total-profit")
def total_profit(db: Session = Depends(get_db)):
    return {"total_profit": calculate_total_profit(db)}

@app.get("/db/indexes")
def show_indexes():
    return {"indexes": ["idx_orders_region", "idx_orders_category", "idx_orders_segment"]}