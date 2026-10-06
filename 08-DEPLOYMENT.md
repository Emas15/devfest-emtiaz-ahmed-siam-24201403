# Static Deployment Runbook

The public HTTPS deployment is compulsory and must be ready by T+90. Choose one static hosting provider you can already access. Keep the deployed version aligned with the final eligible commit. Do not put secrets in the app or deployment.

## Early decision

- Preferred provider/account ready: `[GitHub Pages / Vercel / Netlify / Cloudflare Pages / other allowed static host]`
- Framework/build tool: `[fill after problem release]`
- Build command: `[ ]`
- Output folder: `[ ]`
- Public URL: `[ ]`

## Deployment sequence

1. Prove the provider/account works early, ideally before T+60–T+70. A minimal valid first deployment is better than discovering setup problems at T+85.
2. Read the generated project instructions and use the host's static-site deployment configuration. No server functions or persistent backend.
3. Build locally and resolve build errors before using the last minutes.
4. Push the eligible commit and trigger deployment while time remains.
5. Open the HTTPS URL in a fresh browser tab, preferably signed out/private. Test the main flow and both language modes.
6. Record the exact repository URL, live URL, and full commit ID in `06-COMMIT-LOG.md` and README.
7. By T+90, ensure the final eligible commit is pushed and its matching live deployment is available. Stop all changes at T+90.

## Failure fallback

If a host's setup is consuming time, use another permitted static host you can access. Preserve the core app and deployment. Do not switch to a backend/database service to solve a static hosting issue. If organizer-provided internet or lab equipment fails, notify an organizer immediately.
