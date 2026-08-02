# API Testing Report

## Objective

Verify that all backend APIs work correctly using Postman.

## APIs Tested

- GET /
- GET /db-test
- GET /health
- GET /info
- GET /orders
- GET /orders/count
- GET /orders/total-sales
- GET /orders/total-profit
- GET /db/indexes

## Test Scenarios

### Basic Endpoint Testing
- Verified all endpoints return successful responses.

### Pagination
- page=1&limit=10
- page=2&limit=10

### Filtering
- region=East
- category=Furniture
- segment=Consumer

### Sorting
- sort_by=Sales&order=asc
- sort_by=Sales&order=desc
- sort_by=Profit&order=desc

### Combined Query
- region=East
- category=Furniture
- page=1
- limit=5
- sort_by=Sales
- order=desc

### Invalid Parameter Testing
- page=0
- limit=101
- order=abc
- sort_by=xyz

## Results

| Test Scenario | Status | Remarks |
|--------------|--------|---------|
| Basic APIs | Pass | All endpoints returned expected responses |
| Pagination | Pass | Pagination worked correctly |
| Filtering | Pass | Region, Category, and Segment filters worked correctly |
| Sorting | Pass | Sorting by Sales and Profit worked correctly |
| Combined Query | Pass | Filtering, sorting, and pagination worked together |
| Invalid Page | Pass | Returned HTTP 422 Validation Error |
| Invalid Limit | Pass | Returned HTTP 422 Validation Error |
| Invalid Order | Observation | Returned HTTP 200 instead of validation error |
| Invalid Sort Field | Observation | Returned HTTP 200 instead of validation error |

## Issues Found

- Invalid values for `order` and `sort_by` returned `200 OK` instead of a validation error.
- All other endpoints behaved as expected.