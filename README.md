# DigiFinSaviour

The AI-powered advocate fighting for consumer fairness in banking. DigiFinSaviour
audits bank statements, catches hidden fees and credit-bureau errors, and
auto-drafts dispute letters.

The landing page includes a **working audit demo**: upload (or load the sample)
statement, get findings, then generate a dispute letter.

## Stack

- React 18 + Vite 6, Tailwind CSS 3, lucide-react
- Express API + Vercel serverless handlers (`api/`)
- Anthropic Claude via `@anthropic-ai/sdk` (optional — rule engine works without a key)

## Quick start

```bash
npm install
npm run dev:all     # web on :5173, API on :8787
```

Open http://localhost:5173 and use **Demo → Live audit → Use sample statement**.

`npm run dev` alone runs only Vite; the demo will show a friendly "API not
reachable" message unless the API is also running.

### With Claude

```bash
cp .env.example .env
# add ANTHROPIC_API_KEY=sk-ant-...
npm run dev:all
```

Without a key the deterministic rule engine and letter templates are used, so
the demo is fully functional either way. The API reports which engine was used.

## Scripts

| Script | What it does |
| --- | --- |
| `npm run dev` | Vite dev server (proxies `/api` → `:8787`) |
| `npm run dev:api` | Express API with watch mode |
| `npm run dev:all` | Both, with prefixed logs |
| `npm run build` | Production build → `dist/` |
| `npm run preview` | Preview the production build |
| `npm start` | API server; serves `dist/` when `NODE_ENV=production` |

## Statement format

CSV or TXT, up to 1 MB. Header row required. Supported columns:

```csv
date,description,amount
2026-07-05,Maintenance charges,-499
2026-07-15,Interest charged,-1240
```

or separate debit/credit columns:

```csv
Date,Narration,Debit,Credit
05/07/2026,Processing Fee,450,0
06/07/2026,Salary,0,85000
```

- Debits are negative in `amount` mode; debit/credit mode handles signs for you.
- Dates accept `YYYY-MM-DD`, `DD/MM/YYYY`, `DD-MM-YYYY` and most parseable strings.
- A ready-made sample lives at `public/samples/sample-statement.csv`.

## API

### `GET /api/health`

```json
{ "ok": true, "ai": false, "model": "claude-sonnet-4-5" }
```

### `POST /api/audit`

Request:

```json
{ "filename": "statement.csv", "text": "date,description,amount\n...", "holderName": "Ananya R." }
```

Response (trimmed):

```json
{
  "source": "rules",
  "filename": "statement.csv",
  "summary": {
    "transactionsScanned": 13,
    "findingCount": 5,
    "highSeverityCount": 2,
    "potentialRecovery": 2588,
    "score": 70,
    "period": { "from": "2026-07-02", "to": "2026-07-30" }
  },
  "findings": [
    {
      "id": "f_1",
      "category": "interest",
      "title": "Interest charged",
      "amount": 1240,
      "severity": "high",
      "confidence": 0.86,
      "date": "2026-07-15",
      "occurrences": 1,
      "reason": "Interest may have been computed on an amount that already included fees.",
      "citation": "RBI Fair Practices Code / loan agreement"
    }
  ]
}
```

Categories: `interest`, `penalty`, `maintenance_fee`, `processing_fee`,
`other_fee`, `duplicate`. `source` is `claude` or `rules`.

### `POST /api/dispute`

Request:

```json
{
  "finding": { "title": "Interest charged", "amount": 1240, "date": "2026-07-15", "category": "interest", "reason": "..." },
  "account": "••••4821",
  "holderName": "Ananya R.",
  "bank": "HDFC Bank"
}
```

Response: `{ "source": "template" | "claude", "letter": "..." }`.

Errors return `{ "error": "message" }` with a `4xx`/`5xx` status.

## Project structure

