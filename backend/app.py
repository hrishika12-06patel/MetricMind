import sys
from contextlib import asynccontextmanager
from pathlib import Path

from fastapi import Depends, FastAPI, Query
from fastapi.exception_handlers import request_validation_exception_handler
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session

# Add backend and project root directories to sys.path
BASE_DIR = Path(__file__).resolve().parent
ROOT_DIR = BASE_DIR.parent
for d in [str(BASE_DIR), str(ROOT_DIR)]:
    if d not in sys.path:
        sys.path.insert(0, d)

from ai.routes import router as ai_router
from database import (
    Base,
    calculate_total_profit,
    calculate_total_sales,
    count_total_orders,
    create_indexes,
    engine,
    get_all_orders,
    get_db,
    test_connection,
)
from db_stats import (
    get_dashboard_stats,
    get_database_stats,
    get_profit_by_category,
    get_profit_by_region,
    get_sales_by_category,
    get_sales_by_region,
    get_sales_by_year,
    get_top_products,
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

@app.exception_handler(RequestValidationError)
async def ai_request_validation_exception_handler(request, exc: RequestValidationError):
    if request.url.path.startswith("/ai"):
        error_messages = []
        for error in exc.errors():
            loc = " -> ".join([str(l) for l in error.get("loc", []) if l != "body"])
            msg = error.get("msg", "")
            error_messages.append(f"{loc}: {msg}" if loc else msg)
        clean_msg = "; ".join(error_messages) if error_messages else "Invalid request payload format."
        return JSONResponse(
            status_code=400,
            content={
                "success": False,
                "error": {
                    "code": "INVALID_INPUT",
                    "message": f"Validation Error: {clean_msg}"
                }
            }
        )
    return await request_validation_exception_handler(request, exc)

app.include_router(ai_router)

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

@app.get("/database/stats")
def database_stats(db: Session = Depends(get_db)):
    return get_database_stats(db)

@app.get(
    "/dashboard/stats",
    tags=["Dashboard"],
    summary="Get Dashboard Statistics",
    description="Returns key business statistics for the dashboard."
)
def dashboard_stats(db: Session = Depends(get_db)):
    try:
        stats = get_dashboard_stats(db)

        return {
            "success": True,
            "message": "Dashboard statistics fetched successfully.",
            "data": stats
        }

    except Exception as e:
        return {
            "success": False,
            "message": str(e)
        }

@app.get(
    "/sales/by-region",
    tags=["Sales"],
    summary="Get Sales by Region",
    description="Returns sales grouped by region."
)
def sales_by_region(db: Session = Depends(get_db)):
    try:
        data = get_sales_by_region(db)

        return {
            "success": True,
            "message": "Sales by region fetched successfully.",
            "data": data
        }

    except Exception as e:
        return {
            "success": False,
            "message": str(e)
        }


@app.get(
    "/sales/by-category",
    tags=["Sales"],
    summary="Get Sales by Category",
    description="Returns sales grouped by product category."
)
def sales_by_category(db: Session = Depends(get_db)):
    try:
        data = get_sales_by_category(db)

        return {
            "success": True,
            "message": "Sales by category fetched successfully.",
            "data": data
        }

    except Exception as e:
        return {
            "success": False,
            "message": str(e)
        }


@app.get(
    "/sales/by-year",
    tags=["Sales"],
    summary="Get Sales by Year",
    description="Returns sales grouped by year."
)
def sales_by_year(db: Session = Depends(get_db)):
    try:
        data = get_sales_by_year(db)

        return {
            "success": True,
            "message": "Sales by year fetched successfully.",
            "data": data
        }

    except Exception as e:
        return {
            "success": False,
            "message": str(e)
        }

@app.get(
    "/reports/profit-by-region",
    tags=["Reports"],
    summary="Get Profit by Region",
    description="Returns profit grouped by region."
)
def profit_by_region(db: Session = Depends(get_db)):
    try:
        data = get_profit_by_region(db)

        return {
            "success": True,
            "message": "Profit by region fetched successfully.",
            "data": data
        }

    except Exception as e:
        return {
            "success": False,
            "message": str(e)
        }


@app.get(
    "/reports/profit-by-category",
    tags=["Reports"],
    summary="Get Profit by Category",
    description="Returns profit grouped by product category."
)
def profit_by_category(db: Session = Depends(get_db)):
    try:
        data = get_profit_by_category(db)

        return {
            "success": True,
            "message": "Profit by category fetched successfully.",
            "data": data
        }

    except Exception as e:
        return {
            "success": False,
            "message": str(e)
        }


@app.get(
    "/reports/top-products",
    tags=["Reports"],
    summary="Get Top Products",
    description="Returns the top-performing products."
)
def top_products(db: Session = Depends(get_db)):
    try:
        data = get_top_products(db)

        return {
            "success": True,
            "message": "Top products fetched successfully.",
            "data": data
        }

    except Exception as e:
        return {
            "success": False,
            "message": str(e)
        }
