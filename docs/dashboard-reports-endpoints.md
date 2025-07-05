# Dashboard Reports Page Endpoints

This document lists backend endpoints required for the Reports page. Existing endpoints are referenced where possible. New ones are suggested when necessary.

## Sales Summary
- **GET `/analytics/sales-summary`**
  - Params: `restaurantId`, `startDate`, `endDate`
  - Returns total sales amount and order count for the period
- **GET `/analytics/recent-orders`** *(existing)*
  - Params: `restaurantId`, `days`
  - Used for quick charts showing order trends

## Invoices
- **GET `/analytics/invoices`**
  - Params: `restaurantId`, `startDate`, `endDate`, `status?`
  - Returns invoice count and totals. Supports filtering by paid/pending.
- **GET `/invoices/:id/download`** *(new)*
  - Download individual invoice PDF

## Items Sold
- **GET `/analytics/top-items`**
  - Params: `restaurantId`, `startDate`, `endDate`, `category?`
  - Returns items with quantity sold
- **GET `/reports/items`** *(new)*
  - Params: `restaurantId`, `startDate`, `endDate`, `category?`, `status?`
  - Provides full item-level export (used for CSV/PDF)

## Cancelled Orders/Items
- **GET `/analytics/cancelled-orders`**
  - Params: `restaurantId`, `startDate`, `endDate`
  - Number of cancelled orders and amounts
- **GET `/reports/cancelled`** *(new)*
  - Params: `restaurantId`, `startDate`, `endDate`
  - Detailed list of cancelled items/orders for exports

## Concerns
- All endpoints must validate that the requesting user has access to the restaurant data
- Large exports might require background jobs and a download link via email
- Timezone handling should be consistent between client and server
- Pagination parameters (`page`, `pageSize`) should be supported for tables

