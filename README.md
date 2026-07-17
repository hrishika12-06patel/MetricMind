# MetricMind
Project - 1 for the Data Analytics Internship at Axlero Solutions.  

An AI-powered Semantic Business Intelligence Engine that answers business questions using governed metrics instead of raw SQL.

## Tech Stack

- FastAPI
- Next.js
- LangChain
- PostgreSQL
- Cube.dev
- ECharts

## Dataset

Dataset: Global Superstore Dataset

Source: Kaggle

### Key Columns

- Order Date
- Sales
- Profit
- Shipping Cost
- Region
- Country
- Market
- Category
- Sub-Category
- Customer Segment

## ETL Pipeline

The project includes an automated ETL script that:

- Reads the raw Global Superstore dataset
- Removes duplicate records
- Handles missing values
- Converts date columns
- Creates Year, Month, and Quarter features
- Saves a cleaned dataset for downstream analysis

## Database Design

The project uses a relational database to store the cleaned Global Superstore dataset.

The Orders table stores sales, customer, product, and regional information.

A database schema and ER diagram have been created as the foundation for backend APIs and semantic metrics.

## Team
-  Hrishika Patel
-  Patati Yasawi
-  Apurv Dwivedi
-  Chinthala Akhilandeshwari

## Project Status

🚧 Under Development

---

## Documentation

### Semantic Metrics

The `docs/semantic_metrics.md` document defines the business metrics, dimensions, formulas, and semantic concepts used by the MetricMind Semantic BI Engine.

This document serves as the foundation for implementing the Semantic Layer using Cube.dev/dbt and ensures that AI-generated business insights are consistent, accurate, and governed across the application.