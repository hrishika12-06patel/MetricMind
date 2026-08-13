import sys
from contextlib import asynccontextmanager
from pathlib import Path

from fastapi import Depends, FastAPI, Query
from collections.abc import Iterable
from fastapi.exception_handlers import request_validation_exception_handler
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session
from starlette.exceptions import HTTPException as StarletteHTTPException

# Add backend and project root directories to sys.path
BASE_DIR = Path(__file__).resolve().parent
ROOT_DIR = BASE_DIR.parent
for d in [str(BASE_DIR), str(ROOT_DIR)]:
    if d not in sys.path:
        sys.path.insert(0, d)

from ai.routes import router as ai_router
import database

# Expose commonly used callables from the database module (use getattr to avoid import errors
# if they are not present). This satisfies static analysis and allows safe fallbacks at runtime.
get_db = getattr(database, "get_db", None)
test_connection = getattr(database, "test_connection", None)
create_indexes = getattr(database, "create_indexes", None)
get_all_orders = getattr(database, "get_all_orders", None)
count_total_orders = getattr(database, "count_total_orders", None)
calculate_total_sales = getattr(database, "calculate_total_sales", None)
calculate_total_profit = getattr(database, "calculate_total_profit", None)

from db_stats import (
    get_dashboard_stats,
    get_database_stats,
    get_profit_by_category,
    get_profit_by_region,
    get_sales_by_category,
    get_sales_by_region,
    get_sales_by_year,
    get_top_products,
    get_profit_by_year,
    get_unique_customer_count,
    
)


def _get_field(item, key, default=None):
    """Safely get a field from a dict-like or object-like item."""
    try:
        if isinstance(item, dict):
            return item.get(key, default)
        return getattr(item, key, default)
    except Exception:
        return default

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Use Base from the database module if available
    db_base = getattr(database, "Base", None)

    # Prefer using database.engine if available, but access it safely to avoid static errors
    eng = getattr(database, "engine", None)
    if db_base is not None and hasattr(db_base, "metadata") and eng is not None:
        db_base.metadata.create_all(bind=eng)

    # call test_connection if available (use getattr to avoid static attribute warnings)
    db_test_conn = getattr(database, "test_connection", None)
    if callable(db_test_conn):
        try:
            db_test_conn()
        except Exception:
            pass
    else:
        # fallback to module-level function if available
        fallback = globals().get("test_connection")
        if callable(fallback):
            try:
                fallback()
            except Exception:
                pass

    # create_indexes expects an engine; use eng if present
    if eng is not None:
        db_create_indexes = getattr(database, "create_indexes", None)
        if callable(db_create_indexes):
            try:
                db_create_indexes(eng)
            except Exception:
                pass
        else:
            try:
                # fallback to module-level create_indexes if present
                fallback_ci = globals().get("create_indexes")
                if callable(fallback_ci):
                    fallback_ci(eng)
            except Exception:
                pass
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

@app.exception_handler(StarletteHTTPException)
async def ai_http_exception_handler(request, exc: StarletteHTTPException):
    if request.url.path.startswith("/ai"):
        return JSONResponse(
            status_code=exc.status_code,
            content={
                "success": False,
                "error": {
                    "code": "INVALID_INPUT" if exc.status_code == 400 else "AI_ERROR",
                    "message": str(exc.detail) if exc.detail else "Invalid request."
                }
            }
        )
    return JSONResponse(
        status_code=exc.status_code,
        content={"detail": exc.detail}
    )

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
        if callable(test_connection):
            test_connection()
            return {"success": True, "message": "Database connected successfully."}
        else:
            return {"success": False, "message": "No test_connection function available."}
    except Exception as e:
        return {"success": False, "message": str(e)}

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
    # Safely call get_all_orders if available
    if callable(get_all_orders):
        raw = get_all_orders(db)
        # Ensure orders is an iterable list. If the returned value is None, non-iterable
        # or a single object, coerce to a list to avoid iteration errors.
        if raw is None:
            orders = []
        elif isinstance(raw, list):
            orders = raw
        else:
            # If raw is an iterable (but not a string/bytes), coerce to list.
            try:
                if isinstance(raw, Iterable) and not isinstance(raw, (str, bytes, dict)):
                    orders = list(raw)
                else:
                    orders = [raw]
            except Exception:
                orders = [raw]
    else:
        # fallback to empty list when function is not provided
        orders = []

    # Filter by Region
    if region:
        orders = [
            o for o in orders
            if str(_get_field(o, "Region", "")).lower() == region.lower()
        ]

    # Filter by Category
    if category:
        orders = [
            o for o in orders
            if str(_get_field(o, "Category", "")).lower() == category.lower()
        ]

    # Filter by Segment
    if segment:
        orders = [
            o for o in orders
            if str(_get_field(o, "Segment", "")).lower() == segment.lower()
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

        def _sort_key(x):
            v = _get_field(x, selected_field)
            return (v is None, v)

        orders = sorted(orders, key=_sort_key, reverse=reverse)

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
        if not callable(count_total_orders):
            return {"success": False, "message": "No count_total_orders function available."}
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
        if not callable(calculate_total_sales):
            return {"success": False, "message": "No calculate_total_sales function available."}
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
        if not callable(calculate_total_profit):
            return {"success": False, "message": "No calculate_total_profit function available."}
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
    "/reports/sales-by-region",
    tags=["Reports"],
    summary="Get Sales by Region",
    description="Returns sales grouped by region."
)
def sales_by_region(
    region: str | None = None,
    category: str | None = None,
    segment: str | None = None,
    db: Session = Depends(get_db)
):
    return get_sales_by_region(
        db,
        region=region,
        category=category,
        segment=segment
    )


@app.get(
    "/reports/sales-by-category" ,
    tags=["Reports"],
    summary="Get Sales by Category",
    description="Returns sales grouped by product category."
)
def sales_by_category(
    region: str | None = None,
    category: str | None = None,
    segment: str | None = None,
    db: Session = Depends(get_db)
):
    return get_sales_by_category(
        db,
        region=region,
        category=category,
        segment=segment
    )

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

@app.get("/reports/profit-by-year", tags=["Reports"])
def profit_by_year(db: Session = Depends(get_db)):
    return get_profit_by_year(db)

@app.get("/customers/count", tags=["Dashboard"])
def unique_customer_count(db: Session = Depends(get_db)):
    return {
        "total_customers": get_unique_customer_count(db)
    }