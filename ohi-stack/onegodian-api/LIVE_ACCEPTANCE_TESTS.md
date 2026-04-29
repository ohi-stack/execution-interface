# Live Acceptance Tests

Base URL used below:

```bash
export API_BASE_URL="https://api.onegodian.org"
```

> Do not paste multiple URLs together in a browser address bar. Run one command at a time.

## 1) Health Check

```bash
curl -sS "$API_BASE_URL/health"
```

## 2) Readiness Check

```bash
curl -sS "$API_BASE_URL/ready"
```

## 3) Version Check

```bash
curl -sS "$API_BASE_URL/version"
```

## 4) Products Listing

```bash
curl -sS "$API_BASE_URL/api/products"
```

## 5) Member Signup

```bash
curl -sS -X POST "$API_BASE_URL/api/members/signup" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "tester+signup@example.com",
    "password": "ChangeThisPassword123!",
    "fullName": "Live Signup Tester"
  }'
```

## 6) Member Login

```bash
curl -sS -X POST "$API_BASE_URL/api/members/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "tester+signup@example.com",
    "password": "ChangeThisPassword123!"
  }'
```

## 7) Product Checkout

```bash
curl -sS -X POST "$API_BASE_URL/api/products/checkout" \
  -H "Content-Type: application/json" \
  -d '{
    "productId": "prod_alignment_prompt",
    "email": "buyer@example.com",
    "successUrl": "https://onegodian.org/success",
    "cancelUrl": "https://onegodian.org/cancel"
  }'
```

## 8) Billing Checkout

```bash
curl -sS -X POST "$API_BASE_URL/api/billing/checkout" \
  -H "Content-Type: application/json" \
  -d '{
    "plan": "monthly",
    "email": "buyer@example.com",
    "successUrl": "https://onegodian.org/success",
    "cancelUrl": "https://onegodian.org/cancel"
  }'
```

## Automated Smoke Test

```bash
API_BASE_URL="https://api.onegodian.org" npm run smoke:live
```
