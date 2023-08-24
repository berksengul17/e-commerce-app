import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { CartProvider, CartContext } from "../../context/CartProvider";
import { UserContext } from "../../context/UserProvider";
import * as cartService from "../../api/cartService";

const mockUser = {
  id: 1,
  name: "Test User",
  email: "test@example.com",
};

const mockCartItem = {
  id: 1,
  product: {
    id: 1,
    name: "Test Product",
    price: 20.0,
    image: "test-image.jpg",
  },
  quantity: 3,
};

const mockGetCartByUserId = jest.spyOn(cartService, "getCartByUserId");
const mockGetTotalPrice = jest.spyOn(cartService, "getTotalPrice");
const mockAddItemToCart = jest.spyOn(cartService, "addItemToCart");
const mockRemoveItemFromCart = jest.spyOn(cartService, "removeItemFromCart");
const mockDeleteItemFromCart = jest.spyOn(cartService, "deleleItemFromCart");
const mockClearCartItems = jest.spyOn(cartService, "clearCartItems");

let user;

beforeEach(() => {
  user = userEvent.setup();
});

afterEach(() => {
  jest.resetAllMocks();
});

test("CartProvider provides cart context with cart items and total price", async () => {
  mockGetCartByUserId.mockResolvedValue({ cartItems: [mockCartItem] });
  mockGetTotalPrice.mockResolvedValue(60);

  render(
    <UserContext.Provider value={{ user: mockUser }}>
      <CartProvider>
        <CartContext.Consumer>
          {(value) => (
            <>
              <div data-testid="cart-items">{value.cartItems.length}</div>
              <div data-testid="total-price">{value.totalCartPrice}</div>
            </>
          )}
        </CartContext.Consumer>
      </CartProvider>
    </UserContext.Provider>
  );

  await waitFor(() => {
    const cartItemsElement = screen.getByTestId("cart-items");
    const totalPriceElement = screen.getByTestId("total-price");

    expect(cartItemsElement.textContent).toBe("1");
    expect(totalPriceElement.textContent).toBe("60");
  });
});

test("CartProvider adds an item to cart", async () => {
  const newCartItem = {
    id: 2,
    product: {
      id: 2,
      name: "Test Product 2",
      price: 10.0,
      image: "test-image-2.jpg",
    },
    quantity: 2,
  };

  mockGetCartByUserId.mockResolvedValue({ cartItems: [mockCartItem] });
  mockGetTotalPrice.mockResolvedValue(80);
  mockAddItemToCart.mockResolvedValue(newCartItem);

  render(
    <UserContext.Provider value={{ user: mockUser }}>
      <CartProvider>
        <CartContext.Consumer>
          {(value) => (
            <>
              <div data-testid="cart-items">{value.cartItems.length}</div>
              <div data-testid="total-price">{value.totalCartPrice}</div>
              <button onClick={() => value.addCartItem(2)}>Add to Cart</button>
            </>
          )}
        </CartContext.Consumer>
      </CartProvider>
    </UserContext.Provider>
  );

  await user.click(screen.getByText("Add to Cart"));
  const cartItemsElement = await screen.findByTestId("cart-items");
  const totalPriceElement = await screen.findByTestId("total-price");

  expect(cartItemsElement.textContent).toBe("2");
  expect(totalPriceElement.textContent).toBe("80");
});

test("CartProvider removes an item from cart", async () => {
  mockGetCartByUserId.mockResolvedValue({ cartItems: [mockCartItem] });
  mockGetTotalPrice.mockResolvedValue(40);
  mockRemoveItemFromCart.mockResolvedValue({
    cartItems: [
      {
        id: 1,
        product: {
          id: 1,
          name: "Test Product",
          price: 20.0,
          image: "test-image.jpg",
        },
        quantity: 2,
      },
    ],
  });

  render(
    <UserContext.Provider value={{ user: mockUser }}>
      <CartProvider>
        <CartContext.Consumer>
          {(value) => (
            <>
              <div data-testid="cart-items">{value.cartItems.length}</div>
              <div data-testid="quantity">
                {value.cartItems[0] ? value.cartItems[0].quantity : ""}
              </div>
              <div data-testid="total-price">{value.totalCartPrice}</div>
              <button onClick={() => value.removeCartItem(1)}>
                Remove from Cart
              </button>
            </>
          )}
        </CartContext.Consumer>
      </CartProvider>
    </UserContext.Provider>
  );

  await user.click(screen.getByText("Remove from Cart"));
  const cartItemsElement = await screen.findByTestId("cart-items");
  const quantityElement = await screen.findByTestId("quantity");
  const totalPriceElement = await screen.findByTestId("total-price");

  expect(cartItemsElement.textContent).toBe("1");
  expect(quantityElement.textContent).toBe("2");
  expect(totalPriceElement.textContent).toBe("40");
});

