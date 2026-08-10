# MetricMind API Documentation

## Overview

This document provides the API reference for the MetricMind backend. It describes each available endpoint, its purpose, request method, query parameters, and example responses.

---

# Base URL

```
http://127.0.0.1:8000
```

Swagger Documentation

```
http://127.0.0.1:8000/docs
```

---

# 1. Home API

## Endpoint

```
GET /
```

### Purpose

Checks whether the MetricMind backend is running.

### Query Parameters

None

### Sample Request

```http
GET /
```

### Sample Response

```json
{
    "success": true,
    "message": "Backend is running.",
    "data": {
        "project": "MetricMind",
        "version": "1.0.0"
    }
}
```

---

# 2. Health Check

## Endpoint

```
GET /health
```

### Purpose

Checks whether the backend API is healthy.

### Query Parameters

None

### Sample Request

```http
GET /health
```

### Sample Response

```json
{
    "success": true,
    "message": "API is healthy.",
    "data": {
        "status": "running"
    }
}
```

---

# 3. Project Information

## Endpoint

```
GET /info
```

### Purpose

Returns basic project information.

### Query Parameters

None

### Sample Request

```http
GET /info
```

### Sample Response

```json
{
    "success": true,
    "message": "Project information retrieved successfully.",
    "data": {
        "project_name": "MetricMind",
        "version": "1.0.0",
        "database": "SQLite",
        "framework": "FastAPI"
    }
}
```

---

# 4. Database Connection Test

## Endpoint

```
GET /db-test
```

### Purpose

Checks whether the backend can successfully connect to the SQLite database.

### Query Parameters

None

### Sample Request

```http
GET /db-test
```

### Sample Response

```json
{
    "success": true,
    "message": "Database connected successfully."
}
```

---

# 5. Get Orders

## Endpoint

```
GET /orders
```

### Purpose

Returns customer orders with optional filtering, sorting, and pagination.

---

## Query Parameters

| Parameter | Type | Description |
|------------|------|-------------|
| region | String | Filter by region |
| category | String | Filter by category |
| segment | String | Filter by customer segment |
| page | Integer | Page number (minimum 1) |
| limit | Integer | Records per page (1–100) |
| sort_by | String | Sales, Profit, Region, Category |
| order | String | asc or desc |

---

## Sample Requests

### Basic

```http
GET /orders
```

### Pagination

```http
GET /orders?page=2&limit=20
```

### Filtering

```http
GET /orders?region=East
```

```http
GET /orders?category=Furniture
```

```http
GET /orders?segment=Consumer
```

### Sorting

```http
GET /orders?sort_by=Sales&order=desc
```

### Combined

```http
GET /orders?region=East&page=1&limit=10&sort_by=Profit&order=desc
```

---

## Sample Response

```json
{
    "success": true,
    "message": "Orders fetched successfully.",
    "page": 1,
    "limit": 20,
    "total_records": 9994,
    "data": [
        {
            "Order ID": "CA-2014-100006",
            "Region": "East",
            "Category": "Furniture",
            "Sales": 377.97,
            "Profit": 45.25
        }
    ]
}
```

---

# 6. Order Count

## Endpoint

```
GET /orders/count
```

### Purpose

Returns the total number of orders.

### Query Parameters

None

### Sample Request

```http
GET /orders/count
```

### Sample Response

```json
{
    "success": true,
    "message": "Total orders fetched successfully.",
    "total_orders": 9994
}
```

---

# 7. Total Sales

## Endpoint

```
GET /orders/total-sales
```

### Purpose

Returns the total sales value.

### Query Parameters

None

### Sample Request

```http
GET /orders/total-sales
```

### Sample Response

```json
{
    "success": true,
    "message": "Total sales calculated successfully.",
    "total_sales": 2297200.86
}
```

---

# 8. Total Profit

## Endpoint

```
GET /orders/total-profit
```

### Purpose

Returns the total profit value.

### Query Parameters

None

### Sample Request

```http
GET /orders/total-profit
```

### Sample Response

```json
{
    "success": true,
    "message": "Total profit calculated successfully.",
    "total_profit": 286397.02
}
```

---

# 9. Database Indexes

## Endpoint

```
GET /db/indexes
```

### Purpose

Returns the database indexes created for query optimization.

### Query Parameters

None

### Sample Request

```http
GET /db/indexes
```

### Sample Response

```json
{
    "success": true,
    "message": "Database indexes retrieved successfully.",
    "indexes": [
        "idx_order_id",
        "idx_customer_id",
        "idx_region",
        "idx_category"
    ]
}
```

---

# Orders API Features

## Filtering

Supported filters:

- Region
- Category
- Segment

Example

```http
GET /orders?region=East
```

---

## Pagination

Supported parameters:

- page
- limit

Example

```http
GET /orders?page=2&limit=20
```

---

## Sorting

Supported fields:

- Sales
- Profit
- Region
- Category

Supported order values:

- asc
- desc

Example

```http
GET /orders?sort_by=Sales&order=desc
```
---
---

# 10. AI Analytics & Business Insights APIs

## 10.1 Primary AI Summary Endpoint

### Endpoint

```http
POST /ai/summary
Content-Type: application/json
```

### Purpose

Generates a structured AI business intelligence summary from sales, financial, or order datasets using **LangChain** and **Google Gemini LLM**. Accepts formatted text, structured JSON records, or aggregated metric dictionaries.

### Request Body (`AISummaryRequest`)

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `data` | String \| Object \| Array | Yes (or `dataset`) | Sales or order data to summarize |
| `dataset` | String \| Object \| Array | Yes (or `data`) | Alias for `data` |
| `data_type` | String | No (Default: `"sales"`) | Type of dataset (`"sales"`, `"orders"`, `"financial"`) |
| `question` | String | No | Custom prompt objective or question |

