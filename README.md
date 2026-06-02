# Support Request Journey

An accessible web app for browsing local support services and submitting support requests. Built with **Nuxt 3** on the frontend and a **Ruby on Rails API** backed by **PostgreSQL**.

**Learning / portfolio project** — focused on accessible forms, frontend–backend integration, and accessibility testing. Not production-ready (no authentication, email, or CMS).

**Live app:** [support-request-journey.vercel.app](https://support-request-journey.vercel.app)

## Features

- Browse, search, and filter support services (with pagination on long lists)
- View service details (eligibility, contact, opening hours, accessibility notes)
- Submit a support request through an accessible form (client and server validation, reference number from the API)
- Manage services at `/manage/services` — create, edit, and delete with validation and an accessible delete confirmation dialog
- Light / dark theme toggle (icon-only on small screens, with an accessible name)
- Responsive header with a mobile navigation menu (keyboard and screen-reader friendly)
- Skip link to jump straight to the main content
- Unit tests (Vitest), end-to-end tests (Playwright), and automated accessibility scans (axe)

## Architecture

The browser only talks to the Nuxt app. Nuxt server routes proxy requests to the Rails API using private server-side config (see [Environment variables](#environment-variables)).

**Local development:**

```
Browser
  → Nuxt (localhost:3000)
  → Nuxt server routes (/api/*)
  → Rails API (localhost:3001)
  → PostgreSQL
```

**Production:**

```
Browser
  → Nuxt on Vercel
  → Nuxt server routes (/api/*)
  → Rails API on Render
  → PostgreSQL on Render
```

| Layer | Role |
|-------|------|
| **Nuxt frontend** | UI, composables, client-side validation |
| **Nuxt server routes** | Thin API layer; hides Rails base URL from the browser |
| **Rails API** (`backend/`) | JSON API, models, validations, persistence |
| **PostgreSQL** | Stores services and support requests |

**Frontend API** (same origin as the app — use these from the UI, not the Rails host directly):

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/services` | List services |
| GET | `/api/services/:id` | One service |
| POST | `/api/services` | Create a service |
| PATCH | `/api/services/:id` | Update a service |
| DELETE | `/api/services/:id` | Delete a service |
| POST | `/api/support-requests` | Create a support request |

Rails routes, request bodies, and curl examples: [`backend/README.md`](./backend/README.md).

## Tech stack

**Frontend**

- Nuxt 3, Vue 3, TypeScript
- Tailwind CSS
- `@nuxt/a11y` (development-time accessibility feedback in Nuxt DevTools)

**Backend**

- Ruby on Rails 8 (API mode)
- PostgreSQL
- Puma

## Prerequisites

- **Node.js** 18+ and npm
- **Ruby** 3.4+ (see `backend/.ruby-version`; Ruby 4.0+ works locally on macOS)
- **PostgreSQL** 16+

On macOS with Homebrew:

```bash
brew install ruby postgresql@16
brew services start postgresql@16
```

Use Homebrew Ruby in your terminal (macOS system Ruby is too old for Rails 8):

```bash
export PATH="/opt/homebrew/opt/ruby/bin:/opt/homebrew/lib/ruby/gems/4.0.0/bin:/opt/homebrew/opt/postgresql@16/bin:$PATH"
```

## Getting started

### 1. Backend (Rails + database)

```bash
cd backend
bundle install
bin/rails db:create db:migrate db:seed
bin/rails server -p 3001
```

Or from the project root: `npm run dev:backend`

Health check: [http://localhost:3001/up](http://localhost:3001/up) (green page = OK)

**Seeds:** 30 sample services across five categories. Running `db:seed` replaces the service catalogue and clears existing support requests (for a clean local dataset).

### 2. Frontend (Nuxt)

In a second terminal, from the project root:

```bash
npm install
cp .env.example .env   # optional; defaults work for local dev
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### Environment variables

| Variable | Default | Description |
|----------|---------|-------------|
| `NUXT_API_BASE` | `http://localhost:3001/api` | Rails API base URL (server-only, not exposed to the browser) |

Copy `.env.example` to `.env` to override locally. In production (Vercel), set `NUXT_API_BASE` to your deployed Rails API URL including the `/api` suffix.

## Production

| Service | Role | Open in browser |
|---------|------|-----------------|
| **Frontend (Nuxt)** | The web app users visit | [support-request-journey.vercel.app](https://support-request-journey.vercel.app) |
| **Backend (Rails API)** | JSON API only (no HTML home page) | Health: […/up](https://support-request-journey.onrender.com/up) · Data: […/api/services](https://support-request-journey.onrender.com/api/services) |

The root URL `https://support-request-journey.onrender.com/` returns **404** on purpose — Rails only serves `/up` and `/api/*`. That is normal; use **Vercel** for the app.

The Vercel frontend calls the Render API through Nuxt server routes. Set `NUXT_API_BASE=https://support-request-journey.onrender.com/api` in Vercel project settings and redeploy after changing it.

If the live services list is empty after deploy, the frontend API URL is usually missing or incorrect.

Backend deployment uses `backend/` as the Render root directory. See [`backend/README.md`](./backend/README.md) for API reference and Render settings.

## Testing

From the project root:

| Command | What it runs |
|---------|----------------|
| `npm run test` | Vitest unit tests |
| `npm run test:backend` | Rails Minitest (needs PostgreSQL) |
| `npm run test:e2e` | Playwright **e2e** project — user journeys, manage CRUD, keyboard tests |
| `npm run test:a11y` | Playwright **a11y** project — axe WCAG scans |
| `npm run test:all` | Both Playwright projects |
| `npm run build` | Production build |

**Backend (Rails + Minitest)** — 23 tests (models, services API including PATCH/DELETE, support requests). From `backend/`: `bin/rails db:test:prepare test`, or `npm run test:backend` from the root.

**Playwright e2e project** — full support-request journey; create, update, and delete services; keyboard navigation (skip link, mobile menu, validation focus, delete dialog, theme toggle).

**Playwright a11y project** — 19 axe-core scans (WCAG 2.0/2.1 A and AA): main routes, light/dark, desktop/mobile, mobile menu open on home and services, service detail, edit service, error pages, validation states, delete dialog open.

**Tip:** If `npm run dev` is already using port 3000, Playwright may reuse the dev server and some e2e tests can fail. Stop the dev server first, or run `CI=1 npm run test:e2e` for a clean run.

## Continuous integration

[GitHub Actions](.github/workflows/ci.yml) runs on pull requests and pushes to `main`:

- **Frontend** — Vitest unit tests and production build
- **Backend** — Rails tests with PostgreSQL
- **Playwright** — `npm run test:all` (e2e flows, keyboard tests, and axe accessibility scans)

Run only one Playwright project locally: `npm run test:e2e` or `npm run test:a11y`.

## Accessibility

The app follows accessibility best practices: semantic HTML, visible focus states, accessible forms (error summary, field-level errors, `aria-describedby`, `aria-invalid`, `aria-live`), keyboard-friendly navigation and dialogs. Automated tools help but do **not** prove full WCAG compliance — manual keyboard and screen reader checks are still needed.

### During development (live feedback)

**Nuxt Accessibility (`@nuxt/a11y`)** — with `npm run dev`, open [http://localhost:3000](http://localhost:3000), then **Nuxt DevTools → Nuxt a11y**. The module scans pages as you navigate and shows axe-core issues in the panel. This is a **dev-only** helper: it is disabled in production builds and it does **not** run in GitHub Actions.

### Automated checks (local and CI)

**Playwright + axe** (`npm run test:a11y`) — the same axe engine, run as tests against a production preview. These scans **do** run in CI as part of `npm run test:all` (see [Continuous integration](#continuous-integration)). They are separate from the `@nuxt/a11y` DevTools tab.

```bash
npm run test:a11y      # Playwright + axe only (19 scans)
npm run test:e2e       # user flows + 6 keyboard tests
npm run test:all       # both Playwright projects (what CI runs)
npm run test:a11y:pa11y   # optional Pa11y smoke on 5 local URLs (app must be running)
```

Axe coverage includes `/`, `/services`, `/request-support`, `/manage/services`, service detail, edit service, 404 and service-not-found pages, validation error states, delete dialog open, light/dark, desktop/mobile, and mobile menu open on home and services.

### Manual review

- Navigate with keyboard only; check focus is visible
- Check heading order and form labels
- Check error summary links and success announcements
- Test mobile menu and theme toggle with keyboard
- Use browser DevTools accessibility tree, Lighthouse, WAVE, or Accessibility Insights as needed

## Project structure

```
├── backend/              # Rails API (see backend/README.md)
├── components/           # Vue UI components
├── composables/          # useServices, useServiceManagement, useSupportRequest, etc.
├── pages/                # Routes (services, manage/services, request-support)
├── server/api/           # Nuxt proxy routes
├── tests/e2e/            # Playwright (journey, manage-services, accessibility, keyboard)
└── utils/                # Validation, API mappers
```

See [`backend/README.md`](./backend/README.md) for models, Rails routes, curl examples, and Render deployment.
