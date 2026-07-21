from fastapi import FastAPI, Depends
from sqlalchemy.orm import Session
from database import (Base, engine, test_connection, get_db,
                      get_all_orders, count_total_orders,
                      calculate_total_sales, calculate_total_profit,
                      create_indexes, open_session, close_session)
from sqlalchemy import text

app = FastAPI()

@app.on_event("startup")
def startup():
    Base.metadata.create_all(bind=engine)
    test_connection()
    create_indexes(engine)

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

@app.get("/db/indexes")
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