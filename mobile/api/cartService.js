import axios from "axios";
import { REACT_APP_BACKEND_URL } from "@env";

const API_URL = `${REACT_APP_BACKEND_URL}/api/carts`;

export const getCartByUserId = async (userId) => {
  try {
    const response = await axios.get(`${API_URL}/${userId}`);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const addItemToCart = async (userId, productId) => {
  try {
    const response = await axios.post(`${API_URL}/${userId}/add/${productId}`);
    console.log(response);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const removeItemFromCart = async (userId, cartItemId) => {
  try {
    const response = await axios.delete(
      `${API_URL}/${userId}/remove/${cartItemId}`
    );
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const deleleItemFromCart = async (userId, cartItemId) => {
  try {
    const response = await axios.delete(
      `${API_URL}/${userId}/delete/${cartItemId}`
    );
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const clearCartItems = async (userId) => {
  try {
    const response = await axios.delete(`${API_URL}/${userId}/clear-cart`);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const getTotalPrice = async (userId) => {
  try {
    const response = await axios.get(`${API_URL}/${userId}/total-price`);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};
