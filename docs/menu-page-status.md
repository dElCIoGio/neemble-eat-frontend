# Menu Page Status

This document lists features of the dashboard **Menu** section (`src/pages/dashboard/menu`) that are present in the UI but still lack real functionality.

## Incomplete Features

- **Unused preview icon** – `menu.tsx` imports an `Eye` icon suggesting a preview capability, but it is never rendered. No button currently links to a live menu preview.
- **Settings button without behaviour** – the gear icon button in `menu.tsx` does not have any click handler or route attached.
- **Empty import handler** – `create-menu-options.tsx` defines `handleImportMenu` but leaves it empty, so clicking the "Faster" badge has no effect.
- **Unwired actions in category view** – inside `categories/category.tsx` the "Adicionar Item" button and the dropdown actions (toggle availability or remove from category) do not trigger any functions.
- **Static item count** – `overview-tab.tsx` shows a hard‑coded value (`13`) for the number of items instead of deriving it from the API.
- **Bulk selection with no follow‑up** – both `CategoriesTab` and `ItemsTab` allow selecting multiple rows, but no bulk actions are implemented.

These areas need further development (routing, API integration, or UI handling) for the menu management section to be fully functional.
