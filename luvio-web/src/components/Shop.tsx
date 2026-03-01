import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { isStripeConfigured, formatCurrency } from "../utils/stripe";
import StripeHostedCheckout from "./StripeHostedCheckout";
import { apiService, CheckoutSessionStatusResponse } from "../services/api";

const ShopContainer = styled.div`
  max-width: 800px;
  width: 100%;
  padding: 2rem;
  border-radius: 8px;
  background-color: #222;
  margin: 0 auto;
`;

const ShopTitle = styled.h2`
  font-size: 2.5rem;
  margin-bottom: 2rem;
  color: #e84118;
  text-align: center;
`;

const ProductGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 2rem;
  margin-bottom: 2rem;
`;

const ProductCard = styled.div`
  background-color: #333;
  border-radius: 8px;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  transition: transform 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
  }
`;

const ProductImage = styled.div<{ color: string }>`
  height: 100px;
  background-color: ${(props) => props.color};
  border-radius: 8px;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: bold;
  text-transform: uppercase;
`;

const ProductTitle = styled.h3`
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
  color: #e9e2c8;
`;

const ProductPrice = styled.div`
  font-size: 1.2rem;
  margin-bottom: 1rem;
  color: #e84118;
  font-weight: bold;
`;

const ProductDescription = styled.p`
  font-size: 1rem;
  margin-bottom: 1.5rem;
  color: #e9e2c8;
  flex-grow: 1;
`;

const AddToCartButton = styled.button`
  background-color: #e84118;
  color: white;
  border: none;
  border-radius: 25px;
  padding: 10px 20px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s;
  font-weight: bold;
  text-transform: uppercase;
  
  &:hover {
    background-color: #c23616;
  }
`;

const CartSection = styled.div`
  margin-top: 3rem;
  padding-top: 2rem;
  border-top: 1px solid #444;
`;

const CartTitle = styled.h3`
  font-size: 2rem;
  margin-bottom: 1.5rem;
  color: #e9e2c8;
`;

const CartEmpty = styled.p`
  font-size: 1.2rem;
  color: #999;
  text-align: center;
  padding: 2rem 0;
`;

const CartItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 0;
  border-bottom: 1px solid #444;
  
  &:last-child {
    border-bottom: none;
  }
`;

const CartItemInfo = styled.div`
  display: flex;
  align-items: center;
`;

const CartItemColor = styled.div<{ color: string }>`
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background-color: ${(props) => props.color};
  margin-right: 1rem;
`;

const CartItemName = styled.span`
  font-size: 1.1rem;
  color: #e9e2c8;
`;

const CartItemPrice = styled.span`
  font-size: 1.1rem;
  color: #e9e2c8;
`;

const CartItemQuantity = styled.div`
  display: flex;
  align-items: center;
`;

const QuantityButton = styled.button`
  background-color: #444;
  color: white;
  border: none;
  border-radius: 50%;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 1.2rem;
  
  &:hover {
    background-color: #555;
  }
`;

const QuantityText = styled.span`
  margin: 0 1rem;
  color: #e9e2c8;
  font-size: 1.1rem;
`;

const CartTotal = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem 0;
  border-top: 2px solid #444;
  margin-top: 1rem;
`;

const CartTotalText = styled.span`
  font-size: 1.3rem;
  font-weight: bold;
  color: #e9e2c8;
`;

const CartTotalPrice = styled.span`
  font-size: 1.5rem;
  font-weight: bold;
  color: #e84118;
`;

const RemoveButton = styled.button`
  background: none;
  border: none;
  color: #e84118;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  margin-left: 1rem;

  &:hover {
    background-color: rgba(232, 65, 24, 0.1);
    color: #ff6b47;
    transform: scale(1.1);
  }

  &:active {
    transform: scale(0.95);
  }
`;

const CheckoutSection = styled.div`
  margin-top: 2rem;
`;

const CheckoutButton = styled.button`
  background-color: #e84118;
  color: white;
  border: none;
  border-radius: 25px;
  padding: 14px 32px;
  font-size: 1.3rem;
  cursor: pointer;
  transition: background-color 0.3s;
  display: block;
  width: 100%;
  margin: 2rem 0;
  font-weight: bold;
  text-transform: uppercase;
  
  &:hover {
    background-color: #c23616;
  }
  
  &:disabled {
    background-color: #555;
    cursor: not-allowed;
  }
