import axios from "axios";
import { REACT_APP_BACKEND_URL } from "@env";

const API_URL = `${REACT_APP_BACKEND_URL}/api/orders`;

export const createOrder = async (userId, cartItems, token) => {
  try {
    const response = await axios.post(
      `${API_URL}/${userId}/create-order`,
      cartItems,
      { params: { tokenVal: token } }
    );
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};
