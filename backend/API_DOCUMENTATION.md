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

# 8. AI Sales Dataset Summary

## Endpoint

```
POST /ai/summarize
```

### Purpose

Generates an AI-powered business summary and insights for a given sales dataset using **LangChain** integrated with the **Google Gemini** Large Language Model (LLM).

This endpoint analyzes the dataset and provides:

- Executive Summary
- Key Business Insights
- Trends
- Risks
- Business Recommendations

---

### Request Method

```
POST
```

---

### Request Body

| Field | Type | Description |
|--------|------|-------------|
| dataset | String | Sales dataset to be analyzed by the AI model |

---

### Sample Request

```http
POST /ai/summarize
```

```json
{
    "dataset": "Sales: 120, 340, 280, 560, 410\nProfit: 20, 55, 45, 120, 70"
}
```

---

### Example JSON Response

```json
{
    "success": true,
    "summary": "Executive Summary\n\nThe analyzed dataset reflects healthy profitability with an overall profit margin of 18.13%. Larger transactions contribute significantly to revenue and profit. Recommendations include increasing average order value, optimizing lower-value transactions, and expanding data analysis using customer and product information."
}
```

---

### Possible Error Responses

#### Invalid Request

```json
{
    "detail": "dataset field is required."
}
```

#### AI Service Error

```json
{
    "detail": "Unable to generate AI insights."
}
```

#### Internal Server Error

```json
{
    "detail": "Internal Server Error"
}
```

---

### Technologies Used

- FastAPI
- LangChain
- Google Gemini API
- Prompt Templates
- Service Layer Architecture

---

### Notes

- A valid Google Gemini API key must be configured in the `.env` file.
- AI responses are generated dynamically and may vary slightly for the same dataset.
- The endpoint is intended for business intelligence and sales analytics use cases.
- The LangChain workflow uses reusable prompt templates and a modular service architecture for maintainability.
---

# HTTP Response Codes

| Status Code | Description |
|--------------|-------------|
| 200 | Request Successful |
| 422 | Validation Error |
| 500 | Internal Server Error |

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