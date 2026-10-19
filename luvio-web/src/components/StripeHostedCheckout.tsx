import React, { useState } from "react";
import { apiService, CartItem, ShopShippingSummary } from "../services/api";
import "./StripeHostedCheckout.scss";

interface StripeHostedCheckoutProps {
  cartItems: CartItem[];
  total: number;
  shippingSummary: ShopShippingSummary | null;
}

function getCheckoutLabel(total: number, shippingSummary: ShopShippingSummary | null): string {
  if (!shippingSummary || shippingSummary.amount === null) {
    return `Continue to Stripe — £${total.toFixed(2)} plus shipping`;
  }
  return `Continue to Stripe — £${total.toFixed(2)} plus ${shippingSummary.displayName}`;
}

function getShippingNote(shippingSummary: ShopShippingSummary | null): string {
  if (!shippingSummary) return "Postage and packaging will be calculated in Stripe Checkout.";
  if (shippingSummary.amount === null || !shippingSummary.currency) {
    return `${shippingSummary.displayName} will be added in Stripe Checkout.`;
  }
  return `${shippingSummary.displayName} will be added before payment confirmation.`;
}

const StripeHostedCheckout: React.FC<StripeHostedCheckoutProps> = ({ cartItems, total, shippingSummary }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCheckout = async () => {
    setLoading(true);
    setError(null);
    try {
      const origin = window.location.origin;
      const { url } = await apiService.createCheckoutSession(
        cartItems,
        `${origin}/?checkout=success&session_id={CHECKOUT_SESSION_ID}`,
        `${origin}/?checkout=cancelled`
      );
      window.location.href = url;
    } catch (checkoutError) {
      setError(checkoutError instanceof Error ? checkoutError.message : "Checkout could not be started.");
      setLoading(false);
    }
  };

  return (
    <div className="hosted-checkout">
      <button className="button button--primary hosted-checkout__button" type="button" onClick={handleCheckout} disabled={loading}>
        {loading && <span className="loading-spinner" aria-hidden="true" />}
        {loading ? "Redirecting to Stripe…" : getCheckoutLabel(total, shippingSummary)}
      </button>
      {error && <div className="checkout-error" role="alert">{error}</div>}
      <p className="security-note"><span aria-hidden="true">🔒</span>{getShippingNote(shippingSummary)}</p>
    </div>
  );
};

export default StripeHostedCheckout;
