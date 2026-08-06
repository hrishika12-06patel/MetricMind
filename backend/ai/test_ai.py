"""
Script to test the MetricMind AI module and LangChain integration independently.

Run from backend directory:
    python ai/test_ai.py
or
    python -m ai.test_ai
"""

import os
import sys
from pathlib import Path

# Add backend directory to sys.path if not already present
BACKEND_DIR = Path(__file__).resolve().parent.parent
if str(BACKEND_DIR) not in sys.path:
    sys.path.insert(0, str(BACKEND_DIR))

try:
    from ai.insight_service import AIInsightService, InsightService
except ImportError:
    from insight_service import AIInsightService, InsightService


sample_sales_text = """
Global Superstore Sales Data - Q3 Report

Sales:
- Technology: $120,500 (Profit: $24,100)
- Office Supplies: $85,200 (Profit: $12,780)
- Furniture: $64,300 (Profit: -$3,200)

Regional Distribution:
- East: $110,000
- West: $95,000
- Central: $65,000
"""

sample_orders_data = {
    "total_orders": 1250,
    "total_sales": 345000.75,
    "total_profit": 48200.50,
    "top_category": "Technology",
    "underperforming_category": "Furniture",
    "regions": {
        "East": 120000,
        "West": 140000,
        "South": 85000
    }
}


def test_sales_text_summary():
    print("\n" + "=" * 60)
    print("TEST 1: Sales Data Text Summary")
    print("=" * 60)

    try:
        response = InsightService.summarize_dataset(sample_sales_text, data_type="sales")
        print("\nAI RESPONSE (Sales Summary):\n")
        print(response)
        print("\n[SUCCESS] Test 1 passed!")
        return True
    except Exception as e:
        print("\n[FAILED] Test 1 failed with error:")
        print(e)
        return False


def test_orders_structured_summary():
    print("\n" + "=" * 60)
    print("TEST 2: Structured Orders Summary")
    print("=" * 60)

    try:
        response = AIInsightService.summarize_orders(sample_orders_data)
        print("\nAI RESPONSE (Order Insights):\n")
        print(response)
        print("\n[SUCCESS] Test 2 passed!")
        return True
    except Exception as e:
        print("\n[FAILED] Test 2 failed with error:")
        print(e)
        return False


def main():
    print("=" * 60)
    print("MetricMind AI Integration Test Suite")
    print("=" * 60)

    t1_success = test_sales_text_summary()
    t2_success = test_orders_structured_summary()

    print("\n" + "=" * 60)
    if t1_success and t2_success:
        print("ALL AI TESTS PASSED SUCCESSFULLY! AI WORKFLOW OPERATIONAL.")
    else:
        print("SOME AI TESTS FAILED. PLEASE CHECK LOGS ABOVE.")
    print("=" * 60)


if __name__ == "__main__":
    main()