# Dashboard Subscription Page Endpoints

This document outlines the backend APIs required to fully implement the Subscription page functionality. Endpoints are grouped by the sections of the page where they are used.

## Current Subscription
- **GET `/subscriptions/current`** – retrieve the active plan details, billing cycle, auto–renewal status and plan features.
- **GET `/subscriptions/usage`** – returns current usage metrics (restaurants, tables, reservations and staff) against plan limits.
- **GET `/payments/history`** – list previous payments for the subscription. Supports filtering by date range and status.

## Plans and Upgrades
- **GET `/subscription-plans`** – fetch available plans with prices and limits.
- **POST `/subscriptions/change-plan`** – request an upgrade or downgrade. Body: `planId`, optional `reason`.
- **POST `/payments/proofs`** – upload manual payment proof when upgrading or renewing. Accepts form data with `holderName`, `reference`, `paymentDate`, `amount` and `file`.

## Invoices and Billing
- **GET `/invoices/latest`** – obtain the most recent invoice for the current subscription.
- **GET `/invoices/:id/download`** – download a specific invoice PDF.

## Account Management
- **POST `/subscriptions/pause`** – pause the account temporarily. Optional body `reason`.
- **POST `/subscriptions/resume`** – resume a paused subscription.
- **POST `/account/backup`** – generate and download a JSON backup of account data.

## Support and Referrals
- **POST `/support/tickets`** – open a priority support ticket. Returns ticket number.
- **GET `/referrals/code`** – retrieve the user’s referral code.
- **POST `/referrals/invite`** – send an invitation using the referral program. Body: `emails[]`.
- **GET `/support/chat-token`** – obtain token/URL for the live chat service.

## Notification & Renewal Settings
- **GET `/subscriptions/settings`** – fetch current notification and auto‑renewal preferences.
- **PATCH `/subscriptions/settings`** – update `autoRenewal` or notification channels (`email`, `sms`, `whatsapp`).

These endpoints cover all dynamic interactions on the Subscription page, allowing the UI components to fetch data and perform actions efficiently.