`;

const PaymentFormContainer = styled.div`
  background-color: #333;
  border-radius: 8px;
  padding: 2rem;
  margin-top: 2rem;
`;

const StatusCard = styled.div`
  background-color: #333;
  border: 1px solid #444;
  border-radius: 8px;
  padding: 2rem;
  text-align: left;
`;

const StatusHeading = styled.h3`
  font-size: 1.8rem;
  margin: 0 0 1rem;
  color: #e9e2c8;
`;

const StatusText = styled.p`
  color: #e9e2c8;
  margin: 0 0 1rem;
  line-height: 1.5;
`;

const ReceiptRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 1rem;
  padding: 0.75rem 0;
  border-top: 1px solid #444;
`;

const ReceiptLabel = styled.span`
  color: #999;
  flex: 0 0 140px;
`;

const ReceiptValue = styled.span`
  color: #e9e2c8;
  font-weight: bold;
  flex: 1;
  text-align: right;
  line-height: 1.35;
  overflow-wrap: anywhere;
  word-break: break-word;
`;

const StatusActionButton = styled.button`
  background-color: #e84118;
  color: white;
  border: none;
  border-radius: 25px;
  padding: 12px 24px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s;
  font-weight: bold;
  text-transform: uppercase;

  &:hover {
    background-color: #c23616;
  }
`;

const StatusButtonRow = styled.div`
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
  margin-top: 1.5rem;
`;

const StatusSecondaryButton = styled(StatusActionButton)``;

// Product data
const products = [
  {
    id: 'red-band',
    name: 'Red Wristband',
    color: '#e74c3c',
    price: 2,
    description: 'Not looking for a relationship. Please don\'t approach.',
  },
  {
    id: 'yellow-band',
    name: 'Yellow Wristband',
    color: '#f1c40f',
    price: 2,
    description: 'Might be open..., but I\'ll make the first move.',
  },
  {
    id: 'green-band',
    name: 'Green Wristband',
    color: '#2ecc71',
    price: 2,
    description: 'Open to connection. Feel free to come say hello.',
  },
  {
    id: 'band-pack',
    name: 'Luvio Band Pack',
    color: 'linear-gradient(to right, #e74c3c, #f1c40f, #2ecc71)',
    price: 5,
    description: 'Get all three bands at a discounted price!',
  }
];

// Real Stripe Checkout Integration
// The StripeCheckout component handles the actual payment processing

// Cart item type
interface CartItemType {
  id: string;
  name: string;
  color: string;
  price: number;
  quantity: number;
}

type CheckoutViewState = 'idle' | 'loading' | 'success' | 'cancelled' | 'unverified' | 'error';

function formatCheckoutAmount(amount: number | null, currency: string | null): string {
  if (amount === null) return 'N/A';
  if (!currency) return formatCurrency(amount);

  try {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: currency.toUpperCase(),
    }).format(amount);
  } catch {
    return formatCurrency(amount);
  }
}

