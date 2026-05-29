# Support Request Journey

An accessible web app for browsing local support services and submitting support requests. Built with **Nuxt 3** on the frontend and a **Ruby on Rails API** backed by **PostgreSQL**.

## Features

- Browse and filter support services by category and search
- View service details (eligibility, contact, opening hours, accessibility)
- Create new support services at `/manage/services` (accessible form, client and server validation)
- Submit a support request through an accessible form (client and server validation)
- Light / dark theme toggle (icon-only on small screens, with an accessible name)
- Responsive header with a mobile navigation menu (keyboard and screen-reader friendly)
- Skip link to jump straight to the main content
- Unit tests (Vitest) and end-to-end tests (Playwright), including automated accessibility scans

## Architecture

The browser only talks to the Nuxt app. Nuxt server routes proxy requests to the Rails API.

```
Browser
  → Nuxt (pages, composables)
  → Nuxt server routes (/api/*)
  → Rails API (port 3001)
  → PostgreSQL
```

| Layer | Role |
|-------|------|
| **Nuxt frontend** | UI, composables, client-side validation |
| **Nuxt server routes** | Thin API layer; hides Rails base URL from the browser |
| **Rails API** (`backend/`) | JSON API, models, validations, persistence |
| **PostgreSQL** | Stores services and support requests |

Frontend endpoints (use these from the app, not Rails directly):

- `GET /api/services`
- `GET /api/services/:id`
- `POST /api/services`
- `POST /api/support-requests`

## Tech stack

**Frontend**

- Nuxt 3, Vue 3, TypeScript
- Tailwind CSS

**Backend**

- Ruby on Rails 8 (API mode)
- PostgreSQL
- Puma

## Prerequisites

- **Node.js** 18+ and npm
- **Ruby** 4.0+ (see `backend/.ruby-version`)
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

