import axios from "axios";

export const checkUserId = async (userid) => {
  try {
    console.log("userid", userid);

    const response = await axios.post("/api/check-userid", { userid });
    return response.data.exists;
  } catch (error) {
    console.error("Error checking User ID:", error);
    throw error;
  }
};

export const joinSubmit = async (event, formData) => {
  // 기본 폼 제출 동작을 막기 위해 event.preventDefault() 호출
  event.preventDefault();

  try {
    // 서버로 formData를 비동기 요청으로 보냄
    const response = await axios.post("/api/join", formData);

    // 서버에서 받은 응답에서 메시지를 반환
    return response.data.message;
  } catch (error) {
    console.error("Error saving data:", error);
    throw error;
  }
};
