import axios from "axios";

import { REACT_APP_BACKEND_URL } from "@env";

const API_URL = `${REACT_APP_BACKEND_URL}/api/user`;

export const signUp = async (userCredentials) => {
  try {
    const response = await axios.post(`${API_URL}/signUp`, userCredentials);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const login = async (userCredentials) => {
  try {
    const response = await axios.post(`${API_URL}/login`, userCredentials);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};
