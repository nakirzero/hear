import axios from "axios";

export const fetchWishBooks = async (userSeq) => {
  try {
    const response = await axios.get(`/api/wishbooks`, { params: { userSeq } });
    return response.data;
  } catch (error) {
    console.error("Error fetching wish books:", error);
    throw error;
  }
};

export const cancelWishBook = async (wishBookId) => {
  try {
    const response = await axios.put(`/api/wishbooks/${wishBookId}/cancel`);
    return response.data;
  } catch (error) {
    console.error("Error cancelling wish book:", error);
    throw error;
  }
};
