import { REACT_APP_BACKEND_URL } from "@env";
import axios from "axios";

const API_URL = `${REACT_APP_BACKEND_URL}/api/notifications`;

export const pushNotification = async (token, notification) => {
  try {
    const response = await axios.post(`${API_URL}/send-notification`, {
      token: { token },
      notificationInfo: notification,
    });
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};
