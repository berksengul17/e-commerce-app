import React from "react";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Product from "../../components/Product";
import { UserContext } from "../../context/UserProvider";
import { CartContext } from "../../context/CartProvider";

const mockProduct = {
  id: 1,
  name: "Test Product",
  price: 20.0,
  image: "test-image.jpg",
};

const userContext = { user: null };
const cartContext = {
  addCartItem: jest.fn(),
  getCartItemByProductId: jest.fn(),
};

beforeEach(() => {
  render(
    <MemoryRouter>
      <UserContext.Provider value={userContext}>
        <CartContext.Provider value={cartContext}>
          <Product product={mockProduct} />
        </CartContext.Provider>
      </UserContext.Provider>
    </MemoryRouter>
  );
});

test("renders Product component with correct product details", () => {
  const productName = screen.getByText(mockProduct.name);
  const productPrice = screen.getByText(`$${mockProduct.price}`);
  const productImage = screen.getByAltText("product");

  expect(productName).toBeInTheDocument();
  expect(productPrice).toBeInTheDocument();
  expect(productImage).toBeInTheDocument();
});

test("renders a link to the product details page", () => {
  const productLink = screen.getByRole("link", { name: /Test Product/ });

  expect(productLink).toBeInTheDocument();
  expect(productLink.getAttribute("href")).toBe(`/products/${mockProduct.id}`);
});

test("renders the AddToCartButton component", () => {
  const addToCartButton = screen.getByRole("button", { name: "Add to Cart" });

  expect(addToCartButton).toBeInTheDocument();
});
