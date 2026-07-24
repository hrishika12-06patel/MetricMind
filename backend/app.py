from contextlib import asynccontextmanager

from fastapi import FastAPI, Depends
from sqlalchemy.orm import Session
from database import (Base, engine, test_connection, get_db,
                      get_all_orders, count_total_orders,
                      calculate_total_sales, calculate_total_profit,
                      create_indexes, open_session, close_session,
                      get_sales_by_region, get_sales_by_category,
                      get_sales_by_segment)
from sqlalchemy import text

@asynccontextmanager
async def lifespan(app: FastAPI):
    Base.metadata.create_all(bind=engine)
    test_connection()
    create_indexes(engine)
    yield

app = FastAPI(
    title="MetricMind API",
    description="Backend APIs for sales analytics and dashboard metrics.",
    version="1.0.0",
    contact={
        "name": "MetricMind Team"
    }
)

@app.get(
    "/",
    tags=["General"],
    summary="Home",
    description="Returns the welcome message of the backend."
)
def root():
    return {"message": "Backend is running!"}

@app.get(
    "/health",
    tags=["General"],
    summary="Health Check",
    description="Checks whether the backend server is running."
)
def health():
    return {
        "status": "Healthy",
        "server": "MetricMind Backend"
    }

@app.get(
        "/db-test",
        tags=["Database"],
    summary="Database Connection Test",
    description="Verifies that the backend can connect to the SQLite database."
    )
def db_test():
    return {"status": "Database connected successfully!"}

@app.get(
        "/orders",
        tags=["Orders"],
    summary="Get All Orders",
    description="Returns all order records stored in the database."
    )
def get_orders(db: Session = Depends(get_db)):
    return get_all_orders(db)

@app.get(
        "/orders/count",
        tags=["Orders"],
    summary="Get Total Orders",
    description="Returns the total number of orders in the database."
    )
def orders_count(db: Session = Depends(get_db)):
    return {"total_orders": count_total_orders(db)}

@app.get(
        "/orders/total-sales",
        tags=["Orders"],
    summary="Get Total Sales",
    description="Returns the total sales amount across all orders."
    )
def total_sales(db: Session = Depends(get_db)):
    return {"total_sales": calculate_total_sales(db)}

@app.get(
        "/orders/total-profit",
        tags=["Orders"],
    summary="Get Total Profit",
    description="Returns the total profit across all orders."
    )
def total_profit(db: Session = Depends(get_db)):
    return {"total_profit": calculate_total_profit(db)}

@app.get(
        "/db/indexes",
        tags=["Database"],
    summary="Show Database Indexes",
    description="Returns a list of all indexes in the database."
    )
def show_indexes():
    db = open_session()
    try:
        result = db.execute(text(
            "SELECT name FROM sqlite_master WHERE type='index'"
        ))
        indexes = [row[0] for row in result.fetchall()]
        return {"indexes": indexes}
    finally:
        close_session(db)

@app.get(
    "/sales/region",
    tags=["Sales"],
    summary="Get Sales by Region",
    description="Returns sales data grouped by region."
)
def sales_region(db: Session = Depends(get_db)):
    return get_sales_by_region(db)

@app.get(
    "/sales/category",
    tags=["Sales"],
    summary="Get Sales by Category",
    description="Returns sales data grouped by category."
)
def sales_category(db: Session = Depends(get_db)):
    return get_sales_by_category(db)

@app.get(
    "/sales/segment",
    tags=["Sales"],
    summary="Get Sales by Segment",
    description="Returns sales data grouped by segment."
)
def sales_segment(db: Session = Depends(get_db)):
    return get_sales_by_segment(db)

@app.get(
    "/api-info",
    tags=["General"],
    summary="Available APIs",
    description="Displays all available API endpoints."
)
def api_info():
    return {
        "available_endpoints": [
            "/",
            "/health",
            "/db-test",
            "/orders",
            "/orders/count",
            "/orders/total-sales",
            "/orders/total-profit",
            "/db/indexes",
            "/sales/region",
            "/sales/category",
            "/sales/segment"
        ]
    }
        