test("CartProvider removes an item from cart", async () => {
  mockGetCartByUserId.mockResolvedValue({ cartItems: [mockCartItem] });
  mockGetTotalPrice.mockResolvedValue(0);
  mockDeleteItemFromCart.mockResolvedValue({ cartItems: [] });

  render(
    <UserContext.Provider value={{ user: mockUser }}>
      <CartProvider>
        <CartContext.Consumer>
          {(value) => (
            <>
              <div data-testid="cart-items">{value.cartItems.length}</div>
              <div data-testid="total-price">{value.totalCartPrice}</div>
              <button onClick={() => value.deleteCartItem(1)}>
                Delete from Cart
              </button>
            </>
          )}
        </CartContext.Consumer>
      </CartProvider>
    </UserContext.Provider>
  );

  await user.click(screen.getByText("Delete from Cart"));
  const cartItemsElement = await screen.findByTestId("cart-items");
  const totalPriceElement = await screen.findByTestId("total-price");

  expect(cartItemsElement.textContent).toBe("0");
  expect(totalPriceElement.textContent).toBe("0");
});

test("CartProvider deletes an item from cart", async () => {
  mockGetCartByUserId.mockResolvedValue({ cartItems: [mockCartItem] });
  mockGetTotalPrice.mockResolvedValue(40);
  mockRemoveItemFromCart.mockResolvedValue({
    cartItems: [
      {
        id: 1,
        product: {
          id: 1,
          name: "Test Product",
          price: 20.0,
          image: "test-image.jpg",
        },
        quantity: 2,
      },
    ],
  });

  render(
    <UserContext.Provider value={{ user: mockUser }}>
      <CartProvider>
        <CartContext.Consumer>
          {(value) => (
            <>
              <div data-testid="cart-items">{value.cartItems.length}</div>
              <div data-testid="quantity">
                {value.cartItems[0] ? value.cartItems[0].quantity : ""}
              </div>
              <div data-testid="total-price">{value.totalCartPrice}</div>
              <button onClick={() => value.removeCartItem(1)}>
                Remove from Cart
              </button>
            </>
          )}
        </CartContext.Consumer>
      </CartProvider>
    </UserContext.Provider>
  );

  await user.click(screen.getByText("Remove from Cart"));
  const cartItemsElement = await screen.findByTestId("cart-items");
  const quantityElement = await screen.findByTestId("quantity");
  const totalPriceElement = await screen.findByTestId("total-price");

  expect(cartItemsElement.textContent).toBe("1");
  expect(quantityElement.textContent).toBe("2");
  expect(totalPriceElement.textContent).toBe("40");
});

test("CartProvider clears cart", async () => {
  mockGetCartByUserId.mockResolvedValue({
    cartItems: [
      mockCartItem,
      {
        id: 2,
        product: {
          id: 2,
          name: "Test Product 2",
          price: 10.0,
          image: "test-image-2.jpg",
        },
        quantity: 1,
      },
    ],
  });
  mockGetTotalPrice.mockResolvedValue(0);
  mockClearCartItems.mockResolvedValue({ cartItems: [] });

  render(
    <UserContext.Provider value={{ user: mockUser }}>
      <CartProvider>
        <CartContext.Consumer>
          {(value) => (
            <>
              <div data-testid="cart-items">{value.cartItems.length}</div>
              <div data-testid="total-price">{value.totalCartPrice}</div>
              <button onClick={() => value.clearCart(user.id)}>
                Clear Cart
              </button>
            </>
          )}
        </CartContext.Consumer>
      </CartProvider>
    </UserContext.Provider>
  );

  await user.click(screen.getByText("Clear Cart"));
  const cartItemsElement = await screen.findByTestId("cart-items");
  const totalPriceElement = await screen.findByTestId("total-price");

  expect(cartItemsElement.textContent).toBe("0");
  expect(totalPriceElement.textContent).toBe("0");
});
