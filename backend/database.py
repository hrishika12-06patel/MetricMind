"""
database.py - Database configuration and helper functions for MetricMind backend.
Handles connection setup, session management, indexing, and query functions.
"""

import os
from sqlalchemy import create_engine, text
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

# ─── Database Configuration ───────────────────────────────
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATABASE_URL = f"sqlite:///{os.path.join(BASE_DIR, '..', 'database', 'metricmind.db')}"

engine = create_engine(
    DATABASE_URL, connect_args={"check_same_thread": False}
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

# ─── Session Management ───────────────────────────────────

def get_db():
    """Yield a database session and ensure it is closed after use."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def open_session():
    """Open and return a new database session."""
    return SessionLocal()

def close_session(db):
    """Close the given database session."""
    try:
        db.close()
        print("[OK] Session closed.")
    except Exception as e:
        print(f"[ERROR] Error closing session: {e}")

# ─── Connection Test ──────────────────────────────────────

def test_connection():
    """Test that the database connection is working."""
    try:
        with engine.connect() as conn:
            conn.execute(text("SELECT 1"))
        print("[OK] Database connected successfully!")
    except Exception as e:
        print(f"[ERROR] Connection failed: {e}")

# ─── Index Management ─────────────────────────────────────

def create_indexes(engine):
    """Create indexes on commonly queried columns for better performance."""
    indexes = [
        'CREATE INDEX IF NOT EXISTS idx_order_id ON orders ("Order.ID")',
        'CREATE INDEX IF NOT EXISTS idx_customer_id ON orders ("Customer.ID")',
        'CREATE INDEX IF NOT EXISTS idx_region ON orders ("Region")',
        'CREATE INDEX IF NOT EXISTS idx_category ON orders ("Category")',
    ]
    try:
        with engine.connect() as conn:
            for idx in indexes:
                try:
                    conn.execute(text(idx))
                    name = idx.split("idx_")[1].split(" ")[0]
                    print(f"[OK] Index created: {name}")
                except Exception as e:
                    print(f"[WARNING] Index skipped: {e}")
            conn.commit()
        print("[OK] All indexes processed!")
    except Exception as e:
        print(f"[ERROR] Error creating indexes: {e}")

# ─── Query Functions ──────────────────────────────────────

def get_all_orders(db):
    """Retrieve all orders from the database. Returns empty list if none found."""
    try:
        result = db.execute(text("SELECT * FROM orders"))
        rows = result.fetchall()
        return [dict(row._mapping) for row in rows]
    except Exception as e:
        print(f"[ERROR] Error fetching orders: {e}")
        return []

def count_total_orders(db):
    """Count total number of orders. Returns 0 if table is empty."""
    try:
        result = db.execute(text("SELECT COUNT(*) as total FROM orders"))
        row = result.fetchone()
        return row._mapping["total"] if row else 0
    except Exception as e:
        print(f"[ERROR] Error counting orders: {e}")
        return 0

def calculate_total_sales(db):
    """Calculate total sales amount. Returns 0 if no data found."""
    try:
        result = db.execute(text("SELECT SUM(Sales) as total_sales FROM orders"))
        row = result.fetchone()
        return row._mapping["total_sales"] or 0
    except Exception as e:
        print(f"[ERROR] Error calculating sales: {e}")
        return 0

def calculate_total_profit(db):
    """Calculate total profit. Returns 0 if no data found."""
    try:
        result = db.execute(text("SELECT SUM(Profit) as total_profit FROM orders"))
        row = result.fetchone()
        return row._mapping["total_profit"] or 0
    except Exception as e:
        print(f"[ERROR] Error calculating profit: {e}")
        return 0