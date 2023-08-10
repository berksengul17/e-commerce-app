import axios from "axios";

const API_URL = "http://localhost:8080/api/register";

export const signUp = async (userCredentials) => {
  try {
    const response = await axios.post(API_URL, userCredentials);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};
