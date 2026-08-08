"""
db_stats.py - Dashboard statistics helper functions for MetricMind backend.
Provides reusable functions for dashboard, sales, and reports APIs.
"""

from sqlalchemy.orm import Session
from sqlalchemy import text


# ─── Dashboard Statistics ─────────────────────────────────

def get_dashboard_stats(db: Session) -> dict:
    """
    Retrieve dashboard statistics including:
    - Total Orders
    - Total Sales
    - Total Profit
    - Average Sales
    - Average Profit
    """
    try:
        result = db.execute(text("""
            SELECT
                COUNT(*) as total_orders,
                COALESCE(SUM(Sales), 0) as total_sales,
                COALESCE(SUM(Profit), 0) as total_profit,
                COALESCE(AVG(Sales), 0) as avg_sales,
                COALESCE(AVG(Profit), 0) as avg_profit
            FROM Orders
        """))
        row = result.fetchone()
        return {
            "total_orders": row[0] or 0,
            "total_sales": round(float(row[1]), 2),
            "total_profit": round(float(row[2]), 2),
            "avg_sales": round(float(row[3]), 2),
            "avg_profit": round(float(row[4]), 2)
        }
    except Exception as e:
        print(f"❌ Error fetching dashboard stats: {e}")
        return {
            "total_orders": 0,
            "total_sales": 0.0,
            "total_profit": 0.0,
            "avg_sales": 0.0,
            "avg_profit": 0.0
        }


# ─── Sales Statistics ─────────────────────────────────────

def get_sales_by_region(db: Session) -> list:
    """Get total sales grouped by region."""
    try:
        result = db.execute(text("""
            SELECT Region, COALESCE(SUM(Sales), 0) as total_sales
            FROM Orders
            GROUP BY Region
            ORDER BY total_sales DESC
        """))
        rows = result.fetchall()
        return [{"region": row[0], "total_sales": round(float(row[1]), 2)} for row in rows]
    except Exception as e:
        print(f"❌ Error fetching sales by region: {e}")
        return []


def get_sales_by_category(db: Session) -> list:
    """Get total sales grouped by category."""
    try:
        result = db.execute(text("""
            SELECT Category, COALESCE(SUM(Sales), 0) as total_sales
            FROM Orders
            GROUP BY Category
            ORDER BY total_sales DESC
        """))
        rows = result.fetchall()
        return [{"category": row[0], "total_sales": round(float(row[1]), 2)} for row in rows]
    except Exception as e:
        print(f"❌ Error fetching sales by category: {e}")
        return []


def get_sales_by_year(db: Session) -> list:
    """Get total sales grouped by year."""
    try:
        result = db.execute(text("""
            SELECT Year, COALESCE(SUM(Sales), 0) as total_sales
            FROM Orders
            GROUP BY Year
            ORDER BY Year
        """))
        rows = result.fetchall()
        return [{"year": row[0], "total_sales": round(float(row[1]), 2)} for row in rows]
    except Exception as e:
        print(f"❌ Error fetching sales by year: {e}")
        return []


# ─── Reports Statistics ───────────────────────────────────

def get_profit_by_region(db: Session) -> list:
    """Get total profit grouped by region."""
    try:
        result = db.execute(text("""
            SELECT Region, COALESCE(SUM(Profit), 0) as total_profit
            FROM Orders
            GROUP BY Region
            ORDER BY total_profit DESC
        """))
        rows = result.fetchall()
        return [{"region": row[0], "total_profit": round(float(row[1]), 2)} for row in rows]
    except Exception as e:
        print(f"❌ Error fetching profit by region: {e}")
        return []


def get_profit_by_category(db: Session) -> list:
    """Get total profit grouped by category."""
    try:
        result = db.execute(text("""
            SELECT Category, COALESCE(SUM(Profit), 0) as total_profit
            FROM Orders
            GROUP BY Category
            ORDER BY total_profit DESC
        """))
        rows = result.fetchall()
        return [{"category": row[0], "total_profit": round(float(row[1]), 2)} for row in rows]
    except Exception as e:
        print(f"❌ Error fetching profit by category: {e}")
        return []


def get_top_products(db: Session, limit: int = 10) -> list:
    """Get top selling products by sales."""
    try:
        result = db.execute(text(f"""
            SELECT "Product.Name", COALESCE(SUM(Sales), 0) as total_sales
            FROM Orders
            GROUP BY "Product.Name"
            ORDER BY total_sales DESC
            LIMIT {limit}
        """))
        rows = result.fetchall()
        return [{"product": row[0], "total_sales": round(float(row[1]), 2)} for row in rows]
    except Exception as e:
        print(f"❌ Error fetching top products: {e}")
        return []


# ─── Legacy function for backward compatibility ────────────
def get_database_stats(db: Session) -> dict:
    """Legacy function - use get_dashboard_stats instead."""
    return get_dashboard_stats(db)