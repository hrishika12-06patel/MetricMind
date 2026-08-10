# MetricMind

**MetricMind** is an AI-powered Semantic Business Intelligence Engine developed as part of the **Data Analytics Internship at Axlero Solutions**.

The project enables users to analyze business data through governed business metrics instead of writing raw SQL queries. It combines a FastAPI backend, semantic layer, SQLite database, and a Next.js frontend to deliver consistent and reliable business insights.

---

# Tech Stack

- FastAPI
- Next.js
- LangChain
- SQLite
- Cube.dev
- Apache ECharts
- SQLAlchemy
- Postman

---

# Dataset

**Dataset:** Global Superstore Dataset

**Source:** Kaggle

## Key Columns

- Order Date
- Sales
- Profit
- Quantity
- Discount
- Shipping Cost
- Region
- Country
- Market
- Category
- Sub-Category
- Segment

The dataset is stored inside:

```
data/raw/Global_Superstore.csv
```

---

# ETL Pipeline

The project contains an ETL pipeline that performs the following operations:

- Reads the Global Superstore dataset
- Removes duplicate records
- Handles missing values
- Converts date columns
- Creates Year, Month, and Quarter features
- Saves the cleaned dataset

Processed dataset:

```
data/processed/cleaned_superstore.csv
```

---

# Database

MetricMind uses an SQLite database.

The database contains the cleaned Global Superstore dataset and supports all backend analytics APIs.

Database files:

```
database/
│
├── metricmind.db
├── schema.sql
└── create_database.py
```

---

# Semantic Layer

The semantic layer defines business entities, dimensions, KPIs, and governed metrics using YAML files.

### Business Entities

- Customer
- Product
- Orders
- Sales
- Profit
- Quantity
- Revenue
- Category
- Region
- Segment
- Ship Mode
- Sub Category
- Discount

### KPI Definitions

- Sales KPI
- Profit KPI
- Quantity KPI
- Orders KPI
- Customer KPI
- Discount KPI

Semantic definitions are available inside:

```
semantic/
```

---

# Backend

The FastAPI backend provides REST APIs for business analytics.

Backend components include:

- FastAPI
- SQLAlchemy
- SQLite
- ETL Pipeline
- Database Utilities
- API Schemas
- Database Index Verification

---

# Frontend

The frontend is developed using **Next.js**.

Current implementation includes:

- Homepage
- Dashboard
- Navigation Bar
- Dashboard Components
- Charts
- Global Styling

---

# Project Structure

```
MetricMind
│
├── backend
│   ├── app.py
│   ├── database.py
│   ├── database_utils.py
│   ├── schemas.py
│   ├── verify_indexes.py
│   ├── etl.py
│   ├── requirements.txt
│   └── API_DOCUMENTATION.md
│
├── data
│   ├── raw
│   │   └── Global_Superstore.csv
│   │
│   └── processed
│       └── cleaned_superstore.csv
│
├── database
│   ├── metricmind.db
│   ├── schema.sql
│   ├── create_database.py
│   └── backups
│
├── semantic
│   ├── customer.yaml
│   ├── product.yaml
│   ├── sales.yaml
│   ├── orders.yaml
│   ├── revenue.yaml
│   ├── region.yaml
│   ├── category.yaml
│   ├── segment.yaml
│   ├── ship_mode.yaml
│   ├── sub_category.yaml
│   ├── quantity.yaml
│   ├── discount.yaml
│   ├── profit.yaml
│   └── *_kpi.yaml
│
├── frontend
│
├── docs
│
├── API_TESTING.md
├── MetricMind.postman_collection.json
└── README.md
```

---

# Features

- FastAPI REST APIs
- SQLite Database
- Semantic Business Layer
- YAML-based KPI Definitions
- ETL Pipeline
- Swagger Documentation
- Postman API Testing
- Next.js Dashboard
- Business Analytics APIs

---
## AI Module

MetricMind includes a production-ready AI Business Intelligence module built using **LangChain LCEL (LangChain Expression Language)** and **Google Gemini LLM** (`ChatGoogleGenerativeAI`).

