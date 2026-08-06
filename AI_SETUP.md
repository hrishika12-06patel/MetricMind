# MetricMind AI Module Setup & Integration Guide

## Overview

The **MetricMind AI Module** leverages **LangChain** and **Google Gemini LLM** to analyze sales data and order metrics, returning structured business insights, executive summaries, trends, risks, and actionable recommendations.

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
    ├── routes.py             # FastAPI API endpoints (/ai/summarize, /ai/summarize-orders)
    └── test_ai.py            # AI module verification script
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
```

---

## Environment Variable Configuration

Create or update the `.env` file in the project root (`MetricMind/.env`):

```env
GOOGLE_API_KEY=your_google_gemini_api_key_here
MODEL_NAME=gemini-1.5-flash
```

### How to Get a Google Gemini API Key:
1. Visit [Google AI Studio](https://aistudio.google.com/).
2. Sign in with your Google account.
3. Click **Get API Key** and generate a new key.
4. Copy and paste the key into your `.env` file as `GOOGLE_API_KEY`.

---

## Module Functionality & Usage

### 1. Service Layer (`AIInsightService` / `InsightService`)

The AI logic is encapsulated in `backend/ai/insight_service.py` and can be imported directly anywhere in the backend:

```python
from ai.insight_service import AIInsightService

# Summarize sales data (accepts string, list, or dict)
summary = AIInsightService.generate_summary(
    data="Sales: $100,000, Profit: $20,000",
    data_type="sales"
)

# Target order metrics analysis
order_insights = AIInsightService.summarize_orders(
    orders_data={
        "total_orders": 1250,
        "total_sales": 345000.75,
        "total_profit": 48200.50,
        "top_category": "Technology"
    }
)
```

---

## Running the Backend API

To start the FastAPI server with AI routes enabled:

```bash
cd backend
uvicorn app:app --reload
```

The server runs locally at: `http://127.0.0.1:8000`  
Interactive Swagger API documentation: `http://127.0.0.1:8000/docs`

---

## API Endpoints

### 1. `POST /ai/summarize`
Generates a business intelligence summary for general sales or custom dataset strings/objects.

**Request Body:**
```json
{
  "dataset": "Sales: 120,500, Profit: 24,100\nCategory: Technology",
  "data_type": "sales",
  "question": "Summarize key profit drivers and recommendations."
}
```

**Response:**
```json
{
  "success": true,
  "message": "AI summary generated successfully.",
  "summary": "# Business Intelligence Report...",
  "data": {
    "data_type": "sales",
    "summary": "# Business Intelligence Report..."
  }
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

## Running AI Verification Tests

Run the test script to verify that the LangChain pipeline and Gemini API key are operational:

```bash
cd backend
python ai/test_ai.py
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

============================================================
ALL AI TESTS PASSED SUCCESSFULLY! AI WORKFLOW OPERATIONAL.
============================================================
```

---

## Notes & Troubleshooting

- **Module Import Errors**: Run Python commands from the `backend/` directory or use `python -m ai.test_ai`.
- **API Key Missing**: Ensure `.env` is located at `MetricMind/.env` and contains a valid `GOOGLE_API_KEY`.
- **Rate Limits / Quota Errors**: The default model is `gemini-1.5-flash`. You can change `MODEL_NAME` in `.env` to `gemini-2.5-flash` or `gemini-2.0-flash` if desired.