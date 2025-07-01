# Backend Endpoints Missing for Menu Page

While most CRUD operations for menus, categories and items are present under `src/api/endpoints`, several UI parts of the dashboard **Menu** page would require additional endpoints.

- **Bulk operations** – the table selections hint at mass actions (activate/deactivate or delete multiple categories/items). There are only single-item endpoints (`deleteItem`, `deleteCategory`, etc.). Bulk endpoints would simplify these actions.
- **Menu statistics** – the overview tab displays item counts but there is no API providing a summary like number of items, available items or total categories. Such an endpoint would avoid fetching all records just to compute totals.
- **Public preview link** – the "Visualizar cardápio" button suggests a direct preview of the menu. A dedicated endpoint to generate or fetch a public menu URL is not implemented.
- **Reordering support** – categories expose a `position` field but the API lacks routes to reorder categories or items in bulk. Dedicated endpoints (e.g., `PUT /menus/{id}/reorder-categories`) would allow drag-and-drop ordering.

Adding these endpoints would enable the remaining features on the menu management pages.
