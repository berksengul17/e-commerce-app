import { MemoryRouter } from "react-router-dom";
import { render, screen } from "@testing-library/react";
import Header from "../components/Header";
import Cart from "../pages/Cart";
import Checkout from "../pages/Checkout";
import Home from "../pages/Home";
import Login from "../pages/Login";
import ProductDetails from "../pages/ProductDetails";
import SignUp from "../pages/SignUp";
import Success from "../pages/Success";
import App from "../App";
import { UserContext } from "../context/UserProvider";

jest.mock("../components/Header");
jest.mock("../pages/Cart");
jest.mock("../pages/Checkout");
jest.mock("../pages/Home");
jest.mock("../pages/Login");
jest.mock("../pages/ProductDetails");
jest.mock("../pages/SignUp");
jest.mock("../pages/Success");

Header.mockImplementation(() => <div>Header</div>);
Cart.mockImplementation(() => <div>Cart</div>);
Checkout.mockImplementation(() => <div>Checkout</div>);
Home.mockImplementation(() => <div>Home</div>);
Login.mockImplementation(() => <div>Login</div>);
ProductDetails.mockImplementation(() => <div>Product Details</div>);
SignUp.mockImplementation(() => <div>Sign up</div>);
Success.mockImplementation(() => <div>Success</div>);

const mockUser = {
  id: 1,
  name: "Test User",
  email: "test@example.com",
};

test("should render home page when not logged in", () => {
  render(
    <MemoryRouter>
      <UserContext.Provider value={{ user: null }}>
        <App />
      </UserContext.Provider>
    </MemoryRouter>
  );

  expect(screen.getByText("Header")).toBeInTheDocument();
  expect(screen.getByText("Home")).toBeInTheDocument();
});

test("should render home page when not logged in", () => {
  render(
    <MemoryRouter>
      <UserContext.Provider value={{ user: mockUser }}>
        <App />
      </UserContext.Provider>
    </MemoryRouter>
  );

  expect(screen.getByText("Header")).toBeInTheDocument();
  expect(screen.getByText("Home")).toBeInTheDocument();
});
