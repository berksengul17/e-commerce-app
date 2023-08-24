import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { UserProvider, UserContext } from "../../context/UserProvider";

let user;

beforeEach(() => {
  user = userEvent.setup();
});

test("UserProvider sets initial user to null when localStorage is empty", () => {
  render(
    <UserProvider>
      <UserContext.Consumer>
        {(value) => <div data-testid="user">{JSON.stringify(value.user)}</div>}
      </UserContext.Consumer>
    </UserProvider>
  );

  const userElement = screen.getByTestId("user");
  expect(userElement.textContent).toBe("null");
});

test("UserProvider sets initial user from localStorage", () => {
  jest.spyOn(Storage.prototype, "getItem");
  Storage.prototype.getItem = jest
    .fn()
    .mockReturnValueOnce(JSON.stringify({ id: 1, name: "Test User" }));

  render(
    <UserProvider>
      <UserContext.Consumer>
        {(value) => <div data-testid="user">{JSON.stringify(value.user)}</div>}
      </UserContext.Consumer>
    </UserProvider>
  );

  const userElement = screen.getByTestId("user");
  expect(userElement.textContent).toBe('{"id":1,"name":"Test User"}');
});

test("UserProvider sets user and updates localStorage", async () => {
  jest.spyOn(Storage.prototype, "setItem");
  Storage.prototype.setItem = jest.fn();

  const mockUser = { id: 1, name: "Test User" };

  render(
    <UserProvider>
      <UserContext.Consumer>
        {(value) => (
          <>
            <div data-testid="user">{JSON.stringify(value.user)}</div>
            <button onClick={() => value.loginUser(mockUser)}>Login</button>
          </>
        )}
      </UserContext.Consumer>
    </UserProvider>
  );

  await user.click(screen.getByText("Login"));
  const userElement = screen.getByTestId("user");

  expect(userElement.textContent).toBe('{"id":1,"name":"Test User"}');
  expect(localStorage.setItem).toHaveBeenCalledWith(
    "user",
    JSON.stringify(mockUser)
  );
});

test("UserProvider clears user and localStorage", async () => {
  jest.spyOn(Storage.prototype, "removeItem");
  Storage.prototype.removeItem = jest.fn();

  render(
    <UserProvider>
      <UserContext.Consumer>
        {(value) => (
          <>
            <div data-testid="user">{JSON.stringify(value.user)}</div>
            <button onClick={value.logoutUser}>Logout</button>
          </>
        )}
      </UserContext.Consumer>
    </UserProvider>
  );

  await user.click(screen.getByText("Logout"));
  const userElement = screen.getByTestId("user");

  expect(userElement.textContent).toBe("null");
  expect(localStorage.removeItem).toHaveBeenCalledWith("user");
});
