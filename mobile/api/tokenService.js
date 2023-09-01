import { REACT_APP_BACKEND_URL } from "@env";
import axios from "axios";

const API_URL = `${REACT_APP_BACKEND_URL}/api/tokens`;

export const saveToken = async (userId, token) => {
  try {
    console.log("SAVE TOKEN");
    const response = await axios.post(`${API_URL}/${userId}/save-token`, token);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const getTokens = async (userId) => {
  try {
    const response = await axios.get(`${API_URL}/${userId}`);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};
