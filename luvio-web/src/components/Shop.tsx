import React, { useEffect, useState } from "react";
import { isStripeConfigured, formatCurrency } from "../utils/stripe";
import StripeHostedCheckout from "./StripeHostedCheckout";
import {
  apiService,
  CartItem as ShopCartItem,
  CheckoutSessionStatusResponse,
  ShopProduct,
  ShopShippingSummary,
} from "../services/api";
import "./Shop.scss";

type CheckoutViewState = "idle" | "loading" | "success" | "cancelled" | "unverified" | "error";

const productMessages: Record<string, string> = {
  "red-band": "Taken / not interested. Respect the signal and do not approach romantically.",
  "yellow-band": "Wait for my signal. The wearer makes the first move.",
  "green-band": "Open to talk. Come say hi.",
};

function formatCheckoutAmount(amount: number | null, currency: string | null): string {
  if (amount === null) return "N/A";
  if (!currency) return formatCurrency(amount);
  try {
    return new Intl.NumberFormat("en-GB", { style: "currency", currency: currency.toUpperCase() }).format(amount);
  } catch {
    return formatCurrency(amount);
  }
}

function formatAmountWithCurrency(amount: number, currency: string): string {
  try {
    return new Intl.NumberFormat("en-GB", { style: "currency", currency: currency.toUpperCase() }).format(amount);
  } catch {
    return formatCurrency(amount);
  }
}

function formatShippingSummary(shipping: ShopShippingSummary | null): string {
  if (!shipping) return "Postage and packaging will be calculated in Stripe Checkout.";
  if (shipping.amount === null || !shipping.currency) return `${shipping.displayName} will be added in Stripe Checkout.`;
  return `${shipping.displayName}: ${formatAmountWithCurrency(shipping.amount, shipping.currency)} added in Stripe Checkout.`;
}

