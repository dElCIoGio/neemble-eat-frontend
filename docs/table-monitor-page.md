# Table Monitor Page

This document describes the planned **Table Monitor** page used by staff to follow the status of each table in the restaurant and to manage sessions.

## Access
- **Route:** `/dashboard/table-monitor`
- **Sidebar:** Add a new entry labelled **"Mesas"** or **"Table Monitor"** below the **Orders** link.
- Only authenticated dashboard users can access it (same protection as other dashboard routes).

## Layout and Behaviour
1. **Table Grid**
   - Displays all tables of the current restaurant as cards in a responsive grid.
   - Each card shows the table number and its current status.
   - Possible statuses:
     - `Disponível` – no active session.
     - `Ocupada` – session active.
     - `Conta Pedida` – customer requested bill.
     - `Chamando Funcionário` – customer called for assistance.
   - Cards use colour coding or small icons to highlight the status.
   - Clicking a card opens a side panel (or modal on mobile) with details about that table.

2. **Details Panel**
   - Shows current session information: start time, running time, current total and list of orders.
   - Buttons:
     - **Marcar como Pago** – marks the session as paid and closes it.
     - **Limpar Mesa** – when the table is left without paying; cancels the session orders, cancels the session itself and opens a fresh session for that table.
   - When no session exists the panel can show a button to **Iniciar Sessão** to create a new session manually (useful for walk‑ins).

3. **Filters and Alerts**
   - Above the grid there are quick filters: *Todas*, *Disponíveis*, *Ocupadas*, *Conta Pedida* and *Chamando Funcionário*.
   - The page listens to WebSocket updates so that status changes (bill requests or calls) appear in real time without manual refresh.

4. **Ending a Session**
   - After pressing **Marcar como Pago**, the session is closed, its status becomes `Disponível` again and the card goes back to the default look.

5. **Cleaning a Table**
   - If the client leaves without paying, the staff uses **Limpar Mesa**. This cancels outstanding orders, cancels the session and immediately starts a new empty session for the table so it becomes available again.

The page therefore centralises table activity so waiters can react quickly to customer requests and keep track of which tables are in use.
