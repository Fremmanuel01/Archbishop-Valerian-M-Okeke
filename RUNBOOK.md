# RUNBOOK — Archbishop Valerian M. Okeke

Operational playbook for the personal website of His Grace Most Rev.
Valerian M. Okeke.

Stack: Next.js 16 + Payload 3.82 on Postgres + Resend + Vercel Blob,
hosted on Vercel. Storefront in `web/`. See `CLAUDE.md` for architecture.

---

## On call surface

- **Storefront**: `https://archbishopvalokeke.org` (apex) /
  `https://archbishop-valerian-m-okeke.vercel.app` (vercel alias).
- **Payload admin**: `https://archbishopvalokeke.org/admin`.
- **Admin tools**:
  - `/admin-tools/send-newsletter` — review and broadcast monthly editions.
  - `/admin-tools/generate-slots` — pre-populate appointment slots for the year.
  - `/admin-tools/programme-import` — bulk CSV import of pastoral programme entries.

All admin tools are gated by Payload login + role. The `admin` role can
do everything; `newsletter_editor` can only use the newsletter pipeline.

---

## Required env vars

See `web/.env.example` for the full list. The minimum production set:

| Variable | Purpose | If missing |
|----------|---------|------------|
| `PAYLOAD_SECRET` | Signs Payload sessions + newsletter HMAC tokens | App refuses to boot |
| `DATABASE_URL` | Postgres connection | App boots, every Payload op fails |
| `NEXT_PUBLIC_SITE_URL` | Canonical hostname | Falls back to apex; OG/email links may point at the wrong host |
| `RESEND_API_KEY` | Email send | Form submissions error out |
| `RESEND_AUDIENCE_ID` | Newsletter audience id | Subscribe / broadcast disabled |
| `RESEND_FROM` | Verified sender domain | Falls back to `onboarding@resend.dev` (rate-limited, deliverability bad) |
| `RESEND_WEBHOOK_SECRET` | Validates inbound bounce/complaint events | Webhook 401s every call |
| `CRON_SECRET` | Validates the daily cron call | Cron handler 401s itself |
| `CONTACT_TO` | Operator inbox | Form submissions log a warning |
| `FACEBOOK_PAGE_ID`, `FACEBOOK_PAGE_ACCESS_TOKEN` | Pull posts for newsletter | Cron drafts empty editions; admin populates manually |

Optional but recommended:
- `BLOB_READ_WRITE_TOKEN` — durable storage for FB CDN images and Payload media.
- `ANTHROPIC_API_KEY` — AI rewriter in the newsletter editor.
- `SENTRY_DSN` + `NEXT_PUBLIC_SENTRY_DSN` — error tracking. Leave blank to skip.

---

## Common operations

### Recover an edition stuck in `sending`

The newsletter send action flips the edition's status to `sending`
before calling Resend, then to `sent` on success or `failed` on error.
If the function times out mid-broadcast, the edition stays in
`sending` forever.

1. Open `/admin-tools/send-newsletter/<id>`.
2. The send panel renders a red **"Stuck in sending"** card.
3. **Before clicking the recovery button**, open the Resend dashboard
   and confirm whether the broadcast actually went out. If subscribers
   received it, do NOT recover — set the status to `sent` manually in
   Payload admin to avoid double-sends.
4. If no broadcast was delivered: click "Mark failed (unstick)". This
   transitions the edition to `failed` and unlocks the retry button.
   The recovery is logged in the edition's `errors[]` audit.
5. Click "Reset & retry" to flip back to `ready_to_send`.
6. Type SEND and broadcast again.

### Rotate `RESEND_WEBHOOK_SECRET`

The webhook handler accepts comma-separated signatures, so dual-key
rotation works without downtime:

1. Generate the new secret in the Resend dashboard.
2. Add it to Vercel envs as `RESEND_WEBHOOK_SECRET_NEW` (do not
   overwrite the live var yet).
3. Update `app/api/webhooks/resend/route.ts:43` to consult both vars
   in the verification step.
4. Deploy.
5. Switch the Resend dashboard webhook secret to the new value.
6. After 24h, remove the old secret env var and revert the verifier.

### Rotate `PAYLOAD_SECRET`

Rotating PAYLOAD_SECRET invalidates:
- Every active Payload admin session (admins must log in again).
- Every in-flight newsletter confirm token (TTL 7 days).
- Every in-flight unsubscribe token (TTL 1 year).

Plan:
1. Notify admins to log out / save their work.
2. Generate a new 32+ char random string.
3. Update Vercel env (production + preview).
4. Redeploy.
5. Old emails with confirm/unsub links from before the rotation will
   show "link is invalid or has expired"; users should re-request the
   confirmation email or use the manual unsubscribe form.

### Recover lost FB Graph token

If `FACEBOOK_PAGE_ACCESS_TOKEN` expires or the FB app is
de-authorised, the cron logs `[Newsletter] {month} skipped: no FB
posts` and emails the office. To restore:

1. Visit Meta Business Suite → System Users → generate a new long-lived
   Page Access Token scoped to the Archbishop's Page with
   `pages_read_engagement`.
2. Update `FACEBOOK_PAGE_ACCESS_TOKEN` in Vercel envs.
3. Redeploy or wait for the next cron tick (08:00 UTC daily).
4. Optionally trigger an immediate redraft:
   `curl -H "Authorization: Bearer $CRON_SECRET" https://archbishopvalokeke.org/api/cron/newsletter?force=draft`.

### Run a database migration

The repo has `db.push: true` set, which means Payload pushes schema
changes directly **in development only**. Production migrations must
be run explicitly:

1. Pull production env locally:
   `vercel env pull web/.env.production.local`.
2. Verify the migration is idempotent. Open the file under
   `web/src/migrations/` and confirm any `CREATE TYPE` /
   `CREATE TABLE` is wrapped in `IF NOT EXISTS` or a `DO ... EXCEPTION`
   block.
3. Run `cd web && PAYLOAD_CONFIG_PATH=src/payload.config.ts npm run payload migrate`
   pointed at the production database.
4. Deploy.

To switch to managed migrations long-term (recommended):
1. Connect to prod DB.
2. Insert a row into `payload_migrations` for every migration name
   already represented in the live schema (`SELECT name FROM
   payload_migrations` should match the names in `web/src/migrations/`).
3. Edit `web/src/payload.config.ts:69` to set `push: false` and add
   `prodMigrations: migrations` (importing from `./migrations/index.ts`).
4. Deploy. Payload will run only NEW migrations from now on.

### `archbishopvalokeke.org` is not loading

If the apex domain times out or refuses to connect while the
`*.vercel.app` alias works, the issue is DNS, not the deployment.

**Symptoms:**
- `https://archbishop-valerian-m-okeke.vercel.app/` returns 200.
- `https://archbishopvalokeke.org/` hangs or fails with no response.

**Diagnose:**
```bash
# 1. Verify the Vercel deploy is healthy.
curl -I https://archbishop-valerian-m-okeke.vercel.app/

# 2. Inspect the domain's DNS posture.
dig +short NS archbishopvalokeke.org   # nameservers
dig +short A  archbishopvalokeke.org   # apex IP
npx vercel domains inspect archbishopvalokeke.org
```

In Vercel's output, the **Intended** and **Current** nameservers must
match. If they don't, the registrar's DNS is still authoritative and
Vercel can't manage the cert / A record.

**Fix:**

The domain is registered at **Hostinger** (the parking nameservers
end in `dns-parking.com`). Log in to Hostinger:

1. Domains → archbishopvalokeke.org → DNS / Nameservers.
2. Click **Change Nameservers** and set:
   - `ns1.vercel-dns.com`
   - `ns2.vercel-dns.com`
