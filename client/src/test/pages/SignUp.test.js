import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { signUp } from "../../api/userService";
import SignUp from "../../pages/SignUp";
import { MemoryRouter } from "react-router-dom";

jest.mock("../../api/userService");

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

test("displays validation errors for invalid input", async () => {
  render(
    <MemoryRouter>
      <SignUp />
    </MemoryRouter>
  );

  const submitButton = screen.getByText("Submit");

  await user.click(submitButton);

  expect(screen.getByText("First name is required!")).toBeInTheDocument();
  expect(screen.getByText("Last name is required!")).toBeInTheDocument();
  expect(screen.getByText("Email is required!")).toBeInTheDocument();
  expect(screen.getByText("Password is required!")).toBeInTheDocument();
  expect(screen.getByText("Please confirm your password")).toBeInTheDocument();
});

test("displays error when passwords do not match", async () => {
  render(
    <MemoryRouter>
      <SignUp />
    </MemoryRouter>
  );

  const passwordInput = screen.getByPlaceholderText("Password");
  const confirmPasswordInput = screen.getByPlaceholderText("Confirm Password");
  const submitButton = screen.getByText("Submit");

  await user.type(passwordInput, "password");
  await user.type(confirmPasswordInput, "passwor");
  await user.click(submitButton);

  expect(screen.getByText("Password does not match")).toBeInTheDocument();
});

test("navigates to the login page when signed up", async () => {
  signUp.mockResolvedValueOnce("test user signed up successfully");

  render(
    <MemoryRouter>
      <SignUp />
    </MemoryRouter>
  );

  const firstNameInput = screen.getByPlaceholderText("First Name");
  const lastNameInput = screen.getByPlaceholderText("Last Name");
  const emailInput = screen.getByPlaceholderText("Email");
  const passwordInput = screen.getByPlaceholderText("Password");
  const confirmPasswordInput = screen.getByPlaceholderText("Confirm Password");
  const submitButton = screen.getByText("Submit");

  await user.type(firstNameInput, "test");
  await user.type(lastNameInput, "user");
  await user.type(emailInput, "test@gmail.com");
  await user.type(passwordInput, "test123");
  await user.type(confirmPasswordInput, "test123");
  await user.click(submitButton);

  expect(mockUseNavigate).toHaveBeenCalledWith("/login", {
    state: "You signed up successfully! Please login.",
  });
});
