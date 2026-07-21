from fastapi import FastAPI, Depends
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
    calculate_average_discount,
    calculate_average_sales,
    calculate_total_quantity,
    count_unique_customers,
    sales_by_region,
    sales_by_category,
    sales_by_segment
)

app = FastAPI()

@app.on_event("startup")
def startup():
    Base.metadata.create_all(bind=engine)
    test_connection()

@app.get("/")
def root():
    return {"message": "Backend is running!"}

@app.get("/db-test")
def db_test():
    return {"status": "Database connected successfully!"}

@app.get("/orders")
def get_orders(db: Session = Depends(get_db)):
    return get_all_orders(db)

@app.get("/orders/count")
def orders_count(db: Session = Depends(get_db)):
    return {"total_orders": count_total_orders(db)}

@app.get("/orders/total-sales")
def total_sales(db: Session = Depends(get_db)):
    return {"total_sales": calculate_total_sales(db)}

@app.get("/orders/total-profit")
def total_profit(db: Session = Depends(get_db)):
    return {"total_profit": calculate_total_profit(db)}

@app.get("/orders/average-discount")
def average_discount(db: Session = Depends(get_db)):
    return {
        "average_discount": calculate_average_discount(db)
    }

@app.get("/orders/average-sales")
def average_sales(db: Session = Depends(get_db)):
    return {
        "average_sales": calculate_average_sales(db)
    }

@app.get("/orders/total-quantity")
def total_quantity(db: Session = Depends(get_db)):
    return {
        "total_quantity": calculate_total_quantity(db)
    }

@app.get("/customers/count")
def customer_count(db: Session = Depends(get_db)):
    return {
        "total_customers": count_unique_customers(db)
    }

@app.get("/sales/region")
def region_sales(db: Session = Depends(get_db)):
    return sales_by_region(db)

@app.get("/sales/category")
def category_sales(db: Session = Depends(get_db)):
    return sales_by_category(db)

@app.get("/sales/segment")
def segment_sales(db: Session = Depends(get_db)):
    return sales_by_segment(db)