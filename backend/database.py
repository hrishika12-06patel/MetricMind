import os
from sqlalchemy import create_engine, text
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATABASE_URL = f"sqlite:///{os.path.join(BASE_DIR, '..', 'database', 'metricmind.db')}"

engine = create_engine(
    DATABASE_URL, connect_args={"check_same_thread": False}
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def test_connection():
    try:
        with engine.connect() as conn:
            conn.execute(text("SELECT 1"))
        print("✅ Database connected successfully!")
    except Exception as e:
        print(f"❌ Connection failed: {e}")

def get_all_orders(db):
    result = db.execute(text("SELECT * FROM orders"))
    rows = result.fetchall()
    return [dict(row._mapping) for row in rows]

def count_total_orders(db):
    result = db.execute(text("SELECT COUNT(*) as total FROM orders"))
    row = result.fetchone()
    return row._mapping["total"]

def calculate_total_sales(db):
    result = db.execute(text("SELECT SUM(sales) as total_sales FROM orders"))
    row = result.fetchone()
    return row._mapping["total_sales"] or 0

def calculate_total_profit(db):
    result = db.execute(text("SELECT SUM(profit) as total_profit FROM orders"))
    row = result.fetchone()
    return row._mapping["total_profit"] or 0

def calculate_average_discount(db):
    result = db.execute(
        text("SELECT AVG(discount) AS average_discount FROM orders")
    )

    row = result.fetchone()

    return row._mapping["average_discount"] or 0

def calculate_average_sales(db):
    result = db.execute(
        text("SELECT AVG(sales) AS average_sales FROM orders")
    )

    row = result.fetchone()

    return row._mapping["average_sales"] or 0

def calculate_total_quantity(db):
    result = db.execute(
        text("SELECT SUM(quantity) AS total_quantity FROM orders")
    )

    row = result.fetchone()

    return row._mapping["total_quantity"] or 0