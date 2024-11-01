import axios from 'axios';

export const generateTTSFile = async (voiceId, text, bookSeq) => {
  console.log('voiceId', voiceId);
  
  try {
    const response = await axios.post("/api/tts/generate", {
      voiceId,
      text,
      bookSeq  // 책 ID
    });
    return response.data; // 백엔드가 반환하는 파일 URL 등 데이터를 그대로 반환
  } catch (error) {
    console.error("Error generating TTS file:", error);
    throw error;
  }
};
