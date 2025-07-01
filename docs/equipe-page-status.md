# Equipe Page Current Status

This document lists missing or incomplete features in `src/pages/dashboard/staff.tsx` ("Equipe" page).

## Missing or incomplete behaviours

- **Bulk actions have no backend logic** – `handleBulkAction` in `dashboard-staff-context.tsx` only shows a toast and clears selections without making API calls.
- **Member editing dialog not implemented** – `handleEditMember` sets `isEditDialogOpen` but the page never renders a dialog to update member info.
- **View permissions button on mobile cards lacks action** – the "Ver Permissões" option in `member-card.tsx` does nothing when clicked.
- **View mode toggle unused** – `Filters` component allows switching between table and cards but `staff.tsx` never uses `viewMode` state.
- **Stats derived from client data** – totals for active, pending and inactive members are computed locally; there is no endpoint to retrieve these counts directly.
