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

| Test | Result |
|------|--------|
| Basic APIs | Pass |
| Pagination | Pass |
| Filtering | Pass |
| Sorting | Pass |
| Combined Query | Pass |
| Invalid Page | Pass (422 returned) |
| Invalid Limit | Pass (422 returned) |
| Invalid Order | Returned 200 OK |
| Invalid Sort Field | Returned 200 OK |

## Issues Found

- Invalid values for `order` and `sort_by` returned `200 OK` instead of a validation error.
- All other endpoints behaved as expected.