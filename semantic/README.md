# Semantic Layer

This folder contains all reusable business metric definitions for MetricMind.

## Folder Structure

### cubes/

Business metric definitions.

- revenue.yaml
- profit.yaml
- discount.yaml
- quantity.yaml
- orders.yaml
- customer.yaml

### views/

Logical groupings of existing cubes.

- sales.yaml

## Shared Dimensions

- order_date
- region
- product_line
- customer_segment

## Known Issues

- Verify cost_amount exists.
- Verify customer_id exists.
- Verify discount_amount exists.
- Verify multi-currency support.
- Merge duplicate order count definitions.

## Semantic Layer

### Business Entities

- Customer
- Product
- Order
- Region
- Category
- Segment
- Ship Mode

### Business Metrics

- Revenue
- Sales
- Profit
- Orders
- Quantity
- Discount

### KPI Documentation

- Sales KPI
- Profit KPI
- Orders KPI
- Customer KPI
- Quantity KPI
- Discount KPI

The semantic layer now contains standardized business entities, metrics, and KPI definitions to support future AI-driven querying and business analytics.