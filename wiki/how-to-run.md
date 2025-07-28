# Running & Deployment Guide

> This guide expands on the quick-start in the root README.

## Prerequisites

| Tool | Version |
|------|---------|
| Node.js | ≥ 18.x |
| pnpm / npm / yarn | latest |
| Supabase CLI | ≥ 1.158 |
| Git | ≥ 2.40 |

## Environment Variables

Copy `.env.example` inside `induxia-insight-hub` and fill:

```env
VITE_SUPABASE_URL=...
VITE_SUPABASE_ANON_KEY=...
```

For local edge functions:

```env
SUPABASE_ACCESS_TOKEN=...
```

## Local Development

```bash
# frontend
cd induxia-insight-hub
pnpm install # or npm i
pnpm run dev
```

In another terminal, start Supabase:

```bash
supabase start
```

Edge functions are auto-deployed on save.

## Testing Supabase Functions

```bash
supabase functions serve --no-verify-jwt
```
Point your REST client to `http://localhost:54321/functions/v1/create-demo-accounts`.

## Building for Production

```bash
pnpm run build  # outputs static files to dist/
```

Deploy `dist/` to your preferred host (Vercel, Netlify, S3+CloudFront, etc.).

Edge functions can be deployed with:

```bash
supabase functions deploy create-demo-accounts
supabase functions deploy n8n-agent-bridge
```

## CI/CD Suggestions

* GitHub Actions for lint → build → deploy. See `.github/workflows/` (not committed yet).
* Supabase migration scripts live inside `supabase/migrations/` – run `supabase db push` in CI.

## Troubleshooting

| Issue | Fix |
|-------|-----|
| Port 8080 already in use | set `PORT` env var before `pnpm dev` |
| 404 on edge function | ensure you called `functions serve` or deployed |
| `Invalid API key` | check `VITE_SUPABASE_ANON_KEY` |

Happy hacking! :rocket: 