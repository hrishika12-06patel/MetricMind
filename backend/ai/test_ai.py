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

client = TestClient(app)

sample_sales_input = "Sales: 120,340,280,560,410\nProfit: 20,55,45,120,70"

sample_orders_input = {
    "total_orders": 1250,
    "total_sales": 345000.75,
    "total_profit": 48200.50,
    "top_category": "Technology"
}


def _verify_common_response_properties(res, expected_statuses=(200, 400, 502, 503)):
    """Helper to verify status code, valid JSON, schema structure, and safety."""
    assert res.status_code in expected_statuses, f"Unexpected status code {res.status_code}: {res.text}"

    # Verify JSON deserialization
    try:
        body = res.json()
    except Exception as e:
        raise AssertionError(f"Response body is not valid JSON: {res.text}") from e

    # Verify no stack trace exposure
    raw_text = res.text.lower()
    assert "traceback (most recent call last)" not in raw_text, "SECURITY ALERT: Exception traceback exposed in response!"
    assert "file \"" not in raw_text or ".py\"" not in raw_text or "line " not in raw_text, "SECURITY ALERT: Internal Python stack trace exposed!"

    # Verify no API key exposure
    real_key = os.getenv("GOOGLE_API_KEY", "")
    if real_key and len(real_key) > 5:
        assert real_key not in res.text, "SECURITY ALERT: GOOGLE_API_KEY exposed in response!"

    if res.status_code == 200:
        assert body.get("success") is True, f"Expected success: true in 200 OK response: {body}"
        assert "summary" in body, f"Missing 'summary' field in 200 OK response: {body}"
        assert "data_type" in body, f"Missing 'data_type' field in 200 OK response: {body}"
    else:
        assert body.get("success") is False, f"Expected success: false in error response: {body}"
        assert "error" in body, f"Missing 'error' object in error response: {body}"
        assert "code" in body.get("error", {}), f"Missing 'code' in error detail: {body}"
        assert "message" in body.get("error", {}), f"Missing 'message' in error detail: {body}"

    return body


def test_valid_sales_input():
    """Case A: Test POST /ai/summary with valid sales text input."""
    res = client.post("/ai/summary", json={"data": sample_sales_input, "data_type": "sales"})
    body = _verify_common_response_properties(res, expected_statuses=(200, 502, 503))
    if res.status_code == 200:
        assert body.get("data_type") == "sales"
        assert len(body.get("summary", "")) > 10
    return True


def test_valid_order_input():
    """Case B: Test POST /ai/summary with valid structured order dictionary input."""
    res = client.post("/ai/summary", json={"data": sample_orders_input, "data_type": "orders"})
    body = _verify_common_response_properties(res, expected_statuses=(200, 502, 503))
    if res.status_code == 200:
        assert body.get("data_type") == "orders"
        assert len(body.get("summary", "")) > 10
    return True


def test_empty_input():
    """Case C: Test POST /ai/summary with empty payload or empty dataset."""
    for empty_payload in [{"dataset": {}}, {"data": ""}, {}]:
        res = client.post("/ai/summary", json=empty_payload)
        body = _verify_common_response_properties(res, expected_statuses=(400,))
        assert body.get("error", {}).get("code") == "INVALID_INPUT"
    return True


def test_whitespace_input():
    """Case D: Test POST /ai/summary with whitespace-only input string."""
    res = client.post("/ai/summary", json={"dataset": "   \n\t  ", "data_type": "sales"})
    body = _verify_common_response_properties(res, expected_statuses=(400,))
    assert body.get("error", {}).get("code") == "INVALID_INPUT"
    return True


def test_missing_required_field():
    """Case E: Test POST /ai/summary with missing dataset/data field."""
    res = client.post("/ai/summary", json={"data_type": "sales"})
    body = _verify_common_response_properties(res, expected_statuses=(400,))
    assert body.get("error", {}).get("code") == "INVALID_INPUT"
    return True


