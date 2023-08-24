import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { getAllProducts } from "../../api/productService";
import { MemoryRouter } from "react-router-dom";
import { UserContext } from "../../context/UserProvider";
import { CartContext } from "../../context/CartProvider";
import ProductList from "../../components/ProductList";

jest.mock("../../api/productService");

const mockProducts = [
  {
    id: 1,
    name: "Product 1",
    price: 10.0,
  },
  {
    id: 2,
    name: "Product 2",
    price: 15.0,
  },
];

const cartContext = {
  getCartItemByProductId: jest.fn(),
};

test("renders ProductList component with fetched products", async () => {
  getAllProducts.mockResolvedValue(mockProducts);

  render(
    <MemoryRouter>
      <UserContext.Provider value={{ user: null }}>
        <CartContext.Provider value={cartContext}>
          <ProductList />
        </CartContext.Provider>
      </UserContext.Provider>
    </MemoryRouter>
  );

  await waitFor(() => {
    const productElements = screen.getAllByRole("link", { name: /Product \d/ });
    expect(productElements).toHaveLength(mockProducts.length);

    mockProducts.forEach((product, index) => {
      expect(productElements[index]).toHaveAttribute(
        "href",
        `/products/${product.id}`
      );
      expect(screen.getByText(product.name)).toBeInTheDocument();
      expect(screen.getByText(`$${product.price}`)).toBeInTheDocument();
    });
  });
});
