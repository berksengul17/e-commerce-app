import axios from "axios";
import {
  getCartByUserId,
  addItemToCart,
  removeItemFromCart,
  deleleItemFromCart,
  clearCartItems,
  getTotalPrice,
} from "../../api/cartService";

jest.mock("axios");

const API_URL = "http://localhost:8080/api/carts";

const userId = 1;
const productId = 2;
const cartItemId = 3;

test("should get user's cart by userId", async () => {
  const mockResponse = { cartItems: [{ id: 1, quantity: 2 }] };
  axios.get.mockResolvedValue({ data: mockResponse });

  const response = await getCartByUserId(userId);

  expect(response).toEqual(mockResponse);
  expect(axios.get).toHaveBeenCalledWith(`${API_URL}/${userId}`);
});

test("should throw an error when a cart associated with the userId does not exist", async () => {
  const mockError = {
    error: "Cart associated with the user id 100 is not found.",
  };
  axios.get.mockRejectedValue({ response: { data: mockError } });

  await expect(getCartByUserId(100)).rejects.toBe(mockError);
  expect(axios.get).toHaveBeenCalledWith(`${API_URL}/${userId}`);
});

test("should add an item to the user's cart", async () => {
  const mockResponse = { message: "Item added to cart" };
  axios.post.mockResolvedValue({ data: mockResponse });

  const response = await addItemToCart(userId, productId);

  expect(response).toEqual(mockResponse);
  expect(axios.post).toHaveBeenCalledWith(
    `${API_URL}/${userId}/add/${productId}`
  );
});

test("should remove an item from the user's cart", async () => {
  const mockResponse = { message: "Item removed from cart" };
  axios.delete.mockResolvedValue({ data: mockResponse });

  const response = await removeItemFromCart(userId, cartItemId);

  expect(response).toEqual(mockResponse);
  expect(axios.delete).toHaveBeenCalledWith(
    `${API_URL}/${userId}/remove/${cartItemId}`
  );
});

test("should delete an item from the user's cart", async () => {
  const mockResponse = { message: "Item deleted from cart" };
  axios.delete.mockResolvedValue({ data: mockResponse });

  const response = await deleleItemFromCart(userId, cartItemId);

  expect(response).toEqual(mockResponse);
  expect(axios.delete).toHaveBeenCalledWith(
    `${API_URL}/${userId}/delete/${cartItemId}`
  );
});

test("should clear all items from the user's cart", async () => {
  const mockResponse = { message: "Cart cleared" };
  axios.delete.mockResolvedValue({ data: mockResponse });

  const response = await clearCartItems(userId);

  expect(response).toEqual(mockResponse);
  expect(axios.delete).toHaveBeenCalledWith(`${API_URL}/${userId}/clear-cart`);
});

test("should get the total price of the user's cart", async () => {
  const mockResponse = { total: 100 };
  axios.get.mockResolvedValue({ data: mockResponse });

  const response = await getTotalPrice(userId);

  expect(response).toEqual(mockResponse);
  expect(axios.get).toHaveBeenCalledWith(`${API_URL}/${userId}/total-price`);
});
