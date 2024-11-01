import { useAuth } from '../context/AuthContext';
import { generateTTSFile } from '../api/elevenLabsAPI';

const useElevenLabsTTS = () => {
  const { userObject } = useAuth();

  const saveTTSFile = async (voiceId, text, bookSeq) => {
    // userObject가 존재하는지 체크
    if (!userObject) {
      console.error("User is not authenticated.");
      throw new Error("User is not authenticated.");
    }

    try {
      // API 호출
      console.log('voiceId', voiceId);
      console.log('bookSeq', bookSeq);
      const fileData = await generateTTSFile(voiceId, text, bookSeq);
      return fileData;
    } catch (error) {
      console.error("Error saving TTS file:", error);
      throw error;
    }
  };

  return { saveTTSFile };
};

export default useElevenLabsTTS;
