# MetricMind API Documentation

## Overview

This document provides the API reference for the MetricMind backend. It describes each available endpoint, its purpose, request method, parameters, and example responses to help developers understand and use the APIs.

---

# Base URL

```
http://localhost:8000
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

### Sample JSON Response

```json
{
    "message": "MetricMind API is running"
}
```

---

# 2. Database Connection Test

## Endpoint

```
GET /db-test
```

### Purpose

Checks whether the backend can successfully connect to the database.

### Query Parameters

None

### Sample Request

```http
GET /db-test
```

### Example JSON Response

```json
{
    "status": "success",
    "message": "Database connection successful"
}
```

---

# 3. Get Orders

## Endpoint

```
GET /orders
```

### Purpose

Returns customer order records.

### Query Parameters

| Parameter | Type | Description |
|------------|------|-------------|
| limit | Integer | Maximum number of records |
| offset | Integer | Starting record |

### Sample Request

```http
GET /orders?limit=10&offset=0
```

### Example JSON Response

```json
[
    {
        "order_id": "ORD-1001",
        "customer_name": "John Doe",
        "category": "Furniture",
        "region": "West",
        "sales": 250.75,
        "profit": 45.25
    }
]
```

---

# 4. Order Count

## Endpoint

```
GET /orders/count
```

### Purpose

Returns the total number of customer orders.

### Query Parameters

None

### Sample Request

```http
GET /orders/count
```

### Example JSON Response

```json
{
    "total_orders": 9994
}
```

---

# 5. Total Sales

## Endpoint

```
GET /orders/total-sales
```

### Purpose

Returns the total sales amount.

### Query Parameters

None

### Sample Request

```http
GET /orders/total-sales
```

### Example JSON Response

```json
{
    "net_sales": 2297200.86,
    "gross_sales": 2450000.00
}
```

---

# 6. Total Profit

## Endpoint

```
GET /orders/total-profit
```

### Purpose

Returns the total profit.

### Query Parameters

None

### Sample Request

```http
GET /orders/total-profit
```

### Example JSON Response

```json
{
    "total_profit": 286397.02,
    "profit_margin": 0.125
}
```

---

# 7. Database Indexes

## Endpoint

```
GET /db/indexes
```

### Purpose

Returns the database indexes available for query optimization.

### Query Parameters

None

### Sample Request

```http
GET /db/indexes
```

### Example JSON Response

```json
{
    "indexes": [
        "order_id_idx",
        "customer_id_idx",
        "region_idx"
    ]
}
```

---

# Pagination

The `/orders` endpoint supports pagination.

| Parameter | Description |
|------------|-------------|
| limit | Number of records returned |
| offset | Starting position |

Example:

```http
GET /orders?limit=20&offset=40
```

---

# Filtering

The API can support filtering using query parameters.

Possible filters:

- Region
- Category
- Segment
- Order Date

Example:

```http
GET /orders?region=West
```

---

# Sorting

Results may be sorted using query parameters.

Example:

```http
GET /orders?sort=sales
```

Possible sort fields:

- Sales
- Profit
- Order Date

---

# HTTP Response Codes

| Status Code | Description |
|--------------|-------------|
| 200 | Request Successful |
| 400 | Bad Request |
| 404 | Resource Not Found |
| 500 | Internal Server Error |

---

# Notes

- All API responses are returned in JSON format.
- Response validation is implemented using Pydantic models (`schemas.py`).
- Example JSON responses shown in this document are provided for documentation purposes. Actual responses depend on the backend implementation.