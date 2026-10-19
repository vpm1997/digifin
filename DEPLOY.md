# Deployment Guide

DigiFinSaviour can be deployed three ways. Pick based on whether you need the
AI-backed API:

| Target | Frontend | API | Claude | Best for |
| --- | --- | --- | --- | --- |
| [Vercel](#option-a--vercel-full-app) | ✅ | ✅ | ✅ | Full product, previews, custom domain |
| [GitHub Pages](#option-b--github-pages-static-demo) | ✅ | ❌ | ❌ | Free public demo (runs in-browser) |
| [Node host](#option-c--single-node-service) | ✅ | ✅ | ✅ | Render / Railway / Fly / VPS |

> **TL;DR:** Vercel for the real thing. GitHub Pages if you only need the UI and
> a local audit demo.

---

## Prerequisites

- Node.js **20+** (repo includes `.nvmrc`)
- The repo pushed to GitHub
- `npm install` works locally
- Optional: an Anthropic API key (`ANTHROPIC_API_KEY`)

Quick local sanity check before deploying:

```bash
npm ci
npm run build
npm run dev:all      # http://localhost:5173
```

In the UI: **Demo → Live audit → Use sample statement**. You should see 5
findings and ₹2,588 recoverable.

---

## Option A — Vercel (full app)

Vercel serves the Vite build from its CDN and runs each `api/*.js` file as a
serverless Node function.

### A1. Deploy from the dashboard

1. Go to [vercel.com/new](https://vercel.com/new) and import the GitHub repo.
2. Configure:
   - **Framework preset:** Vite (auto-detected)
   - **Build command:** `npm run build`
   - **Output directory:** `dist`
   - **Install command:** `npm install`
   - **Root directory:** `./`
3. Add environment variables (Project → Settings → Environment Variables):

   | Name | Value | Environments | Required |
   | --- | --- | --- | --- |
   | `ANTHROPIC_API_KEY` | `sk-ant-...` | Production, Preview | No |
   | `CLAUDE_MODEL` | `claude-sonnet-4-5` | Production, Preview | No |
   | `CORS_ORIGIN` | `https://your-frontend.example` | Production | Only if a separate frontend calls the API |

   Do **not** prefix the Anthropic key with `VITE_` — that would bake it into the
   public JS bundle.
4. Click **Deploy**. The first build takes ~1 minute.
5. Your app is at `https://<project>.vercel.app`.

`vercel.json` is already configured:

```json
{ "rewrites": [{ "source": "/((?!api/).*)", "destination": "/index.html" }] }
```

This gives SPA deep-link support while leaving `/api/*` alone.

### A2. Deploy with the CLI (alternative)

```bash
npx vercel           # preview deployment
npx vercel --prod    # production deployment
npx vercel dev       # emulate Vercel functions locally
```

The CLI prompts for project linking on first run. Environment variables still go
through the dashboard (or `vercel env add`).

### A3. Verify the deployment

```bash
# UI
curl -I https://<project>.vercel.app

# API + AI status
curl https://<project>.vercel.app/api/health
# → {"ok":true,"ai":true,"model":"claude-sonnet-4-5"}

# Audit with the bundled sample
curl -s https://<project>.vercel.app/samples/sample-statement.csv > /tmp/s.csv
curl -s -X POST https://<project>.vercel.app/api/audit \
  -H 'Content-Type: application/json' \
  --data "$(node -e "console.log(JSON.stringify({filename:'s.csv',text:require('fs').readFileSync('/tmp/s.csv','utf8')}))")"
```

`ai` is `false` without a key — that's expected: the rule engine still works.

### A4. Custom domain

Project → Settings → Domains → add your domain and point DNS at Vercel as
instructed. Update `CORS_ORIGIN` if other origins call the API.

### A5. Vercel notes & limits

- **Cold starts** add ~100–500 ms to API calls after idle periods.
- **Functions are stateless** — nothing is persisted. Add a database before
  building audit history.
- **Claude latency**: allow enough function duration. Our default is the plan
  default; you can raise it in `vercel.json` if your plan supports it:

  ```json
  {
    "rewrites": [{ "source": "/((?!api/).*)", "destination": "/index.html" }],
    "functions": { "api/*.js": { "maxDuration": 30 } }
  }
  ```

- **Request size**: the API caps statement text at **1 MB** (`server/audit.js`).
- **Logs**: Project → Deployments → Functions → select a request.
- **Rollbacks**: Deployments → choose a previous build → Promote to Production.

### A6. Split frontend + API (optional)

You can host the UI on Pages and the API on Vercel:

```bash
VITE_OFFLINE_AUDIT= \
VITE_API_BASE_URL=https://<project>.vercel.app \
VITE_BASE_PATH=/<repo>/ \
npm run build
```

Set `CORS_ORIGIN=https://<user>.github.io` in Vercel. The API already sends
`Access-Control-Allow-*` headers (`server/cors.js`).

---

## Option B — GitHub Pages (static demo)

GitHub Pages cannot run Express or serverless functions. In this mode the same
audit engine (`shared/auditCore.js`) runs **in the browser**; nothing is uploaded
and Claude is unavailable.

### B1. Enable Pages

1. Push the repo to GitHub `main`.
2. Repo → **Settings → Pages → Build and deployment → Source: GitHub Actions**.
3. The included workflow runs on every push to `main` (or manually via
   **Actions → Deploy to GitHub Pages → Run workflow**).
4. Site URL: `https://<user>.github.io/<repo>/` — or your custom domain.

Workflow: `.github/workflows/deploy-pages.yml`

```yaml
- run: npm ci
- run: npm run build
  env:
    VITE_BASE_PATH: /${{ github.event.repository.name }}/
    VITE_OFFLINE_AUDIT: 'true'
```

### B2. Local reproduction

```bash
VITE_BASE_PATH=/<repo>/ VITE_OFFLINE_AUDIT=true npm run build
npm run preview
```

Open the preview URL under `/<repo>/`.

### B3. Important details

- **Base path must match the repo name, with leading and trailing slash**
  (`/digifin/`). A mismatch = blank page or 404 assets.
- **Custom domain (CNAME):** the workflow detects a root `CNAME` file and uses
  `VITE_BASE_PATH=/` automatically. A copy lives at `public/CNAME` so the custom
  domain is included in the deployed artifact.
- **User/org site** (`<user>.github.io`): change `VITE_BASE_PATH` to `/` in the
  workflow.
- **Sample statement** is fetched from `${BASE_URL}samples/sample-statement.csv`;
  it is copied from `public/` into `dist/` automatically.
- **API not used** in this mode. If you want a remote API instead, build with:

  ```bash
  VITE_OFFLINE_AUDIT= \
  VITE_API_BASE_URL=https://<project>.vercel.app \
  VITE_BASE_PATH=/<repo>/ \
  npm run build
  ```

  …and set `CORS_ORIGIN` on the API host.

---

## Option C — Single Node service

Render, Railway, Fly.io, or any VPS. In production the Express server serves both
`dist/` and `/api/*`.

### C1. Settings

| Setting | Value |
| --- | --- |
| Build command | `npm ci && npm run build` |
| Start command | `NODE_ENV=production npm start` |
| Health check path | `/api/health` |
| Node version | 20+ |

### C2. Environment variables

| Name | Value |
| --- | --- |
| `NODE_ENV` | `production` |
| `PORT` | Injected by most hosts; defaults to `8787` |
| `ANTHROPIC_API_KEY` | `sk-ant-...` (optional) |
| `CLAUDE_MODEL` | `claude-sonnet-4-5` (optional) |
| `CORS_ORIGIN` | Only needed if another origin calls the API |

### C3. Behavior

- `server/index.js` loads `.env` via `dotenv`.
- If `dist/` exists and `NODE_ENV=production`, it serves the SPA and falls back
  to `index.html` for unknown non-API routes.
- Unknown `/api/*` paths return JSON `404`.
- Manual equivalent:

  ```bash
  npm ci
  npm run build
  NODE_ENV=production PORT=8080 npm start
  ```

---

## Environment variables reference

### Runtime (server / Vercel functions)

| Variable | Default | Effect |
| --- | --- | --- |
| `ANTHROPIC_API_KEY` | unset | Enables Claude audits and letters. Unset → rule engine + templates |
| `CLAUDE_MODEL` | `claude-sonnet-4-5` | Model used for both endpoints |
| `CORS_ORIGIN` | `*` | Comma-separated allowlist for browser origins |
| `PORT` | `8787` | Express port (Node hosts only) |

### Build-time (Vite)

| Variable | Default | Effect |
| --- | --- | --- |
| `VITE_BASE_PATH` | `/` | Public path, e.g. `/<repo>/` for Pages |
| `VITE_OFFLINE_AUDIT` | unset | `true` → audit runs in the browser |
| `VITE_API_BASE_URL` | `''` | Absolute API base, e.g. `https://api.example.com` |

`VITE_*` values are embedded in the client bundle. **Never put secrets there.**

### `.env` locally

```bash
cp .env.example .env
```

- Vite loads `.env` automatically for `VITE_*` values.
- The Express server loads `.env` through `dotenv`.
- Vercel/GitHub Actions do **not** read `.env`; set variables in their dashboards.

---

## Post-deploy checklist

- [ ] `/api/health` returns `{ "ok": true }`
- [ ] `ai` is `true` if a key is configured
- [ ] Uploading `public/samples/sample-statement.csv` returns 5 findings
- [ ] "Draft dispute" opens a letter
- [ ] Copy and Download work
- [ ] Anchor links (`/#demo`, `/#features`) work
- [ ] (Vercel/Node) a random path such as `/anything` loads the app (SPA fallback)
- [ ] Mobile layout at ~375 px
- [ ] No secret values visible in the built JS (`grep -r "sk-ant" dist/` → none)
- [ ] CORS works if frontend and API are on different origins

---

## Troubleshooting

| Symptom | Likely cause | Fix |
| --- | --- | --- |
| **Blank page on GitHub Pages** | Wrong base path | Set `VITE_BASE_PATH=/<repo>/` (both slashes) and rebuild |
| Assets 404 on Pages | Same base path mismatch | Inspect `dist/index.html`; asset URLs must start with `/repo/` |
| Sample fetch 404 on Pages | Same base path mismatch | Verify `/repo/samples/sample-statement.csv` |
| **"Could not reach the audit API"** | API not running / wrong URL / wrong mode | Local: `npm run dev:all`. Pages: build with `VITE_OFFLINE_AUDIT=true`. Split hosting: set `VITE_API_BASE_URL` |
| Demo works but says **Rule engine** | No key or key not applied | Set `ANTHROPIC_API_KEY`, redeploy, check `/api/health` shows `ai: true` |
| **CORS error** in console | Origin not allowlisted | Set `CORS_ORIGIN` to the exact origin (scheme + host, no trailing slash), redeploy |
| Vercel 404 on refresh | Missing SPA rewrite | Keep `vercel.json`; confirm output dir is `dist` |
| **`FUNCTION_INVOCATION_FAILED`** | Missing env/dependency, timeout | Check function logs; ensure `npm install` includes `@anthropic-ai/sdk`, `express`, `dotenv` |
| Claude calls time out | Function duration too low | Raise `functions.maxDuration` in `vercel.json` (plan-dependent); rule fallback still returns a result |
| `413` on upload | File > 1 MB | Split/trim the statement; limit is enforced in `server/audit.js` and the UI |
| `422 No transactions found` | Header/columns not recognized | Use `date, description, amount` or `date, narration, debit, credit` |
| `.env` ignored locally | File missing or server not restarted | Create `.env` in repo root; restart `npm run dev:all` |
| Build fails on host | Node version < 20 | Set Node 20+ (`.nvmrc` provided) |

---

## Security notes

- `ANTHROPIC_API_KEY` stays server-side. Never expose it as `VITE_*`.
- The API has **no authentication or rate limiting**. Add both before accepting
  real users' statements, or gate it behind a proxy/API key.
- Statements are parsed in memory and not persisted; they are only sent to
  Claude when `ANTHROPIC_API_KEY` is configured.
- Add request logging/audit trails consciously — statements contain sensitive
  financial data.
- Keep dependencies patched: `npm audit`, Dependabot, and regular updates.

---

## Updating a deployment

All three targets deploy from Git:

```bash
git add -A
git commit -m "Update"
git push
```

- **Vercel:** auto-deploys; rollback from the dashboard if needed.
- **GitHub Pages:** workflow redeploys on push to `main`.
- **Node host:** redeploys per host settings (usually on push).

If you only changed environment variables, trigger a redeploy so functions pick
them up.
