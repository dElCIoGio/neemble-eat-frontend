# Backend Endpoints Missing for Equipe Page

The current implementation of the dashboard's team page relies on several API calls defined under `src/api/endpoints`. The following additional endpoints would be needed to fully implement all features:

- **Bulk member updates** – endpoints to activate/deactivate multiple memberships and to export member lists are not present.
- **Edit member details** – an endpoint to update another user's profile (name, phone, etc.) should be exposed so the edit dialog can save changes.
- **Team statistics** – a summary endpoint could provide counts of active, pending and inactive members instead of computing on the client.
- **Invitation email** – if invitations should be sent by email, a backend route would be required to dispatch the email after `createInvitation`.

