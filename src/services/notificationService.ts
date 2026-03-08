import axios from "axios";

const API = "http://localhost:5000/api/notifications";

export const fetchNotifications = async (userId) => {
  const res = await axios.get(`${API}/${userId}`);
  console.log("NOTIFICATION API:", res.data);
  return res.data;
};

export const markNotificationRead = async (id) => {
  await axios.put(`${API}/${id}/read`);
};

export const markAllNotificationsRead = async (userId) => {
  await axios.put(`${API}/read-all/${userId}`);
};