// admin/api/predictAPI.js
import axios from "axios";

export const fetchResults = async () => {
  try {
    const response = await axios.get("/api/get_results");
    return response.data;
  } catch (error) {
    console.error("Error fetching results:", error);
    throw new Error("결과를 가져오는 중 오류가 발생했습니다.");
  }
};

export const uploadFile = async (file) => {
  const formData = new FormData();
  formData.append("file", file);

  try {
    await axios.post("/api/upload_csv", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  } catch (error) {
    console.error("Error uploading file:", error);
    throw new Error("파일 업로드 중 오류가 발생했습니다.");
  }
};

export const addBookFromJson = async () => {
  try {
    const response = await axios.post("/api/add-book-from-json", {
      headers: { "Content-Type": "application/json" },
    });
    return response.data;
  } catch (error) {
    console.error("Error adding book from JSON:", error);
    throw new Error("json에서 데이터 적재 중 오류가 발생했습니다.");
  }
};

// 진행률 확인 API 호출 함수
export const pollingProgress = async () => {
  try {
    const response = await axios.get("/api/progress_status");
    return response.data.progress;
  } catch (error) {
    console.error("Error fetching progress:", error);
    throw new Error("진행률 조회 중 오류가 발생했습니다.");
  }
};
