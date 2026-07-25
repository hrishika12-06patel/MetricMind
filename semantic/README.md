# Architecture

MetricMind follows a modular architecture that separates business logic, semantic definitions, and data processing.

```
                User
                  │
                  ▼
          Backend Application
                  │
        ┌─────────┴─────────┐
        ▼                   ▼
 Semantic Layer         Database
        │                   │
        └─────────┬─────────┘
                  ▼
          Business Metrics
                  │
                  ▼
             AI / Analytics
```

The semantic layer provides standardized business entities and metrics, allowing AI systems and dashboards to query business data consistently.

# Project Folder Structure

```text
MetricMind/
│
├── semantic/
│   ├── customer.yaml
│   ├── product.yaml
│   ├── order.yaml
│   ├── region.yaml
│   ├── category.yaml
│   ├── sub_category.yaml
│   ├── segment.yaml
│   ├── ship_mode.yaml
│   ├── revenue.yaml
│   ├── sales.yaml
│   ├── profit.yaml
│   ├── quantity.yaml
│   ├── discount.yaml
│   ├── customer_kpi.yaml
│   ├── sales_kpi.yaml
│   ├── profit_kpi.yaml
│   ├── quantity_kpi.yaml
│   ├── orders_kpi.yaml
│   ├── discount_kpi.yaml
│   └── README.md
│
└── backend/
```

The **semantic** folder contains reusable business entities, metrics, and KPI definitions used across the project.

# Backend Workflow

1. User submits a query.
2. Backend receives the request.
3. Semantic layer identifies the required business entities and metrics.
4. Database retrieves the requested data.
5. Backend processes the results.
6. The final response is returned to the user or dashboard.

# Database Workflow

1. Backend sends a database request.
2. Database fetches records.
3. Retrieved data is mapped using the semantic layer.
4. Business metrics are calculated.
5. Processed data is returned to the backend.

# Semantic Layer

The semantic layer standardizes business terminology used throughout the project.

## Business Entities

- Customer
- Product
- Order
- Region
- Category
- Sub Category
- Segment
- Ship Mode

## Business Metrics

- Revenue
- Sales
- Profit
- Orders
- Quantity
- Discount

## Benefits

- Consistent business definitions
- Reusable metrics
- Easier AI integration
- Improved maintainability
- Simplified analytics

# Setup Guide

1. Clone the repository.

```bash
git clone <repository-url>
```

2. Navigate to the project directory.

```bash
cd MetricMind
```

3. Install the required dependencies.

```bash
pip install -r requirements.txt
```

4. Configure the database connection.

5. Start the backend application.

6. Verify that the semantic layer is loaded successfully.

# Contribution Guide

1. Fork the repository.
2. Create a new branch.
3. Make your changes.
4. Test the project.
5. Commit your changes.
6. Push your branch.
7. Create a Pull Request.

Please follow the project's coding standards and maintain consistent naming conventions across all semantic files.