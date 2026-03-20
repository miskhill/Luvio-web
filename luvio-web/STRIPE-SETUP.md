# Stripe Integration Setup for Luvio Web

This document is the source of truth for Stripe setup in this project.

## Architecture

- Frontend (Netlify) only uses the Stripe publishable key and the backend API URL.
- Backend (Railway/server) uses the Stripe secret key and creates Checkout Sessions.
- Never expose `STRIPE_SECRET_KEY` in frontend env vars or client code.

## Environment Variables

### Frontend (Netlify / CRA build env)

Required:

```env
REACT_APP_STRIPE_PUBLISHABLE_KEY=pk_live_or_pk_test_...
REACT_APP_API_URL=https://your-backend-domain
```

Notes:

- Variable names must start with `REACT_APP_` to be available in CRA frontend code.
- `STRIPE_PUBLISHABLE_KEY` (without `REACT_APP_`) will not be read by the app.

### Backend (Railway/server env)

Required:

```env
STRIPE_SECRET_KEY=sk_live_or_sk_test_...
```

Optional but recommended:

```env
STRIPE_WEBHOOK_SECRET=whsec_...
```

## Test Mode vs Live Mode

- Test mode uses `pk_test` + `sk_test`.
- Live mode uses `pk_live` + `sk_live`.
- Modes must match across frontend and backend environments.

Quick checks:

- Checkout session IDs prefixed with `cs_test_` indicate test mode.
- Checkout session IDs prefixed with `cs_live_` indicate live mode.

### Common Error and Cause

Error:

`Your card was declined. Your request was in test mode, but used a non test card.`

Cause:

- Backend is still using `sk_test` while a real card is being used.

Fix:

1. Update backend `STRIPE_SECRET_KEY` to `sk_live`.
2. Redeploy/restart backend.
3. Verify frontend `REACT_APP_API_URL` points to that backend.

## Checkout Flow Requirements

1. Backend endpoint creates Checkout Session (`/api/stripe/create-checkout-session`).
2. Success URL must include `session_id={CHECKOUT_SESSION_ID}`.
3. Frontend verifies checkout result with backend before showing paid confirmation.
4. Backend must compute final pricing server-side (do not trust client-submitted prices).

## Production Go-Live Checklist

1. Netlify env vars set: `REACT_APP_STRIPE_PUBLISHABLE_KEY`, `REACT_APP_API_URL`.
2. Netlify does not contain `STRIPE_SECRET_KEY` (unless using Netlify Functions for Stripe).
3. Railway/backend env var set: `STRIPE_SECRET_KEY=sk_live_...`.
4. Backend redeployed after env changes.
5. Frontend redeployed after env changes.
6. Complete one real low-value test purchase and verify:
   - Stripe dashboard shows live payment.
   - App success screen shows session reference.
   - Backend order fulfillment path is triggered.

## Security Notes

- `.env` files must stay gitignored.
- If a secret key is ever shared in chat, logs, screenshots, or commits, rotate it immediately in Stripe and update backend env vars.

## Resources

- [Stripe Documentation](https://stripe.com/docs)
- [React Stripe.js Documentation](https://stripe.com/docs/stripe-js/react)
- [Testing Stripe Payments](https://stripe.com/docs/testing)
