# Support Request Journey — Rails API

JSON API for the [Support Request Journey](../README.md) app.

This API provides the data layer for the Nuxt app. It stores support services and support requests, validates submitted data, and returns JSON responses used by the frontend forms.

**Focused learning project** — see the root README for the full app and frontend.

The browser never calls this API directly. **Nuxt** server routes proxy requests using `NUXT_API_BASE` (default `http://localhost:3001/api`).

**Production API base:** `https://support-request-journey.onrender.com/api`

The production API is not a public website. The root path `/` may return 404. Use [`/up`](https://support-request-journey.onrender.com/up) for the health check or [`/api/services`](https://support-request-journey.onrender.com/api/services) to verify API data.

## What this API demonstrates

- A small Rails API in API mode
- PostgreSQL persistence for services and support requests
- REST-style endpoints for listing, creating, updating and deleting services
- Backend validation for user-submitted data
- JSON error responses for frontend form handling
- A health check endpoint for deployment
- Render deployment with PostgreSQL

## Stack

- **Ruby** 3.4.4 (see `.ruby-version`)
- **Rails** 8.1 (API mode)
- **PostgreSQL** 16+
- **Puma**

## Prerequisites

- Ruby 3.4.4 and Bundler
- PostgreSQL 16+ running locally

For full stack setup (Node, PATH, Homebrew), see the [root README](../README.md#prerequisites).

## Getting started

From this directory (`backend/`):

```bash
bundle install
bin/rails db:create db:migrate db:seed
bin/rails server -p 3001
```

Health check: [http://localhost:3001/up](http://localhost:3001/up) — a green page means Rails booted correctly.

**Seeds:** `db:seed` loads 30 sample services (five categories). It **deletes all existing services and support requests** first — only run when you want a clean catalogue.

Start the Nuxt frontend from the project root in a second terminal (`npm run dev` on port 3000), or run `npm run dev:backend` from the root for Rails only.

## API

Base URL in development: `http://localhost:3001/api`

Base URL in production: `https://support-request-journey.onrender.com/api`

| Method | Path | Description |
|--------|------|-------------|
| GET | `/services` | List all services (ordered by title) |
| GET | `/services/:id` | One service, or `404` with `{ "message": "Service not found" }` |
| POST | `/services` | Create a service — `201` + JSON, or `422` with validation errors |
| PATCH | `/services/:id` | Update a service — `200` + JSON, `404`, or `422` with validation errors |
| DELETE | `/services/:id` | Delete a service — `204 No Content`, `404`, or `422` if deletion fails |
| POST | `/support_requests` | Create a support request — `201` with reference (e.g. `SR-0001`), or `422` |

Health check (no `/api` prefix): `GET /up`

### Examples

List services:

```bash
curl http://localhost:3001/api/services
```

Create a service:

```bash
curl -i -X POST http://localhost:3001/api/services \
  -H "Content-Type: application/json" \
  -d '{
    "service": {
      "title": "Community wellbeing drop-in",
      "category": "mental-health",
      "description": "Weekly drop-in sessions with trained wellbeing advisors."
    }
  }'
```

Update a service:

```bash
curl -i -X PATCH http://localhost:3001/api/services/1 \
  -H "Content-Type: application/json" \
  -d '{
    "service": {
      "title": "Updated housing advice",
      "category": "housing",
      "description": "Free guidance on renting and housing rights."
    }
  }'
```

Delete a service:

```bash
curl -i -X DELETE http://localhost:3001/api/services/1
```

Create a support request:

```bash
curl -i -X POST http://localhost:3001/api/support_requests \
  -H "Content-Type: application/json" \
  -d '{
    "support_request": {
      "full_name": "Jordan Lee",
      "email": "jordan@example.com",
      "requester_type": "myself",
      "support_type": "family",
      "preferred_contact_method": "email",
      "message": "We would like information about local family support groups.",
      "consent": true
    }
  }'
```

Validation errors use this shape:

```json
{
  "message": "There are validation errors.",
  "errors": { "title": ["can't be blank"] }
}
```

Missing or malformed JSON bodies (for example, a PATCH without a `service` wrapper) return `400` with `{ "message": "..." }`.

Deleting a service nullifies linked `support_requests.service_id` rather than deleting those requests.

## Models

### `Service`

| Field | Required | Notes |
|-------|----------|-------|
| `title` | yes | |
| `category` | yes | e.g. `housing`, `family`, `mental-health`, `send`, `care-leavers` |
| `description` | yes | |
| `eligibility`, `contact_email`, `phone`, `opening_hours`, `accessibility_notes` | no | |
| `online_support` | no | boolean |

Has many `support_requests` (nullified if the service is deleted).

### `SupportRequest`

| Field | Required | Notes |
|-------|----------|-------|
| `full_name`, `email`, `requester_type`, `support_type`, `preferred_contact_method`, `message` | yes | |
| `consent` | yes | must be accepted (`true`) |
| `phone`, `service_id` | no | |
| `status` | set on create | defaults to `"new"` |

Reference format: `SR-0001` (zero-padded id).

## Project layout

```
app/
├── controllers/api/     # services_controller, support_requests_controller
├── models/              # Service, SupportRequest
bin/
├── render-build.sh      # Render build: bundle install + db:migrate
config/
├── routes.rb            # /api namespace + GET /up
├── database.yml         # production uses DATABASE_URL
db/
├── migrate/             # Schema migrations
├── schema.rb
└── seeds.rb             # 30 sample services
Procfile                 # web: bundle exec puma -C config/puma.rb
test/
├── models/              # Validation and association tests
├── controllers/api/     # Request/response tests for each endpoint
└── fixtures/            # Test data
```

## Testing

Requires PostgreSQL and the `backend_test` database.

```bash
bin/rails db:test:prepare test
```

From the project root:

```bash
npm run test:backend
```

**23 Minitest tests** cover:

- model validations and associations
- `GET /api/services`, `GET /api/services/:id` (including 404)
- `POST /api/services` (201 and 422)
- `PATCH /api/services/:id` (200, 404, 422, and 400 for missing `service` wrapper)
- `DELETE /api/services/:id` (204 and 404)
- `POST /api/support_requests` (201 and 422)

## CI

The root [GitHub Actions workflow](../.github/workflows/ci.yml) runs on pull requests and pushes to `main`:

- **Frontend** — Vitest unit tests and production build
- **Backend** — Rails tests with PostgreSQL 16
- **Playwright** — full-stack e2e, keyboard, and axe accessibility tests (`npm run test:all`)

This directory also has `bin/ci` for local Rails security and style checks (Brakeman, bundler-audit, RuboCop, Minitest).

## Deployment (Render)

Deployed as a **Ruby Web Service** on Render with **PostgreSQL**. The Nuxt frontend on Vercel connects via `NUXT_API_BASE`.

| Render setting | Value |
|----------------|-------|
| Root directory | `backend` |
| Runtime | **Ruby** (not Node) |
| Build command | `./bin/render-build.sh` |
| Start command | `bundle exec puma -C config/puma.rb` |
| Health check path | `/up` |

**Environment variables:**

| Variable | Value |
|----------|--------|
| `RAILS_ENV` | `production` |
| `RAILS_MASTER_KEY` | Contents of `config/master.key` (never commit) |
| `RAILS_LOG_TO_STDOUT` | `true` |
| `RAILS_SERVE_STATIC_FILES` | `true` |
| `DATABASE_URL` | From linked Render PostgreSQL |

After the first deploy, load sample data once (from your machine using the PostgreSQL **External Database URL**, or via `POST /api/services`):

```bash
export DATABASE_URL="..." RAILS_ENV=production RAILS_MASTER_KEY="$(cat config/master.key)"
bundle exec rails db:seed
```

Same destructive seed behaviour as in [Getting started](#getting-started) — run only when you intend to replace production data.

**Vercel:** set `NUXT_API_BASE=https://support-request-journey.onrender.com/api` and redeploy the frontend.

Production uses Ruby 3.4.4 to match Render support and keep local and production environments aligned.
