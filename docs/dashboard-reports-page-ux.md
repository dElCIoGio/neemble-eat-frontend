# Neemble Eat Dashboard – Reports Page UX (Revision)

## 1. Objectives
- Enable managers to **view, filter, and export** key sales‑related data (sales totals, invoices, items sold, cancelled orders).
- Maintain visual consistency with the existing dashboard **left‑hand navigation sidebar** without introducing a second permanent sidebar.
- Provide an experience that scales gracefully from desktop to mobile.

---

## 2. Design Constraint & Solution

**Constraint:** The dashboard already has a persistent left navigation sidebar.

**Solution:** Replace the planned secondary “Filter Sidebar” with a **contextual Filter Drawer** that slides in from the right on desktop and opens as a full‑screen sheet on mobile. A dedicated **Filter button** in the header toggles the drawer.

- The drawer overlays content (does **not** shrink the page layout), preventing horizontal crowding.
- A pill‑style badge on the Filter button displays the count of active filters.

---

## 3. Page Layout

### 3.1 Header (Sticky)

| Element | Purpose                                                           |
|---------|-------------------------------------------------------------------|
| **Page Title** – “Reports” | Contextual heading                                                |
| **Quick Date Presets** | Chips: Today · Last 7 days (default) · Last 30 days · Custom      |
| **Filter Button** | Opens the right drawer. Badge shows active‑filter count.          |
| **Export Menu** | Dropdown: **Export →** PDF · CSV (applies to current table state) |

### 3.2 Body
┌───────────────────────────────────────────────┐
│ Header (sticky) │
├───────────────────────────────────────────────┤
│ Report Tabs (horizontal) │
│ ─ Sales Summary │ Invoices │ Items Sold │ … │
├───────────────────────────────────────────────┤
│ Insight Panel (Total Revenue, Top Item…) │
├───────────────────────────────────────────────┤
│ Results Table (sortable, paginated) │
└───────────────────────────────────────────────┘


### 3.3 Filter Drawer (Right)

Visible only when invoked.

- **Date Range Picker** (start/end date + optional time)
- **Item Categories** (multi‑select)
- **Order Status** (Completed, Cancelled)
- **Invoice Status** (Paid, Pending)
- **Action Buttons**: Apply · Reset

#### Mobile Adaptation

- Filter button reveals a **full‑screen modal sheet** with the same controls and sticky action bar (Apply/Reset) at the bottom.

---

## 4. Report Tabs & Tables

| Tab               | Key Columns                                                 | Notes |
|-------------------|-------------------------------------------------------------|-------|
| **Sales Summary** | Date · Gross Sales · Net Sales · Orders                     | Default view |
| **Invoices**      | Invoice # · Customer · Date · Status · Total · **Download** | Download row action (PDF) |
| **Items Sold**    | Item · Category · Qty · Gross · Net                         | Sortable by Qty/Net |
| **Cancelled**     | Order # · Item · Reason · Value                             | Combines cancelled items & orders |

- Columns are **sortable**; tables paginate at 25 rows by default.
- Empty‑state illustrations + helpful copy when no data matches.
- Option to **customize visible columns** (future-ready feature).

---

## 5. Workflow (Happy Path)

1. User selects **Reports** from the nav sidebar → default view = *Sales Summary/Last 7 days*.
2. User clicks **Filter** → drawer opens.
3. User sets filters → **Apply**.
4. Frontend calls `/reports/{tab}` endpoint with query params (dates, categories, statuses).
5. Results table refreshes. Active filter badge increments.
6. User switches tabs; current filters persist (state stored in URL query string & context provider).
7. User chooses **Export → CSV**; backend streams the filtered dataset.

---

## 6. Components

| Component                                                    | Description |
|--------------------------------------------------------------|-------------|
| **ReportsHeader**                                            | Title, date presets, FilterButton (+badge), ExportMenu |
| **FilterDrawer**                                             | Replaces sidebar; reused as full‑screen sheet on mobile |
| **ReportsTabs**                                              | Manages active tab & URL syncing |
| **InsightPanel**                                             | Displays Total Revenue, Top‑Selling Item, Avg. Order Value |
| **SalesTable / InvoicesTable / ItemsTable / CancelledTable** | Data grids per tab |
| **ExportButton**                                             | Handles PDF/CSV generation and triggers async export if large |
| **DownloadCenter**                                           | Modal or section showing status/history of export jobs |
| **UI Atoms**                                                 | Buttons, inputs, date picker from design system |

---

## 7. Accessibility & UX Notes

- Filter drawer traps focus and returns it to the triggering button on close.
- Tables provide `aria‑sort` attributes and keyboard navigation.
- Badge uses `aria‑label` to announce number of active filters.
- Empty states include actionable tips like "Try widening your filters" and examples.

---

## 8. Technical Considerations

- Persist filter state in URL (`/reports?tab=sales&from=…&cats=…`). Enables deep‑links and browser refresh safety.
- Lazy‑load table data after drawer **Apply** for performance.
- Export endpoints stream data in chunks to avoid large payloads.
- Large reports handled with **asynchronous export jobs** and downloadable links.

---

## 9. Future Enhancements

- **Saved Filter Sets** for quick re‑application.
- **Chart view toggle** to visualise trends above the table.
- **Print-Friendly Report View** with simplified layout, logo, and timestamp.
- **Global Search** across tabs (item name, invoice #, customer, etc.).

