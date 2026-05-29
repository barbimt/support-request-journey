# Support Request Journey

An accessible web app for browsing local support services and submitting support requests. Built with **Nuxt 3** on the frontend and a **Ruby on Rails API** backed by **PostgreSQL**.

## Features

- Browse and filter support services by category and search
- View service details (eligibility, contact, opening hours, accessibility)
- Create new support services at `/manage/services` (accessible form, client and server validation)
- Submit a support request through an accessible form (client and server validation)
- Light / dark theme toggle
- Unit tests (Vitest) and end-to-end tests (Playwright)

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

From the project root (Rails should be running for e2e):

```bash
npm run test          # unit tests
npm run build         # production build
npm run test:e2e      # Playwright (starts Rails + preview)
```

## Project structure

```
├── backend/              # Rails API
│   ├── app/models/       # Service, SupportRequest
│   ├── app/controllers/api/
│   ├── db/migrate/       # PostgreSQL schema
│   └── db/seeds.rb       # Sample services
├── components/           # Vue UI components
├── composables/          # useServices, useServiceManagement, useSupportRequest, etc.
├── pages/                # Routes (services, manage/services, request-support)
├── server/api/           # Nuxt proxy routes
└── utils/                # Validation, API mappers
```

For a full backend walkthrough and copy-paste test commands, see the guides in `docs/` (`backend-guide.md`, `testing-cookbook.md`).
