# Menu Page Current Status

This document outlines the features still incomplete or missing in the dashboard **Menu** page (`src/pages/dashboard/menu`).

## Missing or incomplete behaviours
- **Preview button without action** – the "Visualizar cardápio" button in `menu.tsx` lacks a link or event handler, so it does nothing when clicked.
- **Settings button unused** – the settings icon button also has no onClick handler or route.
- **Bulk selection not used** – checkboxes in `CategoriesTab` and `ItemsTab` allow selecting multiple rows but there are no bulk actions implemented.
- **Category dropdown "Ver itens"** – the menu option intended to show items of a category has no navigation or handler.
- **Items filter placeholder** – `ItemsTab` renders a status filter (`Select` with `available`/`unavailable`) but the selected value is ignored when filtering the table.
- **Hidden sections** – the "Preferências de Exibição" card in `OverviewTab` and the "Itens na Categoria" table in `category.tsx` are wrapped with `className="hidden"` meaning their functionality is yet to be implemented.
- **Static statistics** – `OverviewTab` shows a hardcoded value of `13` for the number of items instead of deriving it from API data.

## Other observations
- Category details page lists item IDs only and displays placeholder text instead of loading actual item info.
- No link exists to preview the digital menu directly from the dashboard page.
- The `handleImportMenu` function in `create-menu-options.tsx` is empty.

These areas need additional implementation (routing, API integration and UI) for the menu management section to be complete.
