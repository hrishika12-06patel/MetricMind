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