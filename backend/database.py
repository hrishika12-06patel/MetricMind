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

def create_indexes(engine):
    with engine.connect() as conn:
        indexes = [
            'CREATE INDEX IF NOT EXISTS idx_order_id ON orders ("Order.ID")',
            'CREATE INDEX IF NOT EXISTS idx_customer_id ON orders ("Customer.ID")',
            'CREATE INDEX IF NOT EXISTS idx_region ON orders ("Region")',
            'CREATE INDEX IF NOT EXISTS idx_category ON orders ("Category")',
        ]
        for idx in indexes:
            try:
                conn.execute(text(idx))
                print(f"✅ Index created: {idx.split('idx_')[1].split(' ')[0]}")
            except Exception as e:
                print(f"⚠️ Index skipped: {e}")
        conn.commit()
    print("✅ All indexes processed!")

def open_session():
    db = SessionLocal()
    return db

def close_session(db):
    db.close()
    print("✅ Session closed.")