### Sample Request A: Sales Dataset (Raw Formatted Text)

```json
{
    "data": "Sales: 120,340,280,560,410\nProfit: 20,55,45,120,70",
    "data_type": "sales"
}
```

### Sample Request B: Orders Dataset (JSON Object)

```json
{
    "data": {
        "total_orders": 1250,
        "total_sales": 345000.75,
        "total_profit": 48200.50,
        "top_category": "Technology",
        "underperforming_category": "Furniture"
    },
    "data_type": "orders",
    "question": "Provide key executive summary and actionable recommendations."
}
```

### Sample Successful Response (`AISummaryResponse`)

```json
{
    "success": true,
    "summary": "# Business Intelligence Report: MetricMind Orders Analysis\n\n## 1. Executive Summary\nDuring the evaluated period, MetricMind generated **$345,000.75** in total sales...",
    "data_type": "orders",
    "message": "AI summary generated successfully."
}
```

---

## 10.2 Frontend Integration Contract

Frontend applications should interact with `POST /ai/summary` using standard `fetch()` or `axios`. The frontend must use its dynamically configured API base URL (e.g. `process.env.NEXT_PUBLIC_API_BASE_URL` or `API_BASE_URL`), without hardcoding production hostnames.

### Example JavaScript / TypeScript Fetch Implementation

```javascript
// Dynamic API Base URL configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";

async function generateAISummary(dataset, dataType = "sales") {
  try {
    const response = await fetch(`${API_BASE_URL}/ai/summary`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        data: dataset,
        data_type: dataType
      })
    });

    const result = await response.json();

    if (result.success) {
      console.log("AI Summary:", result.summary);
      return result.summary;
    } else {
      console.error("AI Error Code:", result.error.code);
      console.error("AI Error Message:", result.error.message);
    }
  } catch (err) {
    console.error("Network or connectivity error:", err);
  }
}
```

---

## 10.3 AI Summary Endpoint (Alias)

### Endpoint

```http
POST /ai/summarize
Content-Type: application/json
```

### Purpose

Alias endpoint for `/ai/summary` to ensure backward compatibility for legacy clients. Uses the exact same request/response schema as `POST /ai/summary`.

---

## 10.4 Order Insights Endpoint

### Endpoint

```http
POST /ai/summarize-orders
Content-Type: application/json
```

### Purpose

Generates targeted AI business insights specifically formatted for order dataset records or aggregated order metrics.

### Sample Request (`AIOrdersRequest`)

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

### Sample Response (`AIOrdersResponse`)

```json
{
    "success": true,
    "message": "Order insights generated successfully.",
    "summary": "### 1. Order Overview\n* **Total Volume:** 500 orders...",
    "data": {
        "data_type": "orders",
        "summary": "### 1. Order Overview\n* **Total Volume:** 500 orders..."
    }
}
```

---

## 10.5 Live Database Orders AI Summary

### Endpoint

```http
GET /ai/summarize-live-orders
```

### Purpose

Queries live SQLite order records with optional filtering, calculates aggregated metrics, and returns an AI business summary.

### Query Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| region | String | Optional region filter (`East`, `West`, `South`, `Central`) |
| category | String | Optional category filter (`Technology`, `Furniture`, `Office Supplies`) |
| segment | String | Optional segment filter (`Consumer`, `Corporate`, `Home Office`) |

### Sample Response (`AILiveOrdersResponse`)

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
        "total_sales": 678834.0,
        "total_profit": 91522.78,
        "average_order_value": 238.35,
        "top_category_by_sales": "Technology",
        "category_performance": {
            "Office Supplies": {"sales": 205549.0, "profit": 41014.58, "count": 1712},
            "Technology": {"sales": 264994.0, "profit": 47462.04, "count": 535},
            "Furniture": {"sales": 208291.0, "profit": 3046.17, "count": 601}
        }
    },
    "summary": "### 1. Order Overview\n* **Total Volume:** 2,848 orders..."
}
```

---

## 10.6 AI Module Error Responses

All errors returned by the AI module adhere to a consistent JSON structure:

```json
{
    "success": false,
    "error": {
        "code": "<ERROR_CODE>",
        "message": "<Human-readable message>"
    }
}
```

#### 1. Input Validation Error (HTTP 400)

Returned for empty input, whitespace-only data, missing required fields, or invalid data types.

```json
{
    "success": false,
    "error": {
        "code": "INVALID_INPUT",
        "message": "Dataset input cannot be empty or whitespace-only."
    }
}
```

#### 2. AI Provider Error (HTTP 502)

Returned when Google Gemini LLM fails, times out, or exceeds rate limits.

```json
{
    "success": false,
    "error": {
        "code": "PROVIDER_ERROR",
        "message": "The AI provider is temporarily unavailable. Please try again."
    }
}
```

#### 3. AI Configuration Error (HTTP 503)

Returned when `GOOGLE_API_KEY` is not configured in the `.env` file.

```json
{
    "success": false,
    "error": {
        "code": "CONFIG_ERROR",
        "message": "GOOGLE_API_KEY is not configured. Add it to the project .env file."
    }
}
```
---

# HTTP Response Codes

| Status Code | Description |
|--------------|-------------|
| 200 | Request Successful |
| 422 | Validation Error |
| 500 | Unexpected server error |
| 502 | Gemini provider unavailable or request timed out |
| 503 | AI credentials are not configured |

---

# Notes

- All API responses are returned in JSON format.
- The backend is developed using FastAPI.
- Database operations use SQLAlchemy with SQLite.
- Swagger documentation is available at:

```
http://127.0.0.1:8000/docs
```

- Example responses shown in this document are for documentation purposes. Actual values depend on the data stored in the database.
