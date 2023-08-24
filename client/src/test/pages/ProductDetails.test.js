import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Router, { MemoryRouter } from "react-router-dom";
import ProductDetails from "../../pages/ProductDetails";
import { getProductById } from "../../api/productService";
import { UserContext } from "../../context/UserProvider";
import { CartContext } from "../../context/CartProvider";

jest.mock("../../api/productService");

const mockUseParams = jest.fn();

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),

  useParams: () => mockUseParams,
}));

let user;

beforeEach(() => {
  user = userEvent.setup();
});

test("renders product details page", async () => {
  jest.spyOn(Router, "useParams").mockReturnValue({ id: "1" });
  getProductById.mockResolvedValueOnce({
    id: 1,
    name: "Test product",
    image: "test.jpg",
    description: '[{"Description": "Test description"}]',
    price: 10.0,
  });

  render(
    <MemoryRouter>
      <UserContext.Provider value={{ user: null }}>
        <CartContext.Provider
          value={{ addCartItem: jest.fn(), getCartItemByProductId: jest.fn() }}
        >
          <ProductDetails />
        </CartContext.Provider>
      </UserContext.Provider>
    </MemoryRouter>
  );

  await waitFor(() => {
    const name = screen.getByText("Test product");
    const price = screen.getByText("$10");
    const descriptionTitle = screen.getByText("Description");
    const descriptionContent = screen.getByText("Test description");
    const addToCartButton = screen.getByText("Add to Cart");

    expect(name).toBeInTheDocument();
    expect(price).toBeInTheDocument();
    expect(descriptionTitle).toBeInTheDocument();
    expect(descriptionContent).toBeInTheDocument();
    expect(addToCartButton).toBeInTheDocument();
  });
});

test("gives error when the product with the given id is not found", async () => {
  jest.spyOn(Router, "useParams").mockReturnValue({ id: "1" });
  const error = "Product with id 1 is not found";
  getProductById.mockRejectedValueOnce("Error getting product by id:" + error);

  render(
    <MemoryRouter>
      <UserContext.Provider value={{ user: null }}>
        <CartContext.Provider
          value={{ addCartItem: jest.fn(), getCartItemByProductId: jest.fn() }}
        >
          <ProductDetails />
        </CartContext.Provider>
      </UserContext.Provider>
    </MemoryRouter>
  );

  await waitFor(() => {
    expect(screen.queryByText("Test product")).toBeNull();
    expect(screen.queryByText("$10")).toBeNull();
    expect(screen.queryByText("Description")).toBeNull();
    expect(screen.queryByText("Test description")).toBeNull();
    expect(screen.queryByText("Add to Cart")).toBeNull();
  });
});
