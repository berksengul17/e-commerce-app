import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Success from "../../pages/Success";
import { MemoryRouter } from "react-router-dom";

const mockUseNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),

  useNavigate: () => mockUseNavigate,
}));

let user;

beforeEach(() => {
  user = userEvent.setup();
});

test("renders properly", () => {
  render(
    <MemoryRouter>
      <Success />
    </MemoryRouter>
  );

  expect(
    screen.getByText("Your order has been created successfully!")
  ).toBeInTheDocument();
  expect(screen.getByText("Continue shopping")).toBeInTheDocument();
});

test("navigates to the home page when button is clicked", async () => {
  render(
    <MemoryRouter>
      <Success />
    </MemoryRouter>
  );

  const continueShoppingButton = screen.getByText("Continue shopping");
  await user.click(continueShoppingButton);

  expect(mockUseNavigate).toHaveBeenCalledWith("/");
});