def test_invalid_data_types_and_malformed_request():
    """Case F: Test POST /ai/summary with invalid data types and malformed body."""
    # Test numeric dataset format
    res_num = client.post("/ai/summary", json={"data": 12345, "data_type": "sales"})
    body_num = _verify_common_response_properties(res_num, expected_statuses=(400,))
    assert body_num.get("error", {}).get("code") == "INVALID_INPUT"

    # Test boolean dataset format
    res_bool = client.post("/ai/summary", json={"data": True, "data_type": "sales"})
    body_bool = _verify_common_response_properties(res_bool, expected_statuses=(400,))
    assert body_bool.get("error", {}).get("code") == "INVALID_INPUT"

    # Test malformed raw JSON request content
    res_malformed = client.post(
        "/ai/summary",
        content="{\"data\": \"broken json payload",
        headers={"Content-Type": "application/json"}
    )
    body_malformed = _verify_common_response_properties(res_malformed, expected_statuses=(400,))
    assert body_malformed.get("error", {}).get("code") == "INVALID_INPUT"
    return True


def test_large_realistic_dataset():
    """Case G: Test POST /ai/summary with large realistic dataset (~150 records)."""
    large_records = [
        {
            "order_id": f"ORD-{i:04d}",
            "region": "East" if i % 2 == 0 else "West",
            "category": "Technology" if i % 3 == 0 else "Furniture",
            "sales": round(100.0 + i * 2.5, 2),
            "profit": round(15.0 + i * 0.4, 2),
            "quantity": (i % 5) + 1
        }
        for i in range(1, 150)
    ]
    res = client.post("/ai/summary", json={"data": large_records, "data_type": "sales"})
    _verify_common_response_properties(res, expected_statuses=(200, 502, 503))
    return True


def test_existing_non_ai_endpoints():
    """Verify that existing Orders, Dashboard, Sales, and Reports endpoints operate unaffected."""
    endpoints = [
        "/orders?limit=5",
        "/orders/count",
        "/dashboard/stats",
        "/sales/by-region",
        "/sales/by-category",
        "/reports/profit-by-region",
        "/reports/top-products"
    ]
    for ep in endpoints:
        res = client.get(ep)
        assert res.status_code == 200, f"Expected 200 OK for {ep}, got {res.status_code}: {res.text}"
        body = res.json()
        assert body.get("success") is True, f"Expected success: true for {ep}"
    return True


def test_security_api_key_non_exposure():
    """Verify that GOOGLE_API_KEY is never exposed in response body or OpenAPI schema."""
    real_key = os.getenv("GOOGLE_API_KEY", "")
    res = client.post("/ai/summary", json={"data": sample_sales_input})
    if real_key and len(real_key) > 5:
        assert real_key not in res.text, "SECURITY ALERT: API key exposed in API response!"

    openapi_res = client.get("/openapi.json")
    assert openapi_res.status_code == 200
    if real_key and len(real_key) > 5:
        assert real_key not in openapi_res.text, "SECURITY ALERT: API key exposed in OpenAPI schema!"

    # Also verify swagger docs endpoint accessibility
    docs_res = client.get("/docs")
    assert docs_res.status_code == 200
    return True


def main():
    print("=" * 70, flush=True)
    print("MetricMind AI Module & Regression Test Suite", flush=True)
    print("=" * 70, flush=True)

    tests = [
        ("A. Valid Sales Input", test_valid_sales_input),
        ("B. Valid Order Input", test_valid_order_input),
        ("C. Empty Input", test_empty_input),
        ("D. Whitespace Input", test_whitespace_input),
        ("E. Missing Required Fields", test_missing_required_field),
        ("F. Invalid Data Types & Malformed Payload", test_invalid_data_types_and_malformed_request),
        ("G. Large Realistic Dataset", test_large_realistic_dataset),
        ("Non-AI Endpoints Safety (Orders/Dashboard/Sales/Reports)", test_existing_non_ai_endpoints),
        ("Security Audit (Key exposure & OpenAPI validation)", test_security_api_key_non_exposure),
    ]

    all_passed = True
    for name, test_fn in tests:
        print(f"Running: {name}...", flush=True)
        try:
            success = test_fn()
            status_str = "PASS" if success else "FAIL"
            print(f"[{status_str}] {name}", flush=True)
        except Exception as e:
            all_passed = False
            print(f"[FAIL] {name}: {e}", flush=True)

    print("=" * 70, flush=True)
    if all_passed:
        print("ALL 9 TEST SUITES PASSED SUCCESSFULLY!", flush=True)
    else:
        print("SOME TESTS FAILED - CHECK ERROR LOGS ABOVE", flush=True)
    print("=" * 70, flush=True)
    if not all_passed:
        sys.exit(1)


if __name__ == "__main__":
    main()