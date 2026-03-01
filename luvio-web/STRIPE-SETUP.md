# Stripe Integration Setup for Luvio Web

This document provides instructions on how to set up and configure the Stripe payment integration for the Luvio website.

## Prerequisites

1. A Stripe account (create one at [stripe.com](https://stripe.com) if you don't have one)
2. API keys from your Stripe dashboard

## Setup Instructions

### 1. Create a .env file

Create a `.env` file in the root of your project (the `luvio-web` directory). You can copy the contents from the `.env.example` file that has been created for you.

```bash
cp .env.example .env
```

### 2. Add your Stripe API keys

Open the `.env` file and replace the placeholder values with your actual Stripe API keys:

```
REACT_APP_STRIPE_PUBLISHABLE_KEY=pk_test_your_actual_publishable_key
```

You can find these keys in your Stripe Dashboard under Developers > API keys.

**Important**: 
- Use test keys for development
- Use live keys only in production
- Only expose the publishable key in frontend env vars (`REACT_APP_*`)
- Keep `STRIPE_SECRET_KEY` on the backend only (never in frontend env vars)
- Never commit your `.env` file to version control (it's already in `.gitignore`)

### 3. Test Mode vs. Live Mode

During development and testing, use Stripe's test mode keys. This allows you to simulate payments without actual charges.

For test mode:
- Use the test API keys from your Stripe dashboard
- Use Stripe's test card numbers for testing:
  - `4242 4242 4242 4242` (Visa, successful payment)
  - `4000 0000 0000 0002` (Visa, declined payment)
  - Expiry date: Any future date
  - CVC: Any 3 digits
  - ZIP: Any 5 digits

### 4. Backend Requirements

Production payments require a backend that talks to Stripe using the secret key:

1. Create a server endpoint to create Checkout Sessions
2. Verify payment status server-side (or via webhooks) before fulfilling orders
3. Store order information in a database

## Usage

The Shop tab in the Luvio website now allows users to:

1. Browse available wristbands
2. Add items to their cart
3. Proceed to checkout
4. Enter shipping and payment information
5. Complete their purchase securely

## Troubleshooting

If you encounter issues with the Stripe integration:

1. Check that your API keys are correctly set in the `.env` file
2. Ensure the `.env` file is in the correct location
3. Restart the development server after making changes to environment variables
4. Check the browser console for any error messages
5. Verify that you're using the correct test card numbers during testing

## Resources

- [Stripe Documentation](https://stripe.com/docs)
- [React Stripe.js Documentation](https://stripe.com/docs/stripe-js/react)
- [Testing Stripe Payments](https://stripe.com/docs/testing)