```
api/                     Vercel serverless functions
  audit.js
  dispute.js
  health.js
server/                  API logic + local Express server
  audit.js               Claude audit (uses shared engine)
  dispute.js             Claude letter drafting
  cors.js                CORS helper for Express + Vercel
  index.js               Express server (:8787)
shared/                  Pure, environment-agnostic logic
  auditCore.js           CSV parser, rule engine, scoring (browser + Node)
  disputeTemplate.js     Letter template (browser + Node)
src/
  main.jsx               Entry point + ErrorBoundary
  App.jsx                Page composition
  components/            Header, Hero, DashboardMock, Features, HowItWorks,
                         Demo, AuditDemo, Stories, CTA, Footer, ...
public/
  samples/sample-statement.csv
  favicon.svg
.github/
  workflows/deploy-pages.yml
```

## Hosting options

> Step-by-step instructions, environment variables and troubleshooting live in
> **[DEPLOY.md](./DEPLOY.md)**.

| Host | Frontend | API / Claude | Notes |
| --- | --- | --- | --- |
| **Vercel** | ✅ | ✅ | Recommended — full functionality |
| **GitHub Pages** | ✅ | ❌ (browser engine instead) | Static only; demo still works |
| **Render / Railway / Fly** | ✅ | ✅ | Single Node service |
| **Netlify / Cloudflare Pages** | ✅ | ❌ (unless functions added) | Use in-browser mode |

### GitHub Pages (static, in-browser audit)

GitHub Pages cannot run the Express server or the `api/` functions. The app
therefore supports a fully client-side mode that reuses the same audit engine in
the browser (`shared/auditCore.js`). In this mode:

- statement upload, findings, scoring and dispute letters work
- nothing is uploaded anywhere — all parsing happens locally
- Claude is **not** used (no secret key can be shipped to a browser)

A ready-made workflow is included at `.github/workflows/deploy-pages.yml`.

1. Commit and push to `main`.
2. In the repo: **Settings → Pages → Build and deployment → Source: GitHub Actions**.
3. The workflow builds with:
   - `VITE_BASE_PATH=/<repo-name>/`
   - `VITE_OFFLINE_AUDIT=true`
4. Site URL: `https://<user>.github.io/<repo-name>/`.

Local equivalent:

```bash
VITE_BASE_PATH=/digifin/ VITE_OFFLINE_AUDIT=true npm run build
npm run preview
```

Notes:

- The workflow derives the base path from the repository name. For a user/org
  site (`<user>.github.io`) change `VITE_BASE_PATH` to `/`.
- If you prefer to use a separately hosted API instead of browser mode, build
  with `VITE_OFFLINE_AUDIT=` (empty) and `VITE_API_BASE_URL=https://your-api.example.com`.
  The API sends CORS headers; set `CORS_ORIGIN=https://<user>.github.io` on the
  API host.

### Vercel (full functionality)

1. Push the repo and import it into Vercel.
2. Framework preset: **Vite**; build `npm run build`; output `dist`.
3. Add environment variables: `ANTHROPIC_API_KEY` (optional), `CLAUDE_MODEL`,
   and `CORS_ORIGIN` if a separate frontend origin will call the API.
4. `api/*.js` are auto-detected as Node functions; `vercel.json` rewrites
   non-API routes to the SPA.

### Single Node service (Render / Railway / Fly)

```bash
npm ci
npm run build
NODE_ENV=production npm start
```

The Express server serves `dist/` and the API on `PORT`.

## Notes & limitations

- GitHub Pages deployments use the in-browser engine (no Claude).
- PDF parsing is not implemented yet; CSV/TXT only.
- Statements are parsed in memory and are not persisted or logged.
- AI findings are advisory. Users should verify against their signed MITC before
  escalating.
- Statement text is sent to Claude only when `ANTHROPIC_API_KEY` is configured.
- No authentication or rate limiting yet — add both before handling real users'
  statements.

## Next steps

- PDF/OCR ingestion and password-protected statements
- Accounts + saved audit history
- Auth, rate limiting, and audit logging
- Bank Account Aggregator integration
- Automated email/fax dispatch to banks and the Ombudsman