### Overview & Capabilities
- **Automated Dataset Summarization**: Analyzes sales, order metrics, or financial data streams and generates structured markdown executive summaries.
- **Modular Service Layer**: Decoupled service (`AIInsightService`) reusable by any current or future backend route.
- **LangChain LCEL Chains**: Modular prompt templates (`DATASET_SUMMARY_PROMPT`, `ORDER_ANALYSIS_PROMPT`) connected via LCEL pipelines.
- **Primary Endpoint**: `POST /ai/summary` accepts both raw text data and structured metric objects.

### AI Module Structure

```text
backend/
└── ai/
    ├── config.py             # Environment configuration & dotenv loading
    ├── llm_factory.py        # LangChain ChatGoogleGenerativeAI factory
    ├── prompt_templates.py   # Business Intelligence & Order prompt templates
    ├── chains.py             # LangChain LCEL chains
    ├── insight_service.py    # Service layer (AIInsightService)
    ├── routes.py             # FastAPI route handlers (/ai/summary)
    └── test_ai.py            # Automated test suite (9 test cases)
```

### Required Environment Variables

Configure `.env` in project root (`MetricMind/.env`):

```env
GOOGLE_API_KEY=your_google_gemini_api_key_here
MODEL_NAME=gemini-2.5-flash
```

### Quick Start & Usage Guide

1. **Install Backend Dependencies**:
   ```bash
   pip install -r backend/requirements.txt
   ```

2. **Start Backend Server**:
   ```bash
   python -m uvicorn backend.app:app --reload --host 127.0.0.1 --port 8000
   ```

3. **Access Interactive Swagger Documentation**:
   Navigate to: `http://127.0.0.1:8000/docs`

4. **Run AI Test Suite**:
   ```bash
   python -m ai.test_ai
   ```

5. **Call Primary AI Summary Endpoint**:
   ```http
   POST /ai/summary
   Content-Type: application/json

   {
     "data": "Sales: 120,340,280,560,410\nProfit: 20,55,45,120,70",
     "data_type": "sales"
   }
   ```

   **Sample Response**:
   ```json
   {
     "success": true,
     "summary": "AI-generated business insights...",
     "data_type": "sales"
   }
   ```

> **Security Note:** Never commit API keys or `.env` files to source control. Use `.env.example` as a safe placeholder template.

---

# Running the Backend

## Navigate to backend

```bash
cd backend
```

## Activate Virtual Environment

### Windows

```bash
..\ .venv\Scripts\activate
```

### Linux / macOS

```bash
source ../.venv/bin/activate
```

## Install Dependencies

```bash
pip install -r requirements.txt
```

## Run the Backend

```bash
python -m uvicorn app:app --reload
```

Backend URL

```
http://127.0.0.1:8000
```

Swagger Documentation

```
http://127.0.0.1:8000/docs
```

---

# Running the Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend URL

```
http://localhost:3000
```

---

# API Endpoints

## General

- GET /
- GET /health
- GET /info

## Database

- GET /db-test
- GET /db/indexes

## Orders

- GET /orders
- GET /orders/count

## Business Metrics

- GET /orders/total-sales
- GET /orders/total-profit

---

# Orders API

The Orders API supports:

## Filtering

- region
- category
- segment

Example

```
GET /orders?region=East
```

---

## Pagination

Parameters:

- page
- limit

Example

```
GET /orders?page=1&limit=20
```

---

## Sorting

Supported Fields

- Sales
- Profit
- Region
- Category

Parameters

- sort_by
- order

Examples

```
GET /orders?sort_by=Sales
```

```
GET /orders?sort_by=Profit&order=desc
```

```
GET /orders?region=East&page=1&limit=10&sort_by=Sales&order=desc
```

---

# API Documentation

Detailed API documentation is available in:

```
backend/API_DOCUMENTATION.md
```

It contains:

- Endpoint descriptions
- Query parameters
- Sample requests
- Sample responses
- Usage examples

---

# API Testing

All backend APIs have been tested using **Postman**.

Testing includes:

- Endpoint verification
- Pagination
- Filtering
- Sorting
- Invalid parameter validation

Testing files:

- API_TESTING.md
- MetricMind.postman_collection.json

---

# Team

- Hrishika Patel
- Patati Yasaswi
- Apurv Dwivedi
- Chinthala Akhilandeshwari

---

# Project Status

🚧 **Under Development**

---

# Contributing

1. Create a feature branch.
2. Commit your changes.
3. Push the branch.
4. Create a Pull Request.
5. Wait for code review.

---

# License

Developed as part of the **Axlero Solutions Data Analytics Internship**.
