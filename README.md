# TenderPulse

A browser-only tender package workspace for the AI DevFest Tender Document Package Builder challenge.

## Current slice

- Imports and validates local `requirements.json` files.
- Sorts requirements by tender order.
- Presents tender details and a status checklist.
- Supports English and Bangla across the interface.
- Keeps imported tender data in one reducer-managed client-side state object.

## Run locally

```bash
npm install
npm run dev
```

No API keys, server, database, or participant-controlled storage are used.
