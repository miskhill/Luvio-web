// API service for communicating with the backend
export interface CartItem {
  id: string;
  name: string;
  color: string;
  price: number;
  quantity: number;
}



export interface CheckoutSessionResponse {
  sessionId: string;
  url: string;
}

export interface PaymentStatusResponse {
  status: string;
  amount: number;
  currency: string;
  created: string;
}

export interface CheckoutSessionStatusResponse {
  sessionId: string;
  status: string;
  paymentStatus: string;
  amountTotal: number | null;
  currency: string | null;
  customerEmail: string | null;
  created: string;
  verifiedPaid: boolean;
}

class ApiService {
  private baseUrl: string;

  constructor() {
    // Use Railway URL in production, localhost in development
    this.baseUrl = process.env.REACT_APP_API_URL || 'http://localhost:3000';
  }

  /**
   * Create a checkout session for hosted Stripe checkout
   */
  async createCheckoutSession(
    cartItems: CartItem[],
    successUrl?: string,
    cancelUrl?: string,
    metadata: Record<string, string> = {}
  ): Promise<CheckoutSessionResponse> {
    const response = await fetch(`${this.baseUrl}/api/stripe/create-checkout-session`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        cartItems,
        successUrl,
        cancelUrl,
        metadata,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to create checkout session');
    }

    return response.json();
  }



  /**
   * Get payment status from backend
   */
  async getPaymentStatus(paymentIntentId: string): Promise<PaymentStatusResponse> {
    const response = await fetch(`${this.baseUrl}/api/stripe/payment-status/${paymentIntentId}`);

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to get payment status');
    }

    return response.json();
  }

  /**
   * Get checkout session status from backend
   */
  async getCheckoutSessionStatus(sessionId: string): Promise<CheckoutSessionStatusResponse> {
    const response = await fetch(`${this.baseUrl}/api/stripe/checkout-session/${sessionId}`);

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to get checkout session status');
    }

    return response.json();
  }

  /**
   * Helper to convert cart items to metadata for Stripe
   */
  cartToMetadata(cartItems: CartItem[]): Record<string, string> {
    const metadata: Record<string, string> = {};
    
    cartItems.forEach((item, index) => {
      metadata[`item_${index}_id`] = item.id;
      metadata[`item_${index}_name`] = item.name;
      metadata[`item_${index}_quantity`] = item.quantity.toString();
      metadata[`item_${index}_price`] = item.price.toString();
    });
    
    metadata.total_items = cartItems.length.toString();
    return metadata;
  }
}

export const apiService = new ApiService();
