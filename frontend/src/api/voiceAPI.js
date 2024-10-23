import axios from "axios";

export const fetchVoiceList = async () => {
  try {
    const response = await axios.get("/api/voices");

    // 응답 데이터에서 voices 배열 추출
    const voices = response.data.voices;

    // voices가 배열인지 확인한 후, category가 "premade"가 아닌 항목만 반환
    if (Array.isArray(voices)) {
      return voices
        .filter(voice => voice.category !== "premade") // "premade" 제외
        .map((voice) => ({
          id: voice.voice_id,
          name: voice.name,
        }));
    } else {
      console.error("Unexpected response format:", response.data);
      return []; // 예상치 못한 데이터 형식일 경우 빈 배열 반환
    }
  } catch (error) {
    console.error("Failed to fetch voice list:", error);
    throw error;
  }
};
