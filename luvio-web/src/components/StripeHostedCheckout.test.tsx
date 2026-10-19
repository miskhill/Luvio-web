import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { apiService, CartItem } from "../services/api";
import StripeHostedCheckout from "./StripeHostedCheckout";

afterEach(() => {
  jest.restoreAllMocks();
});

test("passes catalog item ids and quantities to the existing checkout session API", async () => {
  const cartItems: CartItem[] = [
    { id: "band-pack", name: "Pack of 3 Luvio bands", color: "pack", price: 6, quantity: 2 },
  ];
  const checkoutSpy = jest
    .spyOn(apiService, "createCheckoutSession")
    .mockRejectedValue(new Error("Safe test stop before redirect"));

  render(
    <StripeHostedCheckout
      cartItems={cartItems}
      total={12}
      shippingSummary={{ id: "standard", displayName: "Postage", amount: 1.5, currency: "gbp" }}
    />
  );

  fireEvent.click(screen.getByRole("button", { name: /continue to stripe/i }));

  await waitFor(() => {
    expect(checkoutSpy).toHaveBeenCalledWith(
      cartItems,
      expect.stringContaining("checkout=success"),
      expect.stringContaining("checkout=cancelled")
    );
  });
  expect(await screen.findByRole("alert")).toHaveTextContent("Safe test stop before redirect");
});
