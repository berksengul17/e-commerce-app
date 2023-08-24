import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Button from "../../components/Button";

let user;

beforeEach(() => {
  user = userEvent.setup();
});

test("renders button with correct text", () => {
  const buttonText = "Click me";
  render(<Button text={buttonText} />);
  const buttonElement = screen.getByText(buttonText);
  expect(buttonElement).toBeInTheDocument();
});

test("calls onClick function when button is clicked", async () => {
  const mockOnClick = jest.fn();
  render(<Button text="Click me" onClick={mockOnClick} />);
  const buttonElement = screen.getByText("Click me");
  await user.click(buttonElement);
  expect(mockOnClick).toHaveBeenCalledTimes(1);
});

test("applies dark theme when theme prop is dark", () => {
  render(<Button text="Dark Button" theme="dark" />);
  const buttonElement = screen.getByText("Dark Button");
  expect(buttonElement).toHaveClass("dark");
});

test("applies light theme when theme prop is light", () => {
  render(<Button text="Light Button" theme="light" />);
  const buttonElement = screen.getByText("Light Button");
  expect(buttonElement).toHaveClass("light");
});

test("applies additional classes when additionalClasses prop is provided", () => {
  render(<Button text="Styled Button" additionalClasses="custom-style" />);
  const buttonElement = screen.getByText("Styled Button");
  expect(buttonElement).toHaveClass("custom-style");
});

test("sets button type based on type prop", () => {
  render(<Button text="Submit" type="submit" />);
  const buttonElement = screen.getByText("Submit");
  expect(buttonElement).toHaveAttribute("type", "submit");
});

test("disables button when disabled prop is true", () => {
  render(<Button text="Disabled Button" disabled={true} />);
  const buttonElement = screen.getByText("Disabled Button");
  expect(buttonElement).toBeDisabled();
});
