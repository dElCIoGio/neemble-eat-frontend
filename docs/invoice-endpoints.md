# Invoice API Endpoints

This document describes available endpoints for managing invoices.

## CRUD Operations
- **POST `/invoices/`** – create a new invoice
- **GET `/invoices/:id`** – retrieve a single invoice
- **PUT `/invoices/:id`** – update an invoice
- **DELETE `/invoices/:id`** – remove an invoice

## Additional Operations
- **GET `/invoices`** – list all invoices
- **GET `/invoices/paginate`** – cursor based pagination. Accepts `cursor`, `limit` and filter params
- **GET `/invoices/restaurant/:restaurantId`** – invoices for a specific restaurant
- **GET `/invoices/session/:sessionId`** – invoices for a table session
- **PUT `/invoices/:id/pay`** – mark an invoice as paid
- **POST `/invoices/:id/cancel`** – cancel an invoice
- **GET `/invoices/:id/download`** – download invoice PDF
