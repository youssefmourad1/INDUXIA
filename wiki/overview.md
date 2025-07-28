# Overview & Architecture

INDUXIA Insight Hub is organised as a **monorepo** containing the React front-end (induxia-insight-hub/) and a set of Supabase edge functions (supabase/functions/).  
The goal is to provide a single source of truth for plant directors, operators, quality managers and supply-chain teams.

![Architecture](../screenshots/director%20dashboard.png)

## Front-end

* **React 18 + Vite** – lightning-fast dev-server & HMR.
* **TypeScript throughout** – type-safe components, hooks and utilities.
* **shadcn/ui + Tailwind CSS** – pre-built, accessible primitives with full theme control.
* **TanStack Query** – declarative server-state management & cache.
* **AlphaTab** – advanced guitar pro/tablature rendering (used in the Tutor module).

## Back-end

* **Supabase** – Postgres database, Auth and storage.
* **Edge Functions** – TypeScript functions deployed close to users for low-latency business logic (create-demo-accounts, n8n-agent-bridge, etc.).
* **Row-level security (RLS)** – enforced in database policies.
* **Realtime** – Supabase channels stream sensor data to the client dashboards.

## AI Layer

* **n8n** orchestrates calls to OpenAI / Anthropic and business systems.
* Tasks include anomaly detection, summarisation, proactive alerts and auto-generation of work-orders.

Refer to the other wiki pages for specifics. 