const Shop = () => {
  const [products, setProducts] = useState<ShopProduct[]>([]);
  const [cart, setCart] = useState<ShopCartItem[]>([]);
  const [catalogLoading, setCatalogLoading] = useState(true);
  const [catalogError, setCatalogError] = useState<string | null>(null);
  const [shippingSummary, setShippingSummary] = useState<ShopShippingSummary | null>(null);
  const [checkoutEnabled, setCheckoutEnabled] = useState(true);
  const [checkoutDisabledReason, setCheckoutDisabledReason] = useState<string | null>(null);
  const [showCheckout, setShowCheckout] = useState(false);
  const [stripeConfigured, setStripeConfigured] = useState(false);
  const [checkoutViewState, setCheckoutViewState] = useState<CheckoutViewState>("idle");
  const [checkoutSession, setCheckoutSession] = useState<CheckoutSessionStatusResponse | null>(null);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);

  useEffect(() => {
    setStripeConfigured(isStripeConfigured());
    if (!isStripeConfigured()) console.warn("Stripe is not properly configured. Please check your environment variables.");

    const params = new URLSearchParams(window.location.search);
    const checkoutState = params.get("checkout");
    const legacyPaymentState = params.get("payment");
    const sessionId = params.get("session_id");
    const isSuccess = checkoutState === "success" || legacyPaymentState === "success";
    const isCancelled = checkoutState === "cancelled" || legacyPaymentState === "cancelled";
    let isMounted = true;

    if (isSuccess) {
      if (!sessionId) {
        setCheckoutViewState("error");
        setCheckoutError("Missing checkout session reference. Please contact support if you were charged.");
        return () => { isMounted = false; };
      }
      setCheckoutViewState("loading");
      apiService.getCheckoutSessionStatus(sessionId)
        .then((session) => {
          if (!isMounted) return;
          setCheckoutSession(session);
          if (session.verifiedPaid) {
            setCheckoutViewState("success");
            setShowCheckout(false);
            setCart([]);
          } else {
            setCheckoutViewState("unverified");
          }
        })
        .catch((error) => {
          if (!isMounted) return;
          setCheckoutViewState("error");
          setCheckoutError(error instanceof Error ? error.message : "Unable to verify your payment at the moment.");
        });
    } else if (isCancelled) {
      setCheckoutViewState("cancelled");
    }
    return () => { isMounted = false; };
  }, []);

  useEffect(() => {
    let isMounted = true;
    apiService.getCatalog()
      .then((catalog) => {
        if (!isMounted) return;
        setProducts(catalog.products);
        setShippingSummary(catalog.shippingOptions[0] || null);
        setCheckoutEnabled(catalog.checkoutEnabled);
        setCheckoutDisabledReason(catalog.checkoutDisabledReason);
        setCatalogError(null);
      })
      .catch((error) => {
        if (!isMounted) return;
        setCatalogError(error instanceof Error ? error.message : "Unable to load the shop right now.");
        setCheckoutEnabled(false);
        setCheckoutDisabledReason("The shop is temporarily unavailable.");
      })
      .finally(() => { if (isMounted) setCatalogLoading(false); });
    return () => { isMounted = false; };
  }, []);

  const handleContinueShopping = () => {
    const url = new URL(window.location.href);
    url.searchParams.delete("checkout");
    url.searchParams.delete("payment");
    url.searchParams.delete("session_id");
    const nextUrl = `${url.pathname}${url.searchParams.toString() ? `?${url.searchParams.toString()}` : ""}${url.hash}`;
    window.history.replaceState({}, document.title, nextUrl);
    setCheckoutViewState("idle");
    setCheckoutSession(null);
    setCheckoutError(null);
  };

  const addToCart = (product: ShopProduct) => {
    setCart((current) => {
      const existing = current.find((item) => item.id === product.id);
      return existing
        ? current.map((item) => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item)
        : [...current, { ...product, quantity: 1 }];
    });
  };
  const changeQuantity = (id: string, difference: number) => {
    setCart((current) => current.map((item) => item.id === id ? { ...item, quantity: Math.max(1, item.quantity + difference) } : item));
  };
  const removeFromCart = (id: string) => setCart((current) => current.filter((item) => item.id !== id));
  const cartTotal = cart.reduce((total, item) => total + item.price * item.quantity, 0);

  if (checkoutViewState !== "idle") {
    return (
      <main id="main-content" className="page shop-page shop-page--status">
        <header className="shop-heading"><p className="eyebrow">Your order</p><h1>Checkout status</h1></header>
        <section className="status-card" aria-live="polite">
          {checkoutViewState === "loading" && <><h2>Verifying your order…</h2><p>We are confirming your payment with Stripe. This should only take a moment.</p></>}
          {checkoutViewState === "success" && checkoutSession && <>
            <h2>Order received</h2><p>Your payment was confirmed successfully. Keep your reference below for support.</p>
            <dl className="receipt">
              <div><dt>Amount paid</dt><dd>{formatCheckoutAmount(checkoutSession.amountTotal, checkoutSession.currency)}</dd></div>
              <div><dt>Email</dt><dd>{checkoutSession.customerEmail || "Not provided"}</dd></div>
              <div><dt>Session reference</dt><dd>{checkoutSession.sessionId}</dd></div>
            </dl>
          </>}
          {checkoutViewState === "unverified" && checkoutSession && <><h2>Payment not confirmed yet</h2><p>If you believe payment went through, contact support with this reference: <strong>{checkoutSession.sessionId}</strong>.</p></>}
          {checkoutViewState === "cancelled" && <><h2>Checkout cancelled</h2><p>Your order was not completed. You can continue shopping and try again at any time.</p></>}
          {checkoutViewState === "error" && <><h2>Unable to verify checkout</h2><p>{checkoutError || "We could not verify your payment. Please contact support."}</p></>}
          <div className="button-row">
            <button className="button button--primary" type="button" onClick={handleContinueShopping}>Continue shopping</button>
            <button className="button button--secondary" type="button" onClick={() => { window.location.href = "/"; }}>Back home</button>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main id="main-content" className="page shop-page">
      <header className="page-intro shop-intro">
        <p className="eyebrow">Luvio shop</p>
        <h1 className="page-title">Choose the signal that suits you.</h1>
        <p className="page-lead">Buy an individual band or get the complete red, yellow and green set. Current prices come directly from our shop.</p>
      </header>

      {!showCheckout ? <div className="shop-layout">
        <section className="products-section" aria-labelledby="products-title">
          <div className="shop-section-heading"><h2 id="products-title">Wristbands</h2><span>Secure checkout with Stripe</span></div>
          {catalogLoading ? <div className="catalog-state" aria-live="polite">Loading current prices…</div> :
            catalogError ? <div className="catalog-state catalog-state--error" role="alert">{catalogError}</div> :
            <div className="product-grid">
              {products.map((product) => (
                <article className={`product-card product-card--${product.id}`} key={product.id}>
                  <div className="product-card__media">
                    {product.imageUrl ? <img src={product.imageUrl} alt={`${product.name} wristband`} /> : <span>{product.name}</span>}
                  </div>
                  <div className="product-card__body">
                    <div className="product-card__title-row"><h3>{product.name}</h3><strong>{formatCurrency(product.price)}</strong></div>
                    <p>{productMessages[product.id] || product.description}</p>
                    <button className="button button--secondary" type="button" onClick={() => addToCart(product)}>Add to cart</button>
                  </div>
                </article>
              ))}
            </div>}
        </section>

        <aside className="cart" aria-labelledby="cart-title">
          <div className="cart__heading"><h2 id="cart-title">Your cart</h2><span>{cart.reduce((total, item) => total + item.quantity, 0)} items</span></div>
          {cart.length === 0 ? <div className="cart__empty"><span aria-hidden="true">○</span><p>Your cart is empty.</p><small>Add a band to get started.</small></div> : <>
            <ul className="cart-list">
              {cart.map((item) => <li key={item.id}>
                <span className={`cart-swatch cart-swatch--${item.id}`} aria-hidden="true" />
                <div className="cart-item__main"><strong>{item.name}</strong><span>{formatCurrency(item.price)} each</span></div>
                <div className="quantity-control" aria-label={`Quantity for ${item.name}`}>
                  <button type="button" onClick={() => changeQuantity(item.id, -1)} aria-label={`Decrease ${item.name} quantity`}>−</button>
                  <span>{item.quantity}</span>
                  <button type="button" onClick={() => changeQuantity(item.id, 1)} aria-label={`Increase ${item.name} quantity`}>+</button>
                </div>
                <strong className="cart-item__price">{formatCurrency(item.price * item.quantity)}</strong>
                <button className="remove-button" type="button" onClick={() => removeFromCart(item.id)} aria-label={`Remove ${item.name} from cart`}>Remove</button>
              </li>)}
            </ul>
            <div className="cart-total"><span>Subtotal</span><strong>{formatCurrency(cartTotal)}</strong></div>
            <p className="cart-note">{formatShippingSummary(shippingSummary)}</p>
            {checkoutDisabledReason && <p className="cart-warning" role="alert">{checkoutDisabledReason}</p>}
            <button className="button button--primary cart__checkout" type="button" onClick={() => setShowCheckout(true)} disabled={!checkoutEnabled}>Review checkout</button>
          </>}
        </aside>
      </div> :
      <section className="checkout-review" aria-labelledby="checkout-review-title">
        <button className="back-button" type="button" onClick={() => setShowCheckout(false)}>← Back to shop</button>
        <div className="checkout-review__card">
          <p className="eyebrow">Order review</p><h2 id="checkout-review-title">Secure checkout</h2>
          <ul>{cart.map((item) => <li key={item.id}><span>{item.name} × {item.quantity}</span><strong>{formatCurrency(item.price * item.quantity)}</strong></li>)}</ul>
          <div className="cart-total"><span>Subtotal</span><strong>{formatCurrency(cartTotal)}</strong></div>
          <p className="cart-note">{formatShippingSummary(shippingSummary)}</p>
          {checkoutDisabledReason && <p className="cart-warning" role="alert">{checkoutDisabledReason}</p>}
          {stripeConfigured && checkoutEnabled ? <StripeHostedCheckout cartItems={cart} total={cartTotal} shippingSummary={shippingSummary} /> :
            <p className="cart-warning" role="alert">{checkoutDisabledReason || "Stripe checkout is not configured."}</p>}
        </div>
      </section>}
    </main>
  );
};

export default Shop;
