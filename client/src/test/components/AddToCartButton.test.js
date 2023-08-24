import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import AddToCartButton from "../../components/AddToCartButton";
import { UserContext } from "../../context/UserProvider";
import { CartContext } from "../../context/CartProvider";
import { MemoryRouter } from "react-router-dom";

const mockUseNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),

  useNavigate: () => mockUseNavigate,
}));

const mockProduct = {
  id: 1,
  name: "Test Product",
  price: 20.0,
  image: "test-image.jpg",
};

const mockCartItem = {
  id: 1,
  product: mockProduct,
  quantity: 3,
};

const mockUser = {
  id: 1,
  name: "Berk Şengül",
  email: "berk@gmail.com",
};

const userContext = { user: mockUser };
const cartContext = {
  addCartItem: jest.fn(),
  getCartItemByProductId: jest.fn().mockReturnValue(mockCartItem),
};

let user;

beforeEach(() => {
  user = userEvent.setup();
});

test("renders AddToCartButton component with correct text when logged in", async () => {
  render(
    <MemoryRouter>
      <UserContext.Provider value={userContext}>
        <CartContext.Provider value={cartContext}>
          <AddToCartButton productId={mockProduct.id} />;
        </CartContext.Provider>
      </UserContext.Provider>
    </MemoryRouter>
  );

  await waitFor(() => {
    const addToCartButton = screen.getByRole("button", {
      name: "Add to Cart (3)",
    });
    expect(addToCartButton).toBeInTheDocument();
  });
});

test("renders AddToCartButton component with correct text when not logged in", () => {
  render(
    <MemoryRouter>
      <UserContext.Provider value={{ user: null }}>
        <CartContext.Provider value={cartContext}>
          <AddToCartButton productId={mockProduct.id} />;
        </CartContext.Provider>
      </UserContext.Provider>
    </MemoryRouter>
  );

  const addToCartButton = screen.getByRole("button", { name: "Add to Cart" });
  expect(addToCartButton).toBeInTheDocument();
});

test("calls addCartItem when Add to Cart button is clicked", async () => {
  render(
    <MemoryRouter>
      <UserContext.Provider value={userContext}>
        <CartContext.Provider value={cartContext}>
          <AddToCartButton productId={mockProduct.id} />;
        </CartContext.Provider>
      </UserContext.Provider>
    </MemoryRouter>
  );

  const addToCartButton = screen.getByRole("button", {
    name: "Add to Cart (3)",
  });
  await user.click(addToCartButton);

  expect(cartContext.addCartItem).toHaveBeenCalledTimes(1);
  expect(cartContext.addCartItem).toHaveBeenCalledWith(1);
});

test("navigates to login page when user is not logged in", async () => {
  render(
    <MemoryRouter>
      <UserContext.Provider value={{ user: null }}>
        <CartContext.Provider value={cartContext}>
          <AddToCartButton productId={mockProduct.id} />;
        </CartContext.Provider>
      </UserContext.Provider>
    </MemoryRouter>
  );

  const addToCartButton = screen.getByRole("button", { name: "Add to Cart" });
  await user.click(addToCartButton);

  expect(mockUseNavigate).toHaveBeenCalledTimes(1);
  expect(mockUseNavigate).toHaveBeenCalledWith("/login");
});
