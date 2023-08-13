import axios from "axios";

const API_URL = "http://localhost:8080/api/user";

export const signUp = async (userCredentials) => {
  try {
    const response = await axios.post(`${API_URL}/signup`, userCredentials);
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
