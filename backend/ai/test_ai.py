"""
Independent test suite for MetricMind AI module and POST /ai/summary endpoint.

Run from workspace root:
    python -m ai.test_ai
or:
    python backend/ai/test_ai.py
"""

import os
import sys
from pathlib import Path

# Add backend directory to sys.path if not present
BACKEND_DIR = Path(__file__).resolve().parent.parent
if str(BACKEND_DIR) not in sys.path:
    sys.path.insert(0, str(BACKEND_DIR))

from fastapi.testclient import TestClient
from app import app

try:
    from ai.insight_service import AIInsightService
except ImportError:
    from insight_service import AIInsightService

client = TestClient(app)

sample_sales_input = "Sales: 120,340,280,560,410\nProfit: 20,55,45,120,70"

sample_orders_input = {
    "total_orders": 1250,
    "total_sales": 345000.75,
    "total_profit": 48200.50,
    "top_category": "Technology"
}


def test_valid_sales_input():
    """Test POST /ai/summary with valid sales text input."""
    res = client.post("/ai/summary", json={"data": sample_sales_input, "data_type": "sales"})
    assert res.status_code in [200, 502], f"Expected 200 or 502, got {res.status_code}"
    body = res.json()
    if res.status_code == 200:
        assert body.get("success") is True
        assert "summary" in body
        assert body.get("data_type") == "sales"
    else:
        assert body.get("success") is False
        assert body.get("error", {}).get("code") in ["PROVIDER_ERROR", "CONFIG_ERROR"]
    return True


def test_valid_order_input():
    """Test POST /ai/summary with valid structured order dictionary input."""
    res = client.post("/ai/summary", json={"dataset": sample_orders_input, "data_type": "orders"})
    assert res.status_code in [200, 502], f"Expected 200 or 502, got {res.status_code}"
    body = res.json()
    if res.status_code == 200:
        assert body.get("success") is True
        assert "summary" in body
        assert body.get("data_type") == "orders"
    else:
        assert body.get("success") is False
        assert body.get("error", {}).get("code") in ["PROVIDER_ERROR", "CONFIG_ERROR"]
    return True


def test_empty_input():
    """Test POST /ai/summary with empty payload."""
    res = client.post("/ai/summary", json={"dataset": {}})
    assert res.status_code == 400, f"Expected 400, got {res.status_code}"
    body = res.json()
    assert body.get("success") is False
    assert body.get("error", {}).get("code") == "INVALID_INPUT"
    return True


def test_whitespace_input():
    """Test POST /ai/summary with whitespace-only input string."""
    res = client.post("/ai/summary", json={"dataset": "   ", "data_type": "sales"})
    assert res.status_code == 400, f"Expected 400, got {res.status_code}"
    body = res.json()
    assert body.get("success") is False
    assert body.get("error", {}).get("code") == "INVALID_INPUT"
    return True


def test_missing_required_field():
    """Test POST /ai/summary with missing dataset/data field."""
    res = client.post("/ai/summary", json={"data_type": "sales"})
    assert res.status_code == 400, f"Expected 400, got {res.status_code}"
    body = res.json()
    assert body.get("success") is False
    assert body.get("error", {}).get("code") == "INVALID_INPUT"
    return True


def test_existing_non_ai_endpoints():
    """Verify that existing Orders/Dashboard/Sales endpoints operate unchanged."""
    res_orders = client.get("/orders?limit=5")
    assert res_orders.status_code == 200, f"Expected 200 for /orders, got {res_orders.status_code}"
    res_stats = client.get("/dashboard/stats")
    assert res_stats.status_code == 200, f"Expected 200 for /dashboard/stats, got {res_stats.status_code}"
    return True


def test_security_api_key_non_exposure():
    """Verify that GOOGLE_API_KEY is never exposed in response body or OpenAPI schema."""
    real_key = os.getenv("GOOGLE_API_KEY", "")
    res = client.post("/ai/summary", json={"data": sample_sales_input})
    if real_key and len(real_key) > 5:
        assert real_key not in res.text, "SECURITY ALERT: API key exposed in API response!"

    openapi_res = client.get("/openapi.json")
    if real_key and len(real_key) > 5:
        assert real_key not in openapi_res.text, "SECURITY ALERT: API key exposed in OpenAPI schema!"
    return True


def main():
    print("=" * 60)
    print("MetricMind AI Module Test Suite")
    print("=" * 60)

    tests = [
        ("Valid Sales Input (a)", test_valid_sales_input),
        ("Valid Order Input (b)", test_valid_order_input),
        ("Empty Input (c)", test_empty_input),
        ("Whitespace Input (d)", test_whitespace_input),
        ("Missing Required Field (e)", test_missing_required_field),
        ("Existing Non-AI Endpoints Safety", test_existing_non_ai_endpoints),
        ("Security Audit - Key Exposure", test_security_api_key_non_exposure),
    ]

    all_passed = True
    for name, test_fn in tests:
        try:
            success = test_fn()
            status_str = "PASS" if success else "FAIL"
            print(f"[{status_str}] {name}")
        except Exception as e:
            all_passed = False
            print(f"[FAIL] {name}: {e}")

    print("=" * 60)
    if all_passed:
        print("ALL AI & REGRESSION TESTS PASSED SUCCESSFULLY!")
    else:
        print("SOME TESTS FAILED - CHECK LOGS ABOVE")
    print("=" * 60)


if __name__ == "__main__":
    main()