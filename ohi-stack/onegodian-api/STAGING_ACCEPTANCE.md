# Staging Acceptance Checklist (Membership, Billing, Products, Downloads)

Use this checklist after a staging deployment to validate end-to-end persistence with Prisma/PostgreSQL.

> This procedure intentionally avoids printing secrets. Export tokens only in your shell session and do not commit `.env` files.

## Required tools

- `curl`
- `jq`
- `psql` (or managed DB query console)
- optional: Stripe CLI (`stripe`) for webhook replay

## Variables

Set these before running commands:

```bash
export BASE_URL="https://staging-api.example.com"
export ADMIN_EMAIL="admin+staging@example.com"
export ADMIN_PASSWORD="replace-me"
export TEST_EMAIL="staging-user-$(date +%s)@example.com"
export TEST_PASSWORD="Password123!"
export DATABASE_URL="postgresql://..." # from secret manager/session only
```

## 1) Deploy staging

Deploy the current build/artifact to your staging environment.

## 2) Run migrations

```bash
npm run prisma:migrate:deploy
```

## 3) Seed products

```bash
npm run prisma:seed
```

Verify products were seeded:

```bash
psql "$DATABASE_URL" -c "select id,name,type,\"priceCents\" from products order by \"createdAt\" asc limit 5;"
```

## 4) Create test member

```bash
curl -sS -X POST "$BASE_URL/api/members/signup" \
  -H 'Content-Type: application/json' \
  -d "{\"email\":\"$TEST_EMAIL\",\"password\":\"$TEST_PASSWORD\",\"name\":\"Staging Test User\"}" | jq
```

## 5) Login test member

```bash
export MEMBER_TOKEN="$(curl -sS -X POST "$BASE_URL/api/members/login" \
  -H 'Content-Type: application/json' \
  -d "{\"email\":\"$TEST_EMAIL\",\"password\":\"$TEST_PASSWORD\"}" | jq -r '.token')"

test -n "$MEMBER_TOKEN"
```

## 6) Verify `/members/me` returns persisted account

```bash
curl -sS "$BASE_URL/api/members/me" \
  -H "Authorization: Bearer $MEMBER_TOKEN" | tee /tmp/staging-me.json | jq
```

Capture persisted user id/email for later checks:

```bash
export MEMBER_ID="$(jq -r '.user.id' /tmp/staging-me.json)"
export MEMBER_EMAIL="$(jq -r '.user.email' /tmp/staging-me.json)"
```

DB verification:

```bash
psql "$DATABASE_URL" -c "select id,email,role from users where id = '$MEMBER_ID';"
```

## 7) Create Stripe test checkout session

```bash
curl -sS -X POST "$BASE_URL/billing/checkout" \
  -H "Authorization: Bearer $MEMBER_TOKEN" \
  -H 'Content-Type: application/json' \
  -d '{"plan":"pro"}' | tee /tmp/staging-checkout.json | jq
```

## 8) Send Stripe test webhook

### Option A: Stripe CLI (preferred)

```bash
stripe trigger checkout.session.completed
```

### Option B: direct API webhook payload to staging

```bash
curl -sS -X POST "$BASE_URL/billing/webhook" \
  -H 'Content-Type: application/json' \
  -d "{\"id\":\"evt_staging_$(date +%s)\",\"type\":\"checkout.session.completed\",\"data\":{\"object\":{\"customer\":\"cus_staging\",\"subscription\":\"sub_staging\",\"metadata\":{\"userId\":\"$MEMBER_ID\",\"plan\":\"pro\"}}}}" | jq
```

## 9) Confirm subscription activates transactionally

```bash
curl -sS "$BASE_URL/billing/status" \
  -H "Authorization: Bearer $MEMBER_TOKEN" | tee /tmp/staging-billing-status.json | jq
```

Expected:
- `subscription.status == "active"`
- `subscription.plan == "pro"`

DB verification:

```bash
psql "$DATABASE_URL" -c "select \"userId\",plan,status,\"stripeCustomerId\",\"stripeSubscriptionId\" from subscriptions where \"userId\" = '$MEMBER_ID';"
psql "$DATABASE_URL" -c "select id,role from users where id = '$MEMBER_ID';"
```

## 10) Confirm billing event is persisted

```bash
psql "$DATABASE_URL" -c "select id,type,\"createdAt\" from billing_events where type='checkout.session.completed' order by \"createdAt\" desc limit 5;"
```

## 11) Confirm product order is created

```bash
export PRODUCT_ID="$(curl -sS "$BASE_URL/api/products" \
  -H "Authorization: Bearer $MEMBER_TOKEN" | jq -r '.products[0].id')"

curl -sS -X POST "$BASE_URL/api/products/checkout" \
  -H "Authorization: Bearer $MEMBER_TOKEN" \
  -H 'Content-Type: application/json' \
  -d "{\"productId\":\"$PRODUCT_ID\"}" | tee /tmp/staging-product-checkout.json | jq

export DOWNLOAD_TOKEN="$(jq -r '.fulfillment.downloadToken' /tmp/staging-product-checkout.json)"
```

DB verification:

```bash
psql "$DATABASE_URL" -c "select id,\"userId\",\"productId\",\"paymentStatus\",\"createdAt\" from orders where \"userId\"='$MEMBER_ID' order by \"createdAt\" desc limit 3;"
```

## 12) Confirm download token works

```bash
curl -i -sS "$BASE_URL/api/products/downloads/$DOWNLOAD_TOKEN" \
  -H "Authorization: Bearer $MEMBER_TOKEN"
```

Expected: HTTP `200` and a `download.url` field.

## 13) Confirm expired token is rejected

Force-expire token in staging DB:

```bash
psql "$DATABASE_URL" -c "update download_tokens set \"expiresAt\" = now() - interval '1 minute' where token = '$DOWNLOAD_TOKEN';"
```

Retry download:

```bash
curl -i -sS "$BASE_URL/api/products/downloads/$DOWNLOAD_TOKEN" \
  -H "Authorization: Bearer $MEMBER_TOKEN"
```

Expected: HTTP `410` with `token_expired` error code.

## 14) Confirm admin stats aggregate from DB

Get admin token:

```bash
export ADMIN_TOKEN="$(curl -sS -X POST "$BASE_URL/api/members/login" \
  -H 'Content-Type: application/json' \
  -d "{\"email\":\"$ADMIN_EMAIL\",\"password\":\"$ADMIN_PASSWORD\"}" | jq -r '.token')"
```

Query admin stats:

```bash
curl -sS "$BASE_URL/admin/stats" \
  -H "Authorization: Bearer $ADMIN_TOKEN" | jq
```

Expected stats include non-zero counters for users/orders/billing events after this flow.

## 15) Confirm restart does not lose state

1. Restart staging app instance(s).
2. Re-run:
   - `GET /ready`
   - `GET /billing/status` with `MEMBER_TOKEN`
   - `GET /api/products/downloads/$DOWNLOAD_TOKEN` (still expired, should remain rejected)
   - `GET /admin/stats` with `ADMIN_TOKEN`
3. Validate data is unchanged in DB:

```bash
psql "$DATABASE_URL" -c "select count(*) from users;"
psql "$DATABASE_URL" -c "select count(*) from subscriptions;"
psql "$DATABASE_URL" -c "select count(*) from billing_events;"
psql "$DATABASE_URL" -c "select count(*) from orders;"
```

If all checks pass, staging acceptance is complete.