Health check: [http://localhost:3001/up](http://localhost:3001/up) (green page = OK)

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

Copy `.env.example` to `.env` to override locally.

## Rails API (reference)

Base URL in development: `http://localhost:3001/api`

| Method | Path | Description |
|--------|------|-------------|
| GET | `/services` | List all services (ordered by title) |
| GET | `/services/:id` | One service, or 404 |
| POST | `/services` | Create a service (201 + JSON, or 422 with validation errors) |
| POST | `/support_requests` | Create a support request (`status: "new"`, reference e.g. `SR-0001`) |

Example:

```bash
curl http://localhost:3001/api/services

curl -X POST http://localhost:3001/api/services \
  -H "Content-Type: application/json" \
  -d '{
    "service": {
      "title": "Digital skills café for older residents",
      "category": "family",
      "description": "Weekly sessions with volunteer helpers for older adults learning to use smartphones.",
      "eligibility": "Residents aged 60 and over.",
      "contact_email": "digital.cafe@example-council.gov.uk",
      "phone": "020 7946 0958",
      "opening_hours": "Every Wednesday, 1pm to 4pm",
      "accessibility_notes": "Large-print handouts and seated one-to-one support.",
      "online_support": false
    }
  }'
```

## Testing

From the project root:

```bash
npm run test          # unit tests (Vitest)
npm run test:backend  # Rails API tests (Minitest; needs PostgreSQL)
npm run build         # production build
npm run test:e2e      # all Playwright tests (starts Rails + preview)
```

**Backend (Rails + Minitest)**

From the project root:

```bash
npm run test:backend
```

Or from `backend/`:

```bash
bin/rails db:test:prepare test
```

This runs **17 tests** covering:

| Layer | File | What it covers |
|-------|------|----------------|
| Models | `test/models/service_test.rb` | Validations, associations |
| Models | `test/models/support_request_test.rb` | Validations, default status, reference format, consent |
| API | `test/controllers/api/services_controller_test.rb` | `GET /api/services`, `GET /api/services/:id`, `POST /api/services` (201/422/404) |
| API | `test/controllers/api/support_requests_controller_test.rb` | `POST /api/support_requests` (201/422) |

Requires PostgreSQL and the `backend_test` database (created automatically by `db:test:prepare`).

**Frontend e2e (Playwright)**

| File | What it covers |
|------|----------------|
| `tests/e2e/journey.spec.ts` | Full user journey from home to support request success |
| `tests/e2e/manage-services.spec.ts` | Create service flow and validation |
| `tests/e2e/accessibility.spec.ts` | axe-core WCAG scans (18 tests) |
| `tests/e2e/keyboard-navigation.spec.ts` | Skip link and mobile menu keyboard behaviour (3 tests) |

**Tip:** If `npm run dev` is already using port 3000, Playwright may reuse the dev server instead of a production preview and some e2e tests can fail. Stop the dev server first, or run `CI=1 npm run test:e2e` for a clean run.

## Continuous integration

This project uses **GitHub Actions** to run automated checks on every **pull request to `main`** and every **push to `main`**. The workflow lives at [`.github/workflows/ci.yml`](.github/workflows/ci.yml).

### What was added

A single workflow named **CI** with three jobs that mirror how the app runs locally: Nuxt frontend, Rails API, and full-stack browser tests. There is no deployment step, no secrets, and no paid third-party services—only GitHub-hosted runners, PostgreSQL as a service container, and open-source tooling already used in the repo.

### How the jobs fit together

```text
pull_request / push to main
        │
        ├─► frontend (parallel)
        │     npm ci → unit tests → production build
        │
        ├─► backend (parallel)
        │     Ruby + PostgreSQL → db:test:prepare → Minitest
        │
        └─► e2e (after frontend + backend pass)
              npm ci + Ruby + PostgreSQL + Playwright (Chromium)
              → npm run test:e2e (Rails + Nuxt preview + browser tests)
```

**Frontend** validates the Nuxt app in isolation:

- Installs dependencies with `npm ci` (Node 22, npm cache enabled).
- Runs `npm run test` (Vitest unit tests).
- Runs `npm run build` (production build must succeed).

**Backend** validates the Rails API against a real database:

- Uses Ruby **4.0.5** from `backend/.ruby-version` via `ruby/setup-ruby` with Bundler cache.
- Starts **PostgreSQL 16** as a GitHub Actions service container.
- Sets `RAILS_ENV=test` and `DATABASE_URL=postgres://postgres:postgres@localhost:5432/support_request_journey_test`.
- Runs `bin/rails db:test:prepare test` (17 Minitest tests for models and API endpoints).

**E2E** validates the full stack in a browser, only if frontend and backend jobs succeed:

- Reuses the same PostgreSQL setup so Rails can persist data during tests.
- Sets `CI=true` and `NUXT_API_BASE=http://localhost:3001/api`.
- Installs **Chromium only** (`npx playwright install --with-deps chromium`) to keep runs fast.
- Runs `npm run test:e2e`, which uses Playwright’s `webServer` config in `playwright.config.ts` to:
  - start Rails on port **3001** (`db:prepare`, seed, then `bin/rails server`);
  - build Nuxt and start **preview** on port **3000**;
  - run all Playwright specs (user journey, manage services, keyboard navigation, and **axe** accessibility scans in `accessibility.spec.ts`).

Accessibility is covered inside `npm run test:e2e`; `npm run test:a11y` is not run separately in CI because it targets the same axe tests and would duplicate work.

### Design choices (useful when explaining the PR)

| Choice | Reason |
|--------|--------|
| Three jobs instead of one monolith | Faster feedback: frontend and backend run in parallel; E2E only runs when both pass. |
| `npm ci` | Reproducible installs from `package-lock.json` on CI runners. |
| PostgreSQL service container | Matches production stack; Rails tests and E2E need a real DB. |
| Playwright `webServer` | Reuses existing local dev flow; no custom shell scripts to start/stop servers in the workflow. |
| Chromium only | Enough for this project; avoids installing Firefox/WebKit on every run. |
| No deployment / secrets | CI scope is **verify**, not **release**—keeps the workflow simple and safe for forks. |
| `playwright.config.ts` PATH on macOS only | Homebrew Ruby paths apply locally on Darwin; Linux CI uses `ruby/setup-ruby` and does not need them. |

The Rails app also has its own workflow under `backend/.github/workflows/ci.yml` (Brakeman, RuboCop, etc.). The root workflow focuses on **integration** with the Nuxt frontend and Playwright suite.

### Run the same checks locally

From the project root:

```bash
npm run test          # unit tests
npm run build         # production build
npm run test:backend  # Rails Minitest (PostgreSQL required)
CI=1 npm run test:e2e # full Playwright suite (clean servers; stop dev on 3000/3001 first)
```

## Accessibility checks

The app uses semantic HTML, visible focus states, accessible forms, error summaries, field-level errors, `aria-describedby`, `aria-invalid` and `aria-live`.

Navigation and layout:

- **Skip link** — first focusable control; moves focus to `#main-content`
- **Desktop nav** — horizontal links in the header from `640px` width up
- **Mobile nav** — hamburger button with `aria-expanded`, `aria-controls`, and `aria-label` (`Open menu` / `Close menu`); menu closes on Escape, route change, or link selection; focus moves to the first link when opened and returns to the toggle when closed; Tab wraps from the last link to the first
- **Theme toggle** — shows icon + text label on desktop; icon-only on mobile with `aria-label` (`Switch to light mode` / `Switch to dark mode`)

Automated tools are helpful, but they do not replace manual testing. Accessibility still needs screen reader checks and human judgement.

### Automated checks

**Nuxt Accessibility (`@nuxt/a11y`)**

During development, start the app with `npm run dev`, open [http://localhost:3000](http://localhost:3000), then open **Nuxt DevTools** and click the **Nuxt a11y** tab. The module scans pages as you navigate and shows axe-core violations in the DevTools panel. It runs in development only and does not fail production builds.

**Playwright + axe**

Run automated accessibility scans against the main routes:

```bash
npm run test:a11y
# or explicitly:
npm run test:a11y:axe
```

This starts Rails and a production preview, then scans these routes with axe-core against WCAG 2.0/2.1 A and AA:

- `/`, `/services`, `/request-support`, `/manage/services`
- **Light and dark mode**
- **Desktop and mobile** (iPhone 13 viewport)
- **Mobile menu open** on the home page

That is **18 axe tests** in `tests/e2e/accessibility.spec.ts`.

**Keyboard navigation (Playwright)**

Automated keyboard checks for the skip link and mobile menu:

```bash
npx playwright test tests/e2e/keyboard-navigation.spec.ts
```

These run as part of `npm run test:e2e` as well.

**Pa11y**

Run command-line WCAG 2.0 AA checks against a **running local app** (start `npm run dev` or `npm run preview` first):

```bash
npm run test:a11y:pa11y
```

Pa11y reads URLs from `.pa11yci` (localhost only) and prints results in the terminal. This is a local/CI check — it does not affect production deploys. To scan a deployed site you would change the URLs in `.pa11yci` manually; only `NUXT_API_BASE` needs to change for a normal deploy.

### Manual review tools

These are useful alongside automated checks:

- **axe DevTools** — browser extension for quick manual scans and element inspection
- **Lighthouse** — built into Chrome DevTools for a fast accessibility audit
- **WAVE** — browser extension for visual review of contrast, headings, labels and structure
- **Accessibility Insights** — guided manual checks (keyboard, focus order, contrast)
- **Browser DevTools accessibility tree** — inspect accessible names, roles and how the page structure is exposed
- **Storybook accessibility addon** — useful for projects that use Storybook (this project does not use Storybook)

### Manual checklist

- Navigate the whole app using only the keyboard.
- Check focus is always visible.
- Check heading order.
- Check labels on all form controls.
- Check the error summary links to invalid fields.
- Check field-level errors are announced correctly.
- Check success messages use `aria-live`.
- Check errors and success states do not rely only on colour.
- Check colour contrast in light and dark mode.
- Check the support request form on mobile width.
- Check the manage services form on mobile width.
- Open and close the mobile menu with keyboard only (Space/Enter, Escape, Tab wrap).
- Check the theme toggle with keyboard and that it has a clear accessible name on mobile.
- Use the skip link and confirm focus lands on the main content.

## Project structure

```
├── backend/              # Rails API
│   ├── app/models/       # Service, SupportRequest
│   ├── app/controllers/api/
│   ├── test/             # Minitest (models + API)
│   ├── db/migrate/       # PostgreSQL schema
│   └── db/seeds.rb       # Sample services
├── components/           # Vue UI components
├── composables/          # useServices, useServiceManagement, useSupportRequest, etc.
├── pages/                # Routes (services, manage/services, request-support)
├── server/api/           # Nuxt proxy routes
├── tests/e2e/            # Playwright (journey, manage-services, accessibility, keyboard)
└── utils/                # Validation, API mappers
```

For a full backend walkthrough and copy-paste test commands, see the guides in `docs/` (`backend-guide.md`, `testing-cookbook.md`).
