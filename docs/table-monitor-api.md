# Table Monitor API Notes

This page lists the backend endpoints that the Table Monitor screen is expected to use. Some may already exist, others would have to be implemented.

## Existing endpoints
- `GET /sessions/active/{tableId}` – fetch active session for a specific table.
- `POST /sessions/{sessionId}/close` – close a session after payment.
- `POST /sessions/{sessionId}/cancel` – cancel a session and its orders.
- `GET /tables/restaurant/{restaurantId}` – list tables for a restaurant.

## Suggested new endpoints
- `GET /sessions/restaurant/{restaurantId}/active` – list active sessions for all tables with their current state (useful on initial load).
- `GET /tables/restaurant/{restaurantId}/status` – returns each table with flags `isAvailable`, `waitingBill`, `callingWaiter` and the current `sessionId` if any.
- `POST /sessions/{sessionId}/mark-paid` – marks the session as paid and ends it (could reuse `/close`).
- `POST /sessions/{sessionId}/clean` – cancel all orders, cancel the session and open a new empty session for that table.
- `POST /sessions` – create a new session manually when a table becomes occupied without an order.
- **WebSocket** `/ws/{restaurantId}/table-status` – pushes live updates when a table calls a waiter or requests the bill.

These endpoints would allow the front‑end to show real‑time table status and give staff direct controls to manage each session from the monitoring page.
