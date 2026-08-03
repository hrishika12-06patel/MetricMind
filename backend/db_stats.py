"""
db_stats.py - Database statistics helper functions for MetricMind.
Provides quick database insights without modifying existing APIs.
"""

from sqlalchemy.orm import Session
from sqlalchemy import text


def get_database_stats(db: Session) -> dict:
    """
    Retrieve useful database statistics including:
    - Total number of orders
    - Total sales
    - Total profit
    """
    try:
        # Total number of orders
        count_result = db.execute(text("SELECT COUNT(*) as total FROM Orders"))
        total_orders = count_result.fetchone()[0] or 0

        # Total sales
        sales_result = db.execute(text("SELECT SUM(Sales) as total_sales FROM Orders"))
        total_sales = sales_result.fetchone()[0] or 0

        # Total profit
        profit_result = db.execute(text("SELECT SUM(Profit) as total_profit FROM Orders"))
        total_profit = profit_result.fetchone()[0] or 0

        return {
            "total_orders": total_orders,
            "total_sales": round(float(total_sales), 2),
            "total_profit": round(float(total_profit), 2)
        }

    except Exception as e:
        print(f"❌ Error fetching stats: {e}")
        return {
            "total_orders": 0,
            "total_sales": 0.0,
            "total_profit": 0.0
        }