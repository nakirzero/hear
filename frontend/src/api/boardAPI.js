// src/api/boardAPI.js
import axios from 'axios';

export const fetchNotices = async () => {
  try {
    const response = await axios.get("/api/notices");
    return response.data;
  } catch (error) {
    console.error("Error fetching notices:", error);
    throw error;
  }
};
