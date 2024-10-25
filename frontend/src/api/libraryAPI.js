import axios from 'axios';

export const fetchLibrary = async () => {
  try {
    const response = await axios.get("/api/library");
    return response.data;
  } catch (error) {
    console.error("Error fetching library:", error);
    throw error;
  }
};