# Luvio Web

The public Luvio website is a React and TypeScript application in [`luvio-web`](./luvio-web). It is
deployed through Netlify and uses `luvio-server` for the Stripe catalog, Checkout, payment
verification, and charity fundraising total.

## Current production features

- Product catalog and server-priced Stripe Checkout.
- Verified post-checkout status rather than trusting return URL parameters alone.
- A homepage `Luvio x Mind` pledge counter.
- A responsive charity impact page at `/charity`.
- A neutral fallback when the live charity API is unavailable.

See [`luvio-web/README.md`](./luvio-web/README.md) for development commands and architecture, and
[`luvio-web/STRIPE-SETUP.md`](./luvio-web/STRIPE-SETUP.md) for deployment configuration.

## Repository rules

Read [`AGENTS.md`](./AGENTS.md) before making changes. In particular, future website styling must
be implemented in `.scss` files; do not add inline styles or CSS-in-JS.
