# Dashboard Permissions Mapping

This document maps existing dashboard tabs to the permission **sections** defined in `src/types/role.ts`.
Each tab corresponds to exactly one section so that permissions can be toggled independently. Sections that do not yet have a tab or screen are collected at the end.

## 1. Dashboard Pages and Sections

### Home (`/dashboard`)
- **sales_dashboard** – overall sales metrics shown on the home page.
- **performance_insights** – performance insight cards.
- **product_popularity** – popular items chart.
- **revenue_trends** – revenue trend chart.
- **customer_feedback** – customer feedback highlights.

### Menu (`/dashboard/menu/:menuId`)
- **menus** – "Visão Geral" tab of a menu.
- **categories** – "Categorias" tab.
- **items** – "Itens" tab. Customization management is handled inside this tab, therefore the previous `customizations` section can be merged into **items**.

### QR Codes (`/dashboard/qrcode`)
- **table_qr_access_control** – managing the list of table QR codes.

### Bookings (`/dashboard/bookings`)
- **reservations** – reservation list and creation sheet.

### Orders Tracking (`/dashboard/orders-tracking`)
- **orders** – live order list used by staff.

### Table Monitor (`/dashboard/table-monitor`)
- **tables** – status of each table and open sessions.

### Stock (`/dashboard/stock`)
Tabs in this screen do not have matching sections yet. Proposed new sections:
- **stock_items** – stock overview tab.
- **stock_recipes** – recipes tab.
- **stock_movements** – inventory movement records.
- **stock_suppliers** – suppliers tab.

### Reports (`/dashboard/reports`)
- **reports** – default sales reports tab.
- **invoices** – invoices tab within reports.

### Subscription (`/dashboard/subscription`)
Tabs to control the subscription and payments. Proposed new sections:
- **subscription_overview** – general subscription information.
- **subscription_plans** – plan selection tab.
- **subscription_history** – payment history tab.
- **subscription_settings** – payment method and billing details.
The existing `payments` section can map to **subscription_history**.

### Staff (`/dashboard/staff`)
- **users** – member list.
- **roles** – role management dialog.
- **permissions** – editing of individual role permissions.

### Settings (`/dashboard/settings`)
- **restaurant_settings** – "Geral" tab with basic info.
- **opening_hours** – part of the "Restaurante" tab.
- **table_qr_configuration** – QR appearance settings inside the "Restaurante" tab.
- **integration_settings** – "Integração" tab.
The `printer_setup` section currently has no corresponding UI and remains unassigned.

### Support (`/dashboard/support`)
Tabs for user help. Proposed new sections:
- **support_faq** – FAQ tab.
- **support_contact** – contact form tab.
- **support_knowledge** – knowledge base.
- **support_chat** – live chat tab.
- **help_requests** – "Meus Tickets" tab, maps to the existing section.

### Notifications (`/dashboard/notifications`)
Proposed new sections for the configuration tabs:
- **notification_types** – "Tipos" tab.
- **notification_channels** – "Canais" tab.
- **notification_schedule** – "Horários" tab.
- **notification_priorities** – "Prioridades" tab.

### Profile (`/dashboard/profile`)
- **profile_settings** – user personal preferences. New section.

## 2. Unassigned Sections
The following existing sections from `src/types/role.ts` do not currently correspond to any dashboard tab and cannot be assigned yet:
- **customer_orders_summary**
- **kitchen_view**
- **bar_view**
- **order_queue**
- **printer_setup**
- **promotions**
- **announcements**
- **customer_reviews**
- **system_logs**

These should either be removed or held until matching screens exist.

