import { loadStripe } from '@stripe/stripe-js';

// Get the Stripe publishable key from environment variables
const stripePublishableKey = process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY || '';

// Check if Stripe is configured
export const isStripeConfigured = (): boolean => {
  return Boolean(stripePublishableKey);
};

// Initialize Stripe with the publishable key
let stripePromise: ReturnType<typeof loadStripe> | null = null;

export const getStripePromise = (): ReturnType<typeof loadStripe> => {
  if (!stripePromise && stripePublishableKey) {
    stripePromise = loadStripe(stripePublishableKey);
  }
  // Always return a Promise<Stripe | null>
  return stripePromise || Promise.resolve(null);
};

// Helper function to format price in currency
export const formatCurrency = (amount: number): string => {
  return `£${amount.toFixed(2)}`;
};

// For server integration (when you implement a backend)
export const getApiUrl = (): string => {
  return process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
};
