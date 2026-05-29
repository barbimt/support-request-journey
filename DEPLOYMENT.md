# Deployment guide

Production architecture for **Support Request Journey**:

```
Browser
  → Nuxt app on Vercel
  → Nuxt server routes (/api/*)
  → Rails API on Render
  → PostgreSQL on Render
```

The browser never calls the Rails API directly. Nuxt server routes proxy requests using private runtime config (`NUXT_API_BASE`). That keeps the Rails base URL off the client and lets you change backends without exposing internal URLs.

---

## Why Nuxt calls Rails through server routes

- **Security** — The Rails API URL stays server-side. It is not in `runtimeConfig.public` and is not shipped to the browser.
- **Same-origin API** — The frontend always calls `/api/*` on the Nuxt host, so you avoid CORS configuration on Rails.
- **Flexibility** — You can point `NUXT_API_BASE` at Render (or another host) without changing frontend code.

Relevant files:

- `nuxt.config.ts` — `runtimeConfig.apiBase` from `NUXT_API_BASE`
- `server/utils/railsApi.ts` — server-side fetch to Rails
- `server/api/*` — thin proxy routes

---

## Environment variables

### Render (Rails API)

| Variable | Value | Notes |
|----------|-------|-------|
| `RAILS_ENV` | `production` | Required |
| `RAILS_MASTER_KEY` | contents of `backend/config/master.key` | **Never commit this value.** Copy from your local `master.key` when creating the Render service. |
| `RAILS_LOG_TO_STDOUT` | `true` | Logs go to Render’s log stream |
| `RAILS_SERVE_STATIC_FILES` | `true` | Serves static files when needed |
| `DATABASE_URL` | Render PostgreSQL **internal** URL | Render sets this automatically when you link the database to the web service |

Rails reads `DATABASE_URL` in production (`backend/config/database.yml`). Primary, cache, and queue connections all use the same Render PostgreSQL instance.

### Vercel (Nuxt frontend)

| Variable | Example | Notes |
|----------|---------|-------|
| `NUXT_API_BASE` | `https://your-render-backend.onrender.com/api` | **Server-only.** Set in Vercel Project Settings → Environment Variables. |

After changing `NUXT_API_BASE`, **redeploy** the Vercel project so the new value is picked up.

Do **not** put `NUXT_API_BASE` in `runtimeConfig.public` — it must stay private.

---

## Backend on Render

1. **Create a PostgreSQL database** on Render (same region as the web service when possible).

2. **Create a Web Service** from the GitHub repository.

3. **Root directory:** `backend`

4. **Runtime:** Ruby (see `backend/.ruby-version` — currently Ruby 4.0.5)

5. **Build command** (either works):

   ```bash
   ./bin/render-build.sh
   ```

   or:

   ```bash
   bundle install && bundle exec rails db:migrate
   ```

6. **Start command:**

   ```bash
   bundle exec puma -C config/puma.rb
   ```

7. **Health check path:** `/up`

8. **Environment variables:** add the Render variables listed above. Link the PostgreSQL database so `DATABASE_URL` is injected.

9. **After the first successful deploy**, open **Render Shell** and run seeds **once**:

   ```bash
   bundle exec rails db:seed
   ```

   Seeds are **idempotent** (`find_or_create_by!` on service title). Running them again does not create duplicate services, but you only need to run seeds once to populate initial data.

10. **Smoke test:**

    - `https://your-render-backend.onrender.com/up` — should return 200 (green health page)
    - `https://your-render-backend.onrender.com/api/services` — should return a JSON array of services (after seeding)

---

## Frontend on Vercel

The Nuxt app is already deployed on Vercel. To connect it to the Render API:

1. Open **Vercel Project Settings → Environment Variables**.

2. Add:

   ```
   NUXT_API_BASE=https://your-render-backend.onrender.com/api
   ```

   Use your actual Render service URL. Include the `/api` suffix.

3. **Redeploy** the frontend (Deployments → … → Redeploy).

4. **Smoke test:**

   - `https://support-request-journey.vercel.app/services` — should list seeded services
   - `https://support-request-journey.vercel.app/manage/services` — should show existing services and allow creating new ones

---

## Troubleshooting: empty `/services` in production

If the services page is empty in production, check in order:

1. **Rails API is awake** — Free Render services spin down. Hit `/up` or `/api/services` directly; the first request may take ~30s.

2. **`/api/services` returns data** — Open the Render URL in a browser or use curl. If empty `[]`, seeds may not have run.

3. **`db:seed` has been run on Render** — From Render Shell: `bundle exec rails db:seed`

4. **`NUXT_API_BASE` is set in Vercel** — Must point to `https://<your-render-host>/api`

5. **Vercel was redeployed** after changing environment variables — Env changes do not apply to existing deployments until you redeploy.

6. **Check Vercel function logs** — Failed proxy calls to Rails often show as 502/503 from `/api/services`.

---

## Running seeds safely

`backend/db/seeds.rb` uses `Service.find_or_create_by!(title: ...)` for each sample service. That means:

- First run creates the five sample services.
- Later runs skip existing titles and do not duplicate rows.
- Safe to re-run if you are unsure whether seeds ran; you will see `Seeded N services.` where N is the total count in the table.

Seeds are **not** run automatically on deploy (`bin/render-build.sh` only runs migrations). Run them manually once from Render Shell after the first deploy.

---

## Local verification before deploy

From the project root:

```bash
npm run test
npm run build
npm run test:e2e    # optional; needs PostgreSQL and Playwright
```

From `backend/`:

```bash
bundle exec rails db:migrate
bundle exec rails db:seed
```

---

## Files added for Render

| File | Purpose |
|------|---------|
| `backend/Procfile` | Process definition for Puma |
| `backend/bin/render-build.sh` | Build step: `bundle install` + `db:migrate` |

Manual Render setup (documented above) is preferred over a committed `render.yaml` with placeholders.
