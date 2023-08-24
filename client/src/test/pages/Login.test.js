import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { login } from "../../api/userService";
import Login from "../../pages/Login";
import { UserContext } from "../../context/UserProvider";
import { MemoryRouter } from "react-router-dom";

jest.mock("../../api/userService");

const mockUseNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),

  useNavigate: () => mockUseNavigate,
}));

const mockUser = {
  id: 1,
  firstName: "Test",
  lastName: "User",
  email: "test@gmail.com",
  password: "testpwd",
};

let user;

beforeEach(() => {
  user = userEvent.setup();
});

afterEach(() => {
  jest.clearAllMocks();
});

test("logs in when user credentials are correct", async () => {
  login.mockResolvedValueOnce({
    id: mockUser.id,
    firstName: mockUser.firstName,
    lastName: mockUser.lastName,
    email: mockUser.email,
    cart: "",
  });

  render(
    <MemoryRouter>
      <UserContext.Provider value={{ user: null, loginUser: jest.fn() }}>
        <Login />
      </UserContext.Provider>
    </MemoryRouter>
  );

  const emailInput = screen.getByPlaceholderText("Email");
  const passwordInput = screen.getByPlaceholderText("Password");
  const submitButton = screen.getByText("Submit");

  await user.type(emailInput, "test@gmail.com");
  await user.type(passwordInput, "testpwd");
  await user.click(submitButton);

  expect(login).toHaveBeenCalledWith({
    email: "test@gmail.com",
    password: "testpwd",
  });
  expect(mockUseNavigate).toHaveBeenCalledWith("/", { replace: true });
});

test("displays error message on wrong user credentials", async () => {
  const errorMessage = "Email or password is wrong";

  login.mockRejectedValueOnce(errorMessage);

  render(
    <MemoryRouter>
      <UserContext.Provider value={{ user: null, loginUser: jest.fn() }}>
        <Login />
      </UserContext.Provider>
    </MemoryRouter>
  );

  const emailInput = screen.getByPlaceholderText("Email");
  const passwordInput = screen.getByPlaceholderText("Password");
  const submitButton = screen.getByText("Submit");

  await userEvent.type(emailInput, "wrongemail@gmail.com");
  await userEvent.type(passwordInput, "wrongpwd");
  await userEvent.click(submitButton);

  expect(screen.getByText(errorMessage)).toBeInTheDocument();
  expect(mockUseNavigate).not.toHaveBeenCalled();
});
