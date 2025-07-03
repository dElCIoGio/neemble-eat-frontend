# Dashboard Pending Features

This document records UI elements and logic still missing in the dashboard codebase.

## Dashboard Home
- Uses mock objects (`salesData`, `ordersData`, etc.) in `dashboard-home.tsx` instead of fetching real analytics.
- `SessionsCard` component leaves growth and distribution data as TODO comments.

## Menu Management
- `create-menu-options.tsx` shows an "Importar Cardápio" card with a disabled button and an "Em breve" badge.
- Several actions in category items (`categories/category.tsx`) are wired to UI controls but require backend endpoints for bulk operations and live statistics.

## Staff Page
- `handleBulkAction` in `dashboard-staff-context.tsx` only shows a toast and clears selections; no server calls are made.
- Editing a member (`handleEditMember`) opens a dialog but the form submission to update the user is absent.

## Table Monitor
- `handleStartSession` in `table-monitor.tsx` displays a "Funcionalidade não implementada" message.

## Onboarding
- `userExists` in `src/pages/root/onboarding.tsx` is a mock function and does not check the backend.

## Layout
- `DashboardLayout` falls back to a `dummyRestaurant` object when no restaurant is returned from the API.

These areas represent work in progress requiring backend integration or additional frontend logic.
