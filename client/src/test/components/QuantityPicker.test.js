import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import QuantityPicker from "../../components/QuantityPicker";
import { CartContext } from "../../context/CartProvider";

let contextValue;
let user;

beforeEach(() => {
  contextValue = { addCartItem: jest.fn(), removeCartItem: jest.fn() };

  render(
    <CartContext.Provider value={contextValue}>
      <QuantityPicker id={1} quantity={3} />
    </CartContext.Provider>
  );

  user = userEvent.setup();
});

test("renders QuantityPicker component with initial quantity", () => {
  const minusButton = screen.getByText("−");
  const input = screen.getByDisplayValue("3");
  const plusButton = screen.getByText("+");

  expect(minusButton).toBeInTheDocument();
  expect(input).toHaveValue("3");
  expect(plusButton).toBeInTheDocument();
});

test("calls removeCartItem when minus button is clicked", async () => {
  const minusButton = screen.getByText("−");

  await user.click(minusButton);

  expect(contextValue.removeCartItem).toHaveBeenCalledWith(1);
});

test("calls addCartItem when plus button is clicked", async () => {
  const plusButton = screen.getByText("+");

  await user.click(plusButton);

  expect(contextValue.addCartItem).toHaveBeenCalledWith(1);
});
