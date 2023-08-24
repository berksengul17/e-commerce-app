import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { UserContext } from "../../context/UserProvider";
import Header from "../../components/Header";

const mockUseNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),

  useNavigate: () => mockUseNavigate,
}));

let user;

beforeEach(() => {
  user = userEvent.setup();
});

afterEach(() => {
  jest.clearAllMocks();
});

test("renders Header with correct elements", () => {
  render(
    <MemoryRouter>
      <UserContext.Provider value={{ user: null }}>
        <Header />
      </UserContext.Provider>
    </MemoryRouter>
  );

  const houseIcon = screen.getByTestId("house-icon");
  expect(houseIcon).toBeInTheDocument();

  const loginButton = screen.getByRole("button", { name: "Login" });
  const signUpButton = screen.getByRole("button", { name: "Sign up" });
  expect(loginButton).toBeInTheDocument();
  expect(signUpButton).toBeInTheDocument();
});

test("renders user-related elements when user is logged in", () => {
  const userContextValue = { user: { id: 1, name: "Test User" } };
  render(
    <MemoryRouter>
      <UserContext.Provider value={userContextValue}>
        <Header />
      </UserContext.Provider>
    </MemoryRouter>
  );

  const houseIcon = screen.getByTestId("house-icon");
  expect(houseIcon).toBeInTheDocument();

  const cartIcon = screen.getByTestId("cart-icon");
  expect(cartIcon).toBeInTheDocument();

  const logoutButton = screen.getByRole("button", { name: "Logout" });
  expect(logoutButton).toBeInTheDocument();
});

test("navigates to login page when Login button is clicked", async () => {
  const userContextValue = { user: null };
  render(
    <MemoryRouter>
      <UserContext.Provider value={userContextValue}>
        <Header />
      </UserContext.Provider>
    </MemoryRouter>
  );

  const loginButton = screen.getByRole("button", { name: "Login" });
  await user.click(loginButton);

  expect(mockUseNavigate).toHaveBeenCalledTimes(1);
  expect(mockUseNavigate).toHaveBeenCalledWith("/login");
});

test("navigates to sign up page when Sign up button is clicked", async () => {
  const userContextValue = { user: null };
  render(
    <MemoryRouter>
      <UserContext.Provider value={userContextValue}>
        <Header />
      </UserContext.Provider>
    </MemoryRouter>
  );

  const signUpButton = screen.getByRole("button", { name: "Sign up" });
  await user.click(signUpButton);

  expect(mockUseNavigate).toHaveBeenCalledTimes(1);
  expect(mockUseNavigate).toHaveBeenCalledWith("/signUp");
});

test("navigates to cart when cart icon is clicked", () => {
  const userContextValue = { user: { id: 1, name: "Test User" } };

  render(
    <MemoryRouter>
      <UserContext.Provider value={userContextValue}>
        <Header />
      </UserContext.Provider>
    </MemoryRouter>
  );

  const cartIcon = screen.getByTestId("cart-icon");
  expect(cartIcon.parentElement.getAttribute("href")).toBe("/cart");
});

test("logs out when Logout button is clicked", async () => {
  const userContextValue = {
    user: { id: 1, name: "Test User" },
    logoutUser: () => (userContextValue.user = null),
  };

  render(
    <MemoryRouter>
      <UserContext.Provider value={userContextValue}>
        <Header />
      </UserContext.Provider>
    </MemoryRouter>
  );

  const logoutButton = screen.getByText("Logout");
  await user.click(logoutButton);

  expect(userContextValue.user).toBe(null);
  expect(mockUseNavigate).toHaveBeenCalledTimes(1);
  expect(mockUseNavigate).toHaveBeenCalledWith("/");
});
