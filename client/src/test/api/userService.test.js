import axios from "axios";
import { signUp, login } from "../../api/userService";

jest.mock("axios");

const API_URL = "http://localhost:8080/api/user";

const mockUserCredentials = {
  email: "test@example.com",
  password: "testpassword",
};

test("should successfully sign up a user", async () => {
  const mockResponse = { message: "User signed up successfully" };
  axios.post.mockResolvedValue({ data: mockResponse });

  const response = await signUp(mockUserCredentials);

  expect(response).toEqual(mockResponse);
  expect(axios.post).toHaveBeenCalledWith(
    `${API_URL}/signUp`,
    mockUserCredentials
  );
});

test("should handle sign up failure", async () => {
  const mockError = { error: "User already exists" };
  axios.post.mockRejectedValue({ response: { data: mockError } });

  await expect(signUp(mockUserCredentials)).rejects.toEqual(mockError);
  expect(axios.post).toHaveBeenCalledWith(
    `${API_URL}/signUp`,
    mockUserCredentials
  );
});

test("should successfully log in a user", async () => {
  const mockResponse = { message: "User logged in successfully" };
  axios.post.mockResolvedValue({ data: mockResponse });

  const response = await login(mockUserCredentials);

  expect(response).toEqual(mockResponse);
  expect(axios.post).toHaveBeenCalledWith(
    `${API_URL}/login`,
    mockUserCredentials
  );
});

test("should handle login failure", async () => {
  const mockError = { error: "Invalid credentials" };
  axios.post.mockRejectedValue({ response: { data: mockError } });

  await expect(login(mockUserCredentials)).rejects.toEqual(mockError);
  expect(axios.post).toHaveBeenCalledWith(
    `${API_URL}/login`,
    mockUserCredentials
  );
});
