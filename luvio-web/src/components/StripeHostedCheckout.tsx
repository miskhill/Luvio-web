import React, { useState } from 'react';
import styled from 'styled-components';
import { apiService, CartItem } from '../services/api';

// Styled components
const CheckoutButton = styled.button<{ disabled?: boolean }>`
  background-color: ${props => props.disabled ? '#666' : '#e84118'};
  color: white;
  border: none;
  padding: 1rem 2rem;
  border-radius: 4px;
  font-size: 1.1rem;
  font-weight: bold;
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  transition: background-color 0.3s ease;
  width: 100%;
  margin-top: 1rem;

  &:hover:not(:disabled) {
    background-color: #c23616;
  }
`;

const ErrorMessage = styled.div`
  color: #e74c3c;
  background-color: #2c1810;
  padding: 1rem;
  border-radius: 4px;
  margin-top: 1rem;
`;

const LoadingSpinner = styled.div`
  display: inline-block;
  width: 20px;
  height: 20px;
  border: 3px solid #f3f3f3;
  border-top: 3px solid #e84118;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-right: 10px;

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const SecurityNote = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 1rem;
  font-size: 0.9rem;
  color: #95a5a6;
`;

const SecurityIcon = styled.span`
  margin-right: 0.5rem;
  font-size: 1.2rem;
`;

interface StripeHostedCheckoutProps {
  cartItems: CartItem[];
  total: number;
}

const StripeHostedCheckout: React.FC<StripeHostedCheckoutProps> = ({ cartItems, total }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCheckout = async () => {
    setLoading(true);
    setError(null);

    try {
      // Get current origin for redirect URLs
      const origin = window.location.origin;
      
      // Create checkout session
      const { url } = await apiService.createCheckoutSession(
        cartItems,
        `${origin}/?checkout=success&session_id={CHECKOUT_SESSION_ID}`, // Redirect with Stripe session reference
        `${origin}/?checkout=cancelled` // Redirect to homepage with cancelled parameter
      );

      // Redirect to Stripe's hosted checkout
      window.location.href = url;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred during checkout');
      setLoading(false);
    }
  };

  return (
    <div>
      <CheckoutButton onClick={handleCheckout} disabled={loading}>
        {loading && <LoadingSpinner />}
        {loading ? 'Redirecting to Stripe...' : `Checkout Securely - £${total.toFixed(2)}`}
      </CheckoutButton>

      {error && <ErrorMessage>{error}</ErrorMessage>}

      <SecurityNote>
        <SecurityIcon>🔒</SecurityIcon>
        You'll be redirected to Stripe's secure checkout page to complete your purchase.
      </SecurityNote>
    </div>
  );
};

export default StripeHostedCheckout;