3. Save. Hostinger shows a "Nameservers changed" confirmation.

Once propagation completes Vercel re-issues the TLS certificate
automatically and the site is reachable again. Propagation is usually
15–60 minutes on public resolvers (Cloudflare 1.1.1.1, Google 8.8.8.8),
up to 24 hours on corporate networks with longer cache TTLs.

**Monitor progress:**
```bash
# Until this stops returning 76.76.21.21 (the stale apex IP), public
# DNS is still pointing at the old delegation:
watch -n 60 'dig +short A archbishopvalokeke.org @1.1.1.1'

# Vercel's nameservers will return live IPs (216.198.79.x, 64.29.17.x)
# the moment the project is provisioned; they were correct long before
# Hostinger flipped delegation:
dig +short A archbishopvalokeke.org @ns1.vercel-dns.com
```

**While DNS is propagating** the Vercel alias is the canonical URL:
share `https://archbishop-valerian-m-okeke.vercel.app/` with anyone
who needs the site immediately. Do not edit `NEXT_PUBLIC_SITE_URL`
to the alias just to dodge the DNS gap — the cron, email links,
and OG cards rely on the apex being canonical.

### Rebuild the Resend audience after a deliverability incident

If a hard-bounce wave or spam complaint pushes the sender reputation
into the gutter:

1. Pause the cron (set `CRON_SECRET=` empty) and the daily handler
   refuses to fire.
2. In Resend: review the audience, export the active contacts, prune
   bounced/complained.
3. Re-import a clean list as a new audience.
4. Update `RESEND_AUDIENCE_ID` in Vercel envs to point at the new
   audience.
5. Redeploy and re-arm the cron secret.

---

## Deployment flow

1. PR opens → GitHub Actions runs typecheck + lint + tests + build.
2. Merge to `main` → Vercel auto-deploys to production.
3. Preview deploys go up automatically per PR. They use the same
   Postgres database — be careful not to test destructive operations
   against production data from a preview.

To manually redeploy without code change:
- `npx vercel --prod` (from `web/`).

---

## Where to look when something is broken

| Symptom | Look at |
|---------|---------|
| All page renders 500 | Vercel runtime logs; check DATABASE_URL and PAYLOAD_SECRET |
| Admin-tools 403 for everyone | `users.role` column missing — run the role migration |
| Newsletter signup shows "temporarily unavailable" | RESEND_API_KEY or RESEND_AUDIENCE_ID missing |
| Booking form rejects available slots | Verify `payload_locked_documents_rels` has every collection's `_id` column. Adding a new collection requires a schema sync. |
| OG image broken on share | Check `archbishopvalokeke.org/opengraph-image-*.png` returns 200 |
| Welcome email never arrives | Check Resend dashboard "Logs". Confirm the domain's SPF/DKIM/DMARC are still passing. |
| Webhook 401s | RESEND_WEBHOOK_SECRET unset, or rotated and not deployed |
| Editor 403s on a non-admin user | Their `role` field is not `admin` or `newsletter_editor` — set it in Payload admin |
| Apex domain refuses to load while `*.vercel.app` works | Nameserver delegation broke. See "archbishopvalokeke.org is not loading" above |

---

## What this codebase does NOT have yet

(So you don't waste time looking for them.)

- No automated database backups outside whatever Vercel Marketplace
  Postgres ships with (Neon: 7-day point-in-time, Supabase: daily
  snapshots — verify your provider).
- No structured logging — `console.error`/`warn` calls go to Vercel
  runtime logs only. Set up Sentry to surface errors.
- No SLO / uptime monitoring — set up a Vercel Alert or external check.
- No load tests — the in-memory rate limiter has been thought through
  but never exercised under load. The Resend audience walk
  (`getActiveAudienceCount`) is the main risk above ~10k subscribers.
- No staging environment distinct from prod. Preview deploys share
  prod's Postgres.
