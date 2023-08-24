import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import CartItem from "../../components/CartItem";
import { CartContext } from "../../context/CartProvider";

const mockCartItem = {
  product: {
    id: 1,
    name: "Test Product",
    price: 20.0,
    image: "test-image.jpg",
  },
  quantity: 3,
};

const mockDeleteCartItem = jest.fn();

const cartContext = {
  deleteCartItem: mockDeleteCartItem,
};

let user;

beforeEach(() => {
  user = userEvent.setup();
});

test("renders CartItem component with correct details", () => {
  render(
    <CartContext.Provider value={cartContext}>
      <CartItem cartItem={mockCartItem} />
    </CartContext.Provider>
  );

  const productName = screen.getByText(mockCartItem.product.name);
  const productPrice = screen.getByText(`$60.00`);
  const quantityPicker = screen.getByDisplayValue("3");
  const removeButton = screen.getByRole("button", { name: "Remove" });

  expect(productName).toBeInTheDocument();
  expect(productPrice).toBeInTheDocument();
  expect(quantityPicker).toBeInTheDocument();
  expect(removeButton).toBeInTheDocument();
});

test("calls deleteCartItem when Remove button is clicked", async () => {
  render(
    <CartContext.Provider value={cartContext}>
      <CartItem cartItem={mockCartItem} />
    </CartContext.Provider>
  );

  const removeButton = screen.getByRole("button", { name: "Remove" });
  await user.click(removeButton);

  expect(mockDeleteCartItem).toHaveBeenCalledTimes(1);
  expect(mockDeleteCartItem).toHaveBeenCalledWith(mockCartItem.product.id);
});
