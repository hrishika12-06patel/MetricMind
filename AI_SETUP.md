# MetricMind AI Module Setup & Integration Guide

## Overview

The **MetricMind AI Module** leverages **LangChain Expression Language (LCEL)** and **Google Gemini LLM** (`ChatGoogleGenerativeAI`) to analyze sales data, database order metrics, and business data streams, returning structured business insights, executive summaries, trends, risks, and actionable recommendations.

---

## Architecture & Project Structure

```
backend/
└── ai/
    ├── __init__.py           # Package initializer
    ├── config.py             # Environment configuration & dotenv loading
    ├── llm_factory.py        # LangChain ChatGoogleGenerativeAI factory
    ├── prompt_templates.py   # Business Intelligence & Order prompt templates
    ├── chains.py             # LangChain LCEL (LangChain Expression Language) chains
    ├── insight_service.py    # Service encapsulation (AIInsightService & InsightService)
    ├── routes.py             # FastAPI API endpoints (/ai/summarize, /ai/summarize-orders, /ai/summarize-live-orders)
    └── test_ai.py            # Automated AI module verification script (3 tests)
```

---

## Required Dependencies

The AI module requires Python 3.10+ and the following packages (specified in `requirements.txt`):

```bash
pip install langchain
pip install langchain-core
pip install langchain-google-genai
pip install google-generativeai
pip install python-dotenv
pip install fastapi
pip install uvicorn
pip install pydantic
pip install sqlalchemy
```

---

## Environment Variable Configuration

Create or update the `.env` file in the project root (`MetricMind/.env`):

```env
GOOGLE_API_KEY=your_google_gemini_api_key_here
MODEL_NAME=gemini-flash-latest
```

### How to Get a Google Gemini API Key:
1. Visit [Google AI Studio](https://aistudio.google.com/).
2. Sign in with your Google account.
3. Click **Get API Key** and generate a new key.
4. Copy and paste the key into your `.env` file as `GOOGLE_API_KEY`.

---

## Module Functionality & Usage

### Service Layer (`AIInsightService` / `InsightService`)

The AI logic is encapsulated in `backend/ai/insight_service.py` and can be imported directly anywhere across the backend:

```python
from ai.insight_service import AIInsightService

# 1. Summarize sales data text or dict
summary = AIInsightService.generate_summary(
    data="Sales: $100,000, Profit: $20,000",
    data_type="sales"
)

# 2. Targeted order metrics analysis
order_insights = AIInsightService.summarize_orders(
    orders_data={
        "total_orders": 1250,
        "total_sales": 345000.75,
        "total_profit": 48200.50,
        "top_category": "Technology"
    }
)

# 3. Summarize live SQLite database order metrics directly
db_insights = AIInsightService.summarize_db_orders(
    db_session=db,
    region="East",
    category="Technology"
)
```

---

## Running the Backend API

To start the FastAPI server with AI routes enabled:

```bash
# Using Python virtual environment (.venv)
.\.venv\Scripts\python.exe -m uvicorn backend.app:app --reload --host 127.0.0.1 --port 8000
```

The server runs locally at: `http://127.0.0.1:8000`
Interactive Swagger API documentation: `http://127.0.0.1:8000/docs`

---

## API Endpoints

### 1. `POST /ai/summary` (Primary Endpoint)
Generates a business intelligence summary for general sales or order dataset strings/objects. Also accessible via alias `POST /ai/summarize`.

**Request Body:**
```json
{
  "data": "Sales: 120,340,280,560,410\nProfit: 20,55,45,120,70",
  "data_type": "sales"
}
```

**Response:**
```json
{
  "success": true,
  "summary": "AI-generated business insights...",
  "data_type": "sales"
}
```

---


### 2. `POST /ai/summarize-orders`
Generates business insights specifically tailored for order dataset records or aggregated metrics.

**Request Body:**
```json
{
  "orders": {
    "total_orders": 500,
    "total_sales": 125000.50,
    "total_profit": 18250.00,
    "top_category": "Technology"
  }
}
```

**Response:**
```json
{
  "success": true,
  "message": "Order insights generated successfully.",
  "summary": "### 1. Order Overview\n...",
  "data": {
    "data_type": "orders",
    "summary": "### 1. Order Overview\n..."
  }
}
```

---

### 3. `GET /ai/summarize-live-orders`
Queries live orders directly from the SQLite database, computes aggregated key metrics (total orders, sales, profit, AOV, top category), and passes them to Gemini for business insight generation.

**Query Parameters:**
- `region` (optional): Filter orders by region (`East`, `West`, `South`, `Central`)
- `category` (optional): Filter orders by category (`Technology`, `Furniture`, `Office Supplies`)
- `segment` (optional): Filter orders by segment (`Consumer`, `Corporate`, `Home Office`)

**Example Request:**
`GET /ai/summarize-live-orders?region=East`

**Response:**
```json
{
  "success": true,
  "message": "Live database order insights generated successfully.",
  "metrics": {
    "filters_applied": {
      "region": "East",
      "category": null,
      "segment": null
    },
    "total_orders": 2848,
    "total_sales": 678781.24,
    "total_profit": 91522.78,
    "average_order_value": 238.34,
    "top_category_by_sales": "Technology",
    "category_performance": {
      "Furniture": {"sales": 208291.13, "profit": 3061.27, "count": 601},
      "Office Supplies": {"sales": 204562.91, "profit": 41024.1, "count": 1716},
      "Technology": {"sales": 265927.2, "profit": 47437.41, "count": 531}
    }
  },
  "summary": "### 1. Order Overview\n* **Total Volume:** 2,848 orders\n* **Total Sales:** $678,781.24..."
}
```

---

## Running AI Verification Tests

Run the comprehensive test script to verify that the LangChain pipeline, Gemini API key, and SQLite database summarization helper are operational:

```bash
.\.venv\Scripts\python.exe backend/ai/test_ai.py
```

Expected Output:
```
============================================================
MetricMind AI Integration Test Suite
============================================================

TEST 1: Sales Data Text Summary
[SUCCESS] Test 1 passed!

TEST 2: Structured Orders Summary
[SUCCESS] Test 2 passed!

TEST 3: Live Database Orders AI Summary
[SUCCESS] Test 3 passed!

============================================================
ALL AI TESTS PASSED SUCCESSFULLY! AI WORKFLOW OPERATIONAL.
============================================================
```

---

## Notes & Troubleshooting

- **Virtual Environment**: Use `.\.venv\Scripts\python.exe` when executing scripts or backend servers to ensure all required packages (`langchain-core`, `langchain-google-genai`) are available.
- **API Key Missing**: Ensure `.env` is located at `MetricMind/.env` and contains a valid `GOOGLE_API_KEY`.
- **Retry Logic**: `AIInsightService` includes built-in retry handling for transient Google API network resets.
