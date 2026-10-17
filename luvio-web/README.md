# Luvio website

This is the React and TypeScript frontend for [luvioband.co.uk](https://luvioband.co.uk/). It was
bootstrapped with Create React App and is deployed through Netlify.

## Architecture

- `src/App.tsx` owns the existing tab-style navigation.
- `/charity` is a real browser path backed by the same single-page application. Netlify's catch-all
  redirect in `netlify.toml` serves the app for direct visits and refreshes.
- `src/services/api.ts` is the browser's interface to `luvio-server`.
- The shop loads its catalog and creates Checkout Sessions through the backend. The browser never
  decides final prices.
- The charity homepage card and impact page both read `GET /api/stripe/charity-impact`. The
  frontend formats and presents the response but does not calculate the pledge.

The deployed charity page explains that the total is pledged rather than necessarily transferred,
that each individual band contributes £1, and that refunds do not reduce the pledge.

## Environment

Copy `.env.example` for local development. The main frontend settings are:

```env
REACT_APP_API_URL=http://localhost:3001
REACT_APP_STRIPE_PUBLISHABLE_KEY=pk_test_...
```

Never place a Stripe secret key in a frontend environment variable.

## Available scripts

Run these commands from this directory.

### `npm start`

Starts the development server at [http://localhost:3000](http://localhost:3000).

### `npm test`

Starts the test runner. For a single CI-style pass, use:

```bash
CI=true npm test -- --watchAll=false
```

### `npm run build`

Creates an optimized production build in `build`.

## Styling rule for future work

All new or changed styling must be placed in `.scss` files. Do not add JSX `style` props,
JavaScript style objects, `styled-components`, or other CSS-in-JS styling.

The current application contains legacy `styled-components` and inline styles. They do not need a
standalone refactor now. When future work changes a component's styling, migrate the styles touched
by that task to a component SCSS file. The first future SCSS change must also add the `sass`
dependency because it is not currently declared directly by the project.

The repository-level [`AGENTS.md`](../AGENTS.md) contains the authoritative rule for future agents.

## Validation

For normal changes, run:

```bash
CI=true npm test -- --watchAll=false
npm run build
```

For visible changes, also verify representative desktop and mobile widths. Evidence screenshots
for the charity counter implementation are stored in `evidence/charity-counter`.

## Deployment

Deploy backend changes before frontend changes when an update introduces or changes an API. See
[`STRIPE-SETUP.md`](./STRIPE-SETUP.md) for the production environment and verification checklist.
