import axios from "axios";
import { getAllProducts, getProductById } from "../../api/productService";

jest.mock("axios");

const API_URL = "http://localhost:8080/api/products";

test("should get all products", async () => {
  const mockResponse = [
    { id: 1, name: "Product 1", price: 20.0 },
    { id: 2, name: "Product 2", price: 15.0 },
  ];
  axios.get.mockResolvedValue({ data: mockResponse });

  const response = await getAllProducts();

  expect(response).toEqual(mockResponse);
  expect(axios.get).toHaveBeenCalledWith(API_URL);
});

test("should get product by id", async () => {
  const productId = 1;
  const mockResponse = { id: productId, name: "Product 1", price: 20.0 };
  axios.get.mockResolvedValue({ data: mockResponse });

  const response = await getProductById(productId);

  expect(response).toEqual(mockResponse);
  expect(axios.get).toHaveBeenCalledWith(`${API_URL}/${productId}`);
});

test("should throw an error when a product with the given id does not exist", async () => {
  const productId = 100;
  const mockError = { error: "Product with id " + " is not found" };
  axios.get.mockRejectedValue({ response: { data: mockError } });

  await expect(getProductById(productId)).rejects.toEqual(mockError);
  expect(axios.get).toHaveBeenCalledWith(`${API_URL}/${productId}`);
});
