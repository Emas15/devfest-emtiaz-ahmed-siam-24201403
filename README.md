# TenderPulse

A browser-only tender package workspace for the AI DevFest Tender Document Package Builder challenge.

## What it does

- Imports and validates a local `requirements.json` file.
- Accepts, checks, hashes, counts, and matches local PDFs without uploading them.
- Tracks missing documents, expiry dates, duplicates, and package readiness.
- Builds a verified PDF package with cover, index, ordered documents, and page footers.
- Supports English and Bangla throughout the interface.
- Keeps workflow state in one reducer-managed browser state object.

## Run locally

```bash
npm install
npm run dev
```

No API key, backend, database, remote storage, external font, or runtime network request is used. All tender data and PDF processing stay in the browser.
