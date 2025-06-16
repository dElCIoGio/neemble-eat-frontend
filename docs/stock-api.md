# Backend Endpoints for Stock Page

This document outlines the backend/database interactions required to make the
`src/pages/dashboard/stock.tsx` page functional. The page manages stock items,
movements, recipes, sales and suppliers. Below is a summary of the required API
endpoints and the data shapes used (see `src/types/stock.ts`).

## Stock Items

### List stock items
- **GET /api/stock** – Returns an array of `StockItem`.

### Create a new item
- **POST /api/stock** – Expects `StockItem` (without `id`). Returns created
  `StockItem`.

### Retrieve single item
- **GET /api/stock/:id** – Returns the `StockItem` with given `id`.

### Update an item
- **PUT /api/stock/:id** – Accepts partial `StockItem` with fields to update.
  Returns the updated `StockItem`.

### Delete an item
- **DELETE /api/stock/:id** – Deletes the stock item. Should also remove
  related `Movement` records if needed.

### Replenish stock / manual additions
- **POST /api/stock/:id/add** – Body: `{ quantity: number, reason?: string }`.
  Creates a new `Movement` of type `entrada` and updates the item's
  `currentQuantity` and `lastEntry`.

### Remove stock (e.g. waste adjustments)
- **POST /api/stock/:id/remove** – Body: `{ quantity: number, reason?: string }`.
  Adds a `Movement` of type `saída` or `ajuste` and updates the quantity.

## Movements

### List movements
- **GET /api/movements** – Returns array of `Movement` ordered by date
  descending. Supports filtering by product or date range.

### Create movement
- **POST /api/movements** – Create a movement record (for situations where the
  movement does not originate from another endpoint).

## Recipes

### List recipes
- **GET /api/recipes** – Returns array of `Recipe`.

### Create recipe
- **POST /api/recipes** – Body: `Recipe` without `id`. Should validate that all
  referenced products exist.

### Update recipe
- **PUT /api/recipes/:id** – Update an existing recipe.

### Delete recipe
- **DELETE /api/recipes/:id** – Remove recipe. Optionally disallow deletion when
  sales reference the recipe.

## Sales

### List sales
- **GET /api/sales** – Returns array of `Sale`.

### Register sale
- **POST /api/sales** – Body: `{ recipeId: number, quantity: number }`.
  Decrements stock for each ingredient, adds a `Movement` record for each item
  and creates a `Sale` entry.

## Suppliers

### List suppliers
- **GET /api/suppliers** – Returns array of `Supplier`.

### Create supplier
- **POST /api/suppliers** – Body: `Supplier` without `id`.

### Update supplier
- **PUT /api/suppliers/:id** – Update supplier information and list of supplied
  products.

### Delete supplier
- **DELETE /api/suppliers/:id** – Remove supplier.

## Categories

Although categories are simple strings on the page, an endpoint may be useful
for managing them:
- **GET /api/categories** – List distinct category names.
- **POST /api/categories** – Create a new category.
- **DELETE /api/categories/:name** – Remove a category (only possible if no
  items are linked to it).

## Stats and Reports

The page displays statistics such as total products, items with low stock,
critical items and total inventory value. These can be computed client‑side from
the `/api/stock` response, but for efficiency the backend may expose:
- **GET /api/stock/stats** – Returns totals, e.g. `{ totalItems, lowStock,
  criticalStock, totalValue }`.

## Export

The page can export inventory data to CSV. This can be handled entirely in the
frontend using the `/api/stock` response, or a dedicated endpoint can provide a
ready-to-download file:
- **GET /api/stock/export** – Returns CSV data for all items.

## Purchase Orders and Auto Reorder

Comments in the page suggest generating purchase orders and automatic
replenishment. For that the backend could provide:
- **GET /api/stock/auto-reorder** – Returns items where `autoReorder` is true and
  `currentQuantity <= reorderPoint` along with suggested quantities.
- **POST /api/stock/purchase-orders** – Create a purchase order for given items
  and quantities.

## Authentication / Authorization

All endpoints above should be protected so that only authenticated users of the
restaurant can access or modify data.

