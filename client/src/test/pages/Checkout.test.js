import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { CartContext } from "../../context/CartProvider";
import { UserContext } from "../../context/UserProvider";
import Checkout from "../../pages/Checkout";

const mockUseNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),

  useNavigate: () => mockUseNavigate,
}));

const mockUser = { id: 1, name: "Test User" };
const mockCartItems = [
  { id: 1, product: { name: "Product 1", price: 10 }, quantity: 2 },
  { id: 2, product: { name: "Product 2", price: 20 }, quantity: 3 },
];
const mockTotalCartPrice = 80;
const mockClearCart = jest.fn();

const mockFormData = {
  creditCardNumber: "4305468112193548",
  expirationMonth: "10",
  expirationYear: "29",
  cvv: "123",
  address: "teknopark urla/izmir",
};

let user;

beforeEach(() => {
  user = userEvent.setup();
});

test("renders Checkout page", () => {
  render(
    <UserContext.Provider value={{ user: mockUser }}>
      <CartContext.Provider
        value={{
          cartItems: mockCartItems,
          totalCartPrice: mockTotalCartPrice,
          clearCart: mockClearCart,
        }}
      >
        <Checkout />
      </CartContext.Provider>
    </UserContext.Provider>
  );

  const orderSummaryHeading = screen.getByText("Order Summary");
  const totalPriceText = screen.getByText("Total: $80.00");
  const creditCardInput = screen.getByPlaceholderText("Credit Card Number");
  const expirationMonthInput = screen.getByPlaceholderText("MM");
  const expirationYearInput = screen.getByPlaceholderText("YY");
  const cvvInput = screen.getByPlaceholderText("CVV");
  const addressInput = screen.getByPlaceholderText("Address");

  expect(orderSummaryHeading).toBeInTheDocument();
  expect(totalPriceText).toBeInTheDocument();
  expect(creditCardInput).toBeInTheDocument();
  expect(expirationMonthInput).toBeInTheDocument();
  expect(expirationYearInput).toBeInTheDocument();
  expect(cvvInput).toBeInTheDocument();
  expect(addressInput).toBeInTheDocument();
});

test("submits the form and navigates to success page", async () => {
  render(
    <UserContext.Provider value={{ user: mockUser }}>
      <CartContext.Provider
        value={{
          cartItems: mockCartItems,
          totalCartPrice: mockTotalCartPrice,
          clearCart: mockClearCart,
        }}
      >
        <Checkout />
      </CartContext.Provider>
    </UserContext.Provider>
  );

  const creditCardInput = screen.getByPlaceholderText("Credit Card Number");
  await user.type(creditCardInput, mockFormData.creditCardNumber);

  const expirationMonthInput = screen.getByPlaceholderText("MM");
  await user.type(expirationMonthInput, mockFormData.expirationMonth);

  const expirationYearInput = screen.getByPlaceholderText("YY");
  await user.type(expirationYearInput, mockFormData.expirationYear);

  const cvvInput = screen.getByPlaceholderText("CVV");
  await user.type(cvvInput, mockFormData.cvv);

  const addressInput = screen.getByPlaceholderText("Address");
  await user.type(addressInput, mockFormData.address);

  await user.click(screen.getByText("Submit"));

  expect(mockUseNavigate).toHaveBeenCalledWith("/success", {
    state: { from: "checkout" },
  });
  expect(mockClearCart).toHaveBeenCalledWith(mockUser.id);
});

test("displays validation errors for invalid input", async () => {
  render(
    <UserContext.Provider value={{ user: mockUser }}>
      <CartContext.Provider
        value={{
          cartItems: mockCartItems,
          totalCartPrice: mockTotalCartPrice,
          clearCart: mockClearCart,
        }}
      >
        <Checkout />
      </CartContext.Provider>
    </UserContext.Provider>
  );

  await user.click(screen.getByText("Submit"));

  await waitFor(() => {
    expect(
      screen.getByText("Credit card number is required")
    ).toBeInTheDocument();
    expect(
      screen.getByText("Expiration month is required")
    ).toBeInTheDocument();
    expect(screen.getByText("Expiration year is required")).toBeInTheDocument();
    expect(screen.getByText("CVV is required")).toBeInTheDocument();
    expect(screen.getByText("Address is required")).toBeInTheDocument();
  });
});
