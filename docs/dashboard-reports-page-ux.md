# Dashboard Reports Page UX

This document outlines the proposed structure, user experience and workflow for the new **Reports** page.

## Goals
- Allow managers to view and export key sales, invoice and item data
- Provide filters by date, time and item categories to refine results
- Support PDF/CSV export for full reports

## Page Layout
1. **Header**
   - Page title "Reports"
   - Quick date range selector (Today, Last 7 days, Last 30 days, Custom)
   - Export menu with PDF/CSV options for the current view
2. **Filter Sidebar**
   - Visible on desktop, collapsible on mobile
   - Date range picker (start/end date and optional time)
   - Item category multi‑select
   - Order status selection (completed, cancelled)
   - Invoice status selection (paid, pending)
   - Apply/Reset buttons
3. **Report Tabs**
   - Sales Summary
   - Invoices
   - Items Sold
   - Cancelled Items/Orders
   - Each tab shows a table with sortable columns and pagination
4. **Results Table**
   - Displays filtered data for the active tab
   - Columns adjust per tab (e.g. Items Sold includes quantity)
   - Download row action for individual invoices/orders when applicable
5. **Empty State**
   - Friendly message when no data matches the filters

## Workflow
1. User opens the Reports page from the dashboard navigation
2. Default view shows the Sales Summary tab for the last 7 days
3. User adjusts filters in the sidebar and clicks **Apply**
4. Frontend fetches data from the relevant endpoints with the selected filters
5. Tables update to show results
6. User can switch tabs without losing the current filter state
7. Export menu downloads the current table data as PDF or CSV
8. On mobile, filters open in a dialog for ease of use

## Components
- `ReportsHeader` – contains the title, date presets and export menu
- `ReportsFilters` – sidebar or dialog with filter controls
- `ReportsTabs` – manages active tab and renders the correct table
- `SalesTable`, `InvoicesTable`, `ItemsTable`, `CancelledTable` – table components for each tab
- `ExportButton` – triggers PDF/CSV generation
- Reuse existing UI atoms (buttons, inputs, date picker) from the design system

