import axios from "axios";

import { REACT_APP_BACKEND_URL } from "@env";

const API_URL = `${REACT_APP_BACKEND_URL}/api/products`;

export const getAllProducts = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const getProductById = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};
