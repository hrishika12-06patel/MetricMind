from contextlib import asynccontextmanager

from fastapi import FastAPI, Depends, Query
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

from database import (
    Base,
    engine,
    test_connection, 
    get_db,
    get_all_orders, 
    count_total_orders,
    calculate_total_sales, 
    calculate_total_profit,
    create_indexes, 
    open_session, 
    close_session
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
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
@app.get("/")
def root():
    return {
         "success": True,
        "message": "Backend is running.",
        "data": {
            "project": "MetricMind",
            "version": "1.0.0"
        }
    }

@app.get("/db-test")
def db_test():
    try:
        test_connection()
        return {
            "success": True,
            "message": "Database connected successfully."
        }
    except Exception as e:
        return {
            "success": False,
            "message": str(e)
        }

@app.get("/health")
def health_check():
    return {
        "success": True,
        "message": "API is healthy.",
        "data": {
            "status": "running"
        }
    }

@app.get("/info")
def project_info():
    return {
        "success": True,
        "message": "Project information retrieved successfully.",
        "data": {
            "project_name": "MetricMind",
            "version": "1.0.0",
            "database": "SQLite",
            "framework": "FastAPI"
        }
    }


@app.get(
    "/orders",
    tags=["Orders"],
    summary="Get Orders",
    description="Returns all orders with optional filtering, sorting and pagination."
)
def get_orders(
    region: str | None = Query(
        default=None,
        description="Filter orders by region (e.g., East, West, South, Central)."
    ),
    category: str | None = Query(
        default=None,
        description="Filter orders by product category (e.g., Furniture, Technology, Office Supplies)."
    ),
    segment: str | None = Query(
        default=None,
        description="Filter orders by customer segment (e.g., Consumer, Corporate, Home Office)."
    ),
    page: int = Query(
        default=1,
        ge=1,
        description="Page number for paginated results. Must be greater than or equal to 1."
    ),
    limit: int = Query(
        default=20,
        ge=1,
        le=100,
        description="Number of records to return per page. Allowed range: 1 to 100."
    ),
    sort_by: str | None = Query(
        default=None,
        description="Sort results by Sales, Profit, Region, or Category."
    ),
    order: str = Query(
        default="asc",
        description="Sorting order. Use 'asc' for ascending or 'desc' for descending."
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
    selected_field = None

    if sort_by:
        field_mapping = {
            "sales": "Sales",
            "profit": "Profit",
            "region": "Region",
            "category": "Category"
        }

        selected_field = field_mapping.get(sort_by.lower())

        if selected_field is None:
            return {
                "success": False,
                "message": "Invalid sort field.",
                "allowed_fields": allowed_fields
            }
        if order.lower() not in ["asc", "desc"]:
            return {
                "success": False,
                "message": "Invalid order value.",
                "allowed_values": ["asc", "desc"]
            }
        reverse = order.lower() == "desc"

        orders = sorted(
            orders,
            key=lambda x: x.get(selected_field),
            reverse=reverse
        )

    # Pagination
    start = (page - 1) * limit
    end = start + limit

    return {
        "success": True,
        "message": "Orders fetched successfully.",
        "page": page,
        "limit": limit,
        "total_records": len(orders),
        "data": orders[start:end]
    }

@app.get("/orders/count")
def orders_count(db: Session = Depends(get_db)):
    try:
        total = count_total_orders(db)

        return {
            "success": True,
            "message": "Total orders fetched successfully.",
            "total_orders": total
        }

    except Exception as e:
        return {
            "success": False,
            "message": str(e)
        }

@app.get("/orders/total-sales")
def total_sales(db: Session = Depends(get_db)):
    try:
        sales = calculate_total_sales(db)

        return {
            "success": True,
            "message": "Total sales calculated successfully.",
            "total_sales": sales
        }

    except Exception as e:
        return {
            "success": False,
            "message": str(e)
        }

@app.get("/orders/total-profit")
def total_profit(db: Session = Depends(get_db)):
    try:
        profit = calculate_total_profit(db)

        return {
            "success": True,
            "message": "Total profit calculated successfully.",
            "total_profit": profit
        }

    except Exception as e:
        return {
            "success": False,
            "message": str(e)
        }

@app.get("/db/indexes")
def show_indexes():
    return {
        "success": True,
        "message": "Database indexes retrieved successfully.",
        "indexes": [
            "idx_order_id",
            "idx_customer_id",
            "idx_region",
            "idx_category"
        ]
    }