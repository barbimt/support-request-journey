# Support Request Journey — Rails API

JSON API for the [Support Request Journey](../README.md) app. Stores support services and support request submissions in **PostgreSQL**.

The browser never calls this API directly. **Nuxt** server routes proxy requests using `NUXT_API_BASE` (default `http://localhost:3001/api`).

## Stack

- **Ruby** 4.0.5 (see `.ruby-version`)
- **Rails** 8.1 (API mode)
- **PostgreSQL** 16+
- **Puma**

## Prerequisites

- Ruby 4.0+ and Bundler
- PostgreSQL 16+ running locally

On macOS with Homebrew:

```bash
brew install ruby postgresql@16
brew services start postgresql@16
export PATH="/opt/homebrew/opt/ruby/bin:/opt/homebrew/lib/ruby/gems/4.0.0/bin:/opt/homebrew/opt/postgresql@16/bin:$PATH"
```

## Getting started

From this directory (`backend/`):

```bash
bundle install
bin/rails db:create db:migrate db:seed
bin/rails server -p 3001
```

Health check: [http://localhost:3001/up](http://localhost:3001/up) — a green page means Rails booted correctly.

Start the Nuxt frontend from the project root in a second terminal (`npm run dev` on port 3000).

## API

Base URL in development: `http://localhost:3001/api`

| Method | Path | Description |
|--------|------|-------------|
| GET | `/services` | List all services (ordered by title) |
| GET | `/services/:id` | One service, or `404` with `{ "message": "Service not found" }` |
| POST | `/services` | Create a service — `201` + JSON, or `422` with validation errors |
| POST | `/support_requests` | Create a support request — `201` with reference (e.g. `SR-0001`), or `422` |

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
config/
├── routes.rb            # /api namespace
db/
├── migrate/             # Schema migrations
├── schema.rb
└── seeds.rb             # Sample services for development
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

**17 Minitest tests** cover:

- model validations and associations
- `GET /api/services`, `GET /api/services/:id` (including 404)
- `POST /api/services` (201 and 422)
- `POST /api/support_requests` (201 and 422)

For manual curl checks and full-stack testing through Nuxt, see [`docs/testing-cookbook.md`](../docs/testing-cookbook.md) in the project root.

## CI

GitHub Actions (`.github/workflows/ci.yml`) runs on push and pull requests:

- Brakeman (security)
- bundler-audit (gem vulnerabilities)
- RuboCop (style)
- **Minitest** (with PostgreSQL 16)

Run the same checks locally:

```bash
bin/ci
```

## Deployment

Deploy this API on **Render** (Web Service + PostgreSQL). The Nuxt frontend on **Vercel** calls this API through server routes using `NUXT_API_BASE`.

Full step-by-step instructions: **[DEPLOYMENT.md](../DEPLOYMENT.md)** in the project root.

### Render quick reference

| Setting | Value |
|---------|-------|
| Root directory | `backend` |
| Build command | `./bin/render-build.sh` |
| Start command | `bundle exec puma -C config/puma.rb` |
| Health check | `/up` |

**Environment variables:** `RAILS_ENV=production`, `RAILS_MASTER_KEY` (from `config/master.key`, never commit), `RAILS_LOG_TO_STDOUT=true`, `RAILS_SERVE_STATIC_FILES=true`, `DATABASE_URL` (from linked Render PostgreSQL).

After first deploy, run once from Render Shell:

```bash
bundle exec rails db:seed
```

**Vercel:** set `NUXT_API_BASE=https://your-render-backend.onrender.com/api` and redeploy the frontend.
