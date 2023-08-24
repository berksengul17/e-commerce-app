import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";
import { CartContext } from "../../context/CartProvider";
import Cart from "../../pages/Cart";

jest.mock("../../components/CartItem", () => {
  return jest.fn(() => <div data-testid="cart-item" />);
});

const mockCartItems = [
  { id: 1, product: { name: "Product 1", price: 10 }, quantity: 1 },
  { id: 2, product: { name: "Product 2", price: 20 }, quantity: 1 },
];

const mockTotalCartPrice = 30;

const mockedUseNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),

  useNavigate: () => mockedUseNavigate,
}));

let user;

beforeEach(() => {
  user = userEvent.setup();
});

test("renders cart items and total price correctly", () => {
  render(
    <CartContext.Provider
      value={{
        cartItems: mockCartItems,
        totalCartPrice: mockTotalCartPrice,
      }}
    >
      <Cart />
    </CartContext.Provider>
  );

  const cartHeading = screen.getByRole("heading", { level: 2 });
  expect(cartHeading.textContent).toBe("Cart (2 items)");

  const cartItemElements = screen.getAllByTestId("cart-item");
  expect(cartItemElements).toHaveLength(mockCartItems.length);

  const totalPriceElement = screen.getByText(
    `Total price: $${mockTotalCartPrice.toFixed(2)}`
  );
  expect(totalPriceElement).toBeInTheDocument();
});

test("navigates to checkout page on checkout button click", async () => {
  render(
    <CartContext.Provider
      value={{ cartItems: mockCartItems, totalCartPrice: mockTotalCartPrice }}
    >
      <Cart />
    </CartContext.Provider>
  );

  const checkoutButton = screen.getByText("Checkout");
  await user.click(checkoutButton);

  expect(mockedUseNavigate).toHaveBeenCalledWith("/checkout", {
    state: { from: "cart" },
  });
});