// Shop component
const Shop = () => {
  const [cart, setCart] = useState<CartItemType[]>([]);
  const [showCheckout, setShowCheckout] = useState(false);
  const [stripeConfigured, setStripeConfigured] = useState(false);
  const [checkoutViewState, setCheckoutViewState] = useState<CheckoutViewState>('idle');
  const [checkoutSession, setCheckoutSession] = useState<CheckoutSessionStatusResponse | null>(null);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);
  
  useEffect(() => {
    // Check if Stripe is properly configured
    setStripeConfigured(isStripeConfigured());
    
    if (!isStripeConfigured()) {
      console.warn('Stripe is not properly configured. Please check your environment variables.');
    }

    const params = new URLSearchParams(window.location.search);
    const checkoutState = params.get('checkout');
    const legacyPaymentState = params.get('payment');
    const sessionId = params.get('session_id');
    const isSuccess = checkoutState === 'success' || legacyPaymentState === 'success';
    const isCancelled = checkoutState === 'cancelled' || legacyPaymentState === 'cancelled';

    let isMounted = true;

    if (isSuccess) {
      if (!sessionId) {
        setCheckoutViewState('error');
        setCheckoutError('Missing checkout session reference. Please contact support if you were charged.');
        return () => {
          isMounted = false;
        };
      }

      setCheckoutViewState('loading');

      (async () => {
        try {
          const session = await apiService.getCheckoutSessionStatus(sessionId);
          if (!isMounted) return;

          setCheckoutSession(session);
          if (session.verifiedPaid) {
            setCheckoutViewState('success');
            setShowCheckout(false);
            setCart([]);
          } else {
            setCheckoutViewState('unverified');
          }
        } catch (error) {
          if (!isMounted) return;
          setCheckoutViewState('error');
          setCheckoutError(
            error instanceof Error ? error.message : 'Unable to verify your payment at the moment.'
          );
        }
      })();
    } else if (isCancelled) {
      setCheckoutViewState('cancelled');
    }

    return () => {
      isMounted = false;
    };
  }, []);

  const handleContinueShopping = () => {
    const url = new URL(window.location.href);
    url.searchParams.delete('checkout');
    url.searchParams.delete('payment');
    url.searchParams.delete('session_id');

    const nextUrl = `${url.pathname}${url.searchParams.toString() ? `?${url.searchParams.toString()}` : ''}${url.hash}`;
    window.history.replaceState({}, document.title, nextUrl);

    setCheckoutViewState('idle');
    setCheckoutSession(null);
    setCheckoutError(null);
  };

  const handleBackHome = () => {
    window.location.href = '/';
  };
  
  const addToCart = (product: typeof products[0]) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id === product.id);
      
      if (existingItem) {
        return prevCart.map(item => 
          item.id === product.id 
            ? { ...item, quantity: item.quantity + 1 } 
            : item
        );
      } else {
        return [...prevCart, { ...product, quantity: 1 }];
      }
    });
  };
  
  const increaseQuantity = (id: string) => {
    setCart(prevCart => 
      prevCart.map(item => 
        item.id === id 
          ? { ...item, quantity: item.quantity + 1 } 
          : item
      )
    );
  };
  
  const decreaseQuantity = (id: string) => {
    setCart(prevCart => 
      prevCart.map(item => 
        item.id === id && item.quantity > 1
          ? { ...item, quantity: item.quantity - 1 } 
          : item
      ).filter(item => item.quantity > 0)
    );
  };
  
  // Remove item from cart
  const removeFromCart = (productId: string) => {
    setCart(prevCart => prevCart.filter(item => item.id !== productId));
  };
  
  const cartTotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);

  if (checkoutViewState !== 'idle') {
    return (
      <ShopContainer>
        <ShopTitle>Checkout Status</ShopTitle>

        <StatusCard>
          {checkoutViewState === 'loading' && (
            <>
              <StatusHeading>Verifying your order...</StatusHeading>
              <StatusText>
                We are confirming your payment with Stripe now. This should only take a moment.
              </StatusText>
            </>
          )}

          {checkoutViewState === 'success' && checkoutSession && (
            <>
              <StatusHeading>Order received</StatusHeading>
              <StatusText>
                Your payment was confirmed successfully. Keep your reference below for support.
              </StatusText>

              <ReceiptRow>
                <ReceiptLabel>Amount paid</ReceiptLabel>
                <ReceiptValue>
                  {formatCheckoutAmount(checkoutSession.amountTotal, checkoutSession.currency)}
                </ReceiptValue>
              </ReceiptRow>
              <ReceiptRow>
                <ReceiptLabel>Email</ReceiptLabel>
                <ReceiptValue>{checkoutSession.customerEmail || 'Not provided'}</ReceiptValue>
              </ReceiptRow>
              <ReceiptRow>
                <ReceiptLabel>Session reference</ReceiptLabel>
                <ReceiptValue>{checkoutSession.sessionId}</ReceiptValue>
              </ReceiptRow>
            </>
          )}

          {checkoutViewState === 'unverified' && checkoutSession && (
            <>
              <StatusHeading>Payment not confirmed yet</StatusHeading>
              <StatusText>
                We could not confirm this checkout as paid. If you believe payment went through, contact support
                with the reference below.
              </StatusText>
              <ReceiptRow>
                <ReceiptLabel>Session reference</ReceiptLabel>
                <ReceiptValue>{checkoutSession.sessionId}</ReceiptValue>
              </ReceiptRow>
            </>
          )}

          {checkoutViewState === 'cancelled' && (
            <>
              <StatusHeading>Checkout cancelled</StatusHeading>
              <StatusText>Your order was not completed. You can continue shopping and try again anytime.</StatusText>
            </>
          )}

          {checkoutViewState === 'error' && (
            <>
              <StatusHeading>Unable to verify checkout</StatusHeading>
              <StatusText>
                {checkoutError || 'We could not verify your payment. Please try again or contact support.'}
              </StatusText>
            </>
          )}

          <StatusButtonRow>
            <StatusActionButton onClick={handleContinueShopping}>
              Continue Shopping
            </StatusActionButton>
            <StatusSecondaryButton onClick={handleBackHome}>
              Back Home
            </StatusSecondaryButton>
          </StatusButtonRow>
        </StatusCard>
      </ShopContainer>
    );
  }
  
  return (
    <ShopContainer>
      <ShopTitle>Luvio Shop</ShopTitle>
      
      {!showCheckout ? (
        <>
          <ProductGrid>
            {products.map(product => (
              <ProductCard key={product.id}>
                <ProductImage color={product.color}>{product.name}</ProductImage>
                <ProductTitle>{product.name}</ProductTitle>
                <ProductPrice>{formatCurrency(product.price)}</ProductPrice>
                <ProductDescription>{product.description}</ProductDescription>
                <AddToCartButton onClick={() => addToCart(product)}>
                  Add to Cart
                </AddToCartButton>
              </ProductCard>
            ))}
          </ProductGrid>
          
          <CartSection>
            <CartTitle>Your Cart</CartTitle>
            
            {cart.length === 0 ? (
              <CartEmpty>Your cart is empty</CartEmpty>
            ) : (
              <>
                {cart.map(item => (
                  <CartItem key={item.id}>
                    <CartItemInfo>
                      <CartItemColor color={item.color} />
                      <CartItemName>{item.name}</CartItemName>
                    </CartItemInfo>
                    
                    <CartItemQuantity>
                      <QuantityButton onClick={() => decreaseQuantity(item.id)}>-</QuantityButton>
                      <QuantityText>{item.quantity}</QuantityText>
                      <QuantityButton onClick={() => increaseQuantity(item.id)}>+</QuantityButton>
                    </CartItemQuantity>
                    
                    <CartItemPrice>{formatCurrency(item.price * item.quantity)}</CartItemPrice>
                    
                    <RemoveButton 
                      onClick={() => removeFromCart(item.id)}
                      title="Remove item from cart"
                    >
                      🗑️
                    </RemoveButton>
                  </CartItem>
                ))}
                
                <CartTotal>
                  <CartTotalText>Total</CartTotalText>
                  <CartTotalPrice>{formatCurrency(cartTotal)}</CartTotalPrice>
                </CartTotal>
                
                <CheckoutButton onClick={() => setShowCheckout(true)}>
                  Proceed to Checkout
                </CheckoutButton>
              </>
            )}
          </CartSection>
        </>
      ) : (
        <CheckoutSection>
          <button 
            onClick={() => setShowCheckout(false)}
            style={{ 
              background: 'transparent', 
              border: 'none', 
              color: '#e9e2c8', 
              cursor: 'pointer',
              marginBottom: '1rem',
              display: 'flex',
              alignItems: 'center'
            }}
          >
            ← Back to Shop
          </button>
          
          <PaymentFormContainer>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', color: '#e9e2c8' }}>Secure Checkout</h3>
            
            {cart.map(item => (
              <CartItem key={item.id}>
                <CartItemInfo>
                  <CartItemColor color={item.color} />
                  <CartItemName>{item.name} × {item.quantity}</CartItemName>
                </CartItemInfo>
                <CartItemPrice>{formatCurrency(item.price * item.quantity)}</CartItemPrice>
              </CartItem>
            ))}
            
            <CartTotal>
              <CartTotalText>Total</CartTotalText>
              <CartTotalPrice>{formatCurrency(cartTotal)}</CartTotalPrice>
            </CartTotal>
            
            {stripeConfigured ? (
              <StripeHostedCheckout cartItems={cart} total={cartTotal} />
            ) : (
              <div style={{ color: '#e74c3c', padding: '1rem', textAlign: 'center' }}>
                Stripe is not configured. Please add your Stripe publishable key to the .env file.
              </div>
            )}
          </PaymentFormContainer>
        </CheckoutSection>
      )}
    </ShopContainer>
  );
};

export default Shop;
