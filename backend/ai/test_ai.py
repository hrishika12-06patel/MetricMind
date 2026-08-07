"""
Script to test the MetricMind AI module, LangChain integration, and FastAPI AI endpoints.

Run from workspace root:
    .\.venv\Scripts\python.exe backend/ai/test_ai.py
or from backend directory:
    python ai/test_ai.py
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

try:
    from database import open_session, close_session
except ImportError:
    from backend.database import open_session, close_session

from fastapi.testclient import TestClient
from app import app

client = TestClient(app)

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
    print("\n" + "=" * 60, flush=True)
    print("TEST 1: Sales Data Text Summary (Service Layer)", flush=True)
    print("=" * 60, flush=True)

    try:
        response = InsightService.summarize_dataset(sample_sales_text, data_type="sales")
        print("\nAI RESPONSE (Sales Summary):\n")
        print(response[:400] + "...\n[Truncated for brevity]")
        print("\n[SUCCESS] Test 1 passed!")
        return True
    except Exception as e:
        print("\n[FAILED] Test 1 failed with error:")
        print(e)
        return False


def test_orders_structured_summary():
    print("\n" + "=" * 60)
    print("TEST 2: Structured Orders Summary (Service Layer)")
    print("=" * 60)

    try:
        response = AIInsightService.summarize_orders(sample_orders_data)
        print("\nAI RESPONSE (Order Insights):\n")
        print(response[:400] + "...\n[Truncated for brevity]")
        print("\n[SUCCESS] Test 2 passed!")
        return True
    except Exception as e:
        print("\n[FAILED] Test 2 failed with error:")
        print(e)
        return False


def test_live_db_orders_summary():
    print("\n" + "=" * 60)
    print("TEST 3: Live Database Orders AI Summary (DB + AI)")
    print("=" * 60)

    session = None
    try:
        session = open_session()
        result = AIInsightService.summarize_db_orders(db_session=session, region="East")
        print("\nCOMPUTED METRICS FROM DB:")
        print(result["metrics"])
        print("\nAI RESPONSE (Live DB Order Insights):\n")
        print(result["ai_summary"][:400] + "...\n[Truncated for brevity]")
        print("\n[SUCCESS] Test 3 passed!")
        return True
    except Exception as e:
        print("\n[FAILED] Test 3 failed with error:")
        print(e)
        return False
    finally:
        if session:
            close_session(session)


def test_fastapi_summary_endpoint():
    print("\n" + "=" * 60)
    print("TEST 4: FastAPI POST /ai/summary Endpoint Test")
    print("=" * 60)

    try:
        payload = {
            "dataset": sample_orders_data,
            "data_type": "orders",
            "question": "Provide key executive summary and actionable recommendations."
        }
        res = client.post("/ai/summary", json=payload)
        print(f"HTTP Status Code: {res.status_code}")
        assert res.status_code == 200, f"Expected 200, got {res.status_code}"

        data = res.json()
        assert data.get("success") is True
        assert "summary" in data
        assert data.get("data", {}).get("data_type") == "orders"

        print("\nFASTAPI RESPONSE SUMMARY:\n")
        print(data["summary"][:400] + "...\n[Truncated for brevity]")
        print("\n[SUCCESS] Test 4 passed!")
        return True
    except Exception as e:
        print("\n[FAILED] Test 4 failed with error:")
        print(e)
        return False


def test_fastapi_validation():
    print("\n" + "=" * 60, flush=True)
    print("TEST 5: FastAPI Input Validation Test (Empty Payload Handling)", flush=True)
    print("=" * 60, flush=True)

    try:
        payload = {
            "dataset": "   ",
            "data_type": "sales"
        }
        res = client.post("/ai/summary", json=payload)
        print(f"HTTP Status Code (Empty String): {res.status_code}", flush=True)
        assert res.status_code in [400, 422], f"Expected 400 or 422, got {res.status_code}"

        print("Validation response detail:", res.json()["detail"], flush=True)
        print("\n[SUCCESS] Test 5 passed!", flush=True)
        return True
    except Exception as e:
        print("\n[FAILED] Test 5 failed with error:", flush=True)
        print(e, flush=True)
        return False


def main():
    print("=" * 60)
    print("MetricMind AI Module & Endpoint Test Suite")
    print("=" * 60)

    t1 = test_sales_text_summary()
    t2 = test_orders_structured_summary()
    t3 = test_live_db_orders_summary()
    t4 = test_fastapi_summary_endpoint()
    t5 = test_fastapi_validation()

    print("\n" + "=" * 60)
    if t1 and t2 and t3 and t4 and t5:
        print("ALL 5 AI TESTS PASSED SUCCESSFULLY! AI WORKFLOW OPERATIONAL.")
    else:
        print("SOME AI TESTS FAILED. PLEASE CHECK LOGS ABOVE.")
    print("=" * 60)


if __name__ == "__main__":
    main()

