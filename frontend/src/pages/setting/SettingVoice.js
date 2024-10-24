import React, { useState, useRef } from 'react';
import { Typography, Box, Button, Container } from '@mui/material';
import Header from '../../components/Header';
import Breadcrumb from '../../components/BreadCrumb';
import Footer from '../../components/Footer';
import { uploadAndAddVoice } from '../../api/voiceAPI';

const SettingVoice = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [audioURL, setAudioURL] = useState('');
  const [audioBlob, setAudioBlob] = useState(null);
  const mediaRecorderRef = useRef(null);

  const handleRecording = async () => {
    if (isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    } else {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const mediaRecorder = new MediaRecorder(stream);
        mediaRecorderRef.current = mediaRecorder;

        const audioChunks = [];
        mediaRecorder.ondataavailable = (event) => {
          audioChunks.push(event.data);
        };

        mediaRecorder.onstop = () => {
          const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
          const audioURL = URL.createObjectURL(audioBlob);
          setAudioBlob(audioBlob);
          setAudioURL(audioURL);
        };

        mediaRecorder.start();
        setIsRecording(true);
      } catch (err) {
        console.error('Error accessing microphone:', err);
      }
    }
  };

  const handlePlayback = () => {
    if (audioURL) {
      const audio = new Audio(audioURL);
      audio.play();
    }
  };

  const handleSave = async () => {
    if (audioBlob) {
      try {
        // 서버에 파일 업로드하고 ElevenLabs에 추가
        const response = await uploadAndAddVoice(audioBlob);
        if (response.message === "Voice added successfully") {
          alert("목소리가 성공적으로 추가되었습니다.");
        }
      } catch (error) {
        console.error("Failed to save voice:", error);
        alert("목소리를 저장하는 중에 오류가 발생했습니다.");
      }
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header />
      <Breadcrumb />

      <Box flexGrow={1} display="flex" justifyContent="center" py={6} bgcolor="#fff">
        <Container maxWidth="sm" textAlign="center">
          <Typography variant="h4" gutterBottom>
            목소리 녹음하기
          </Typography>
          <Typography variant="body1" gutterBottom>
            본인의 목소리를 녹음해서 TTS로 사용할 수 있습니다. 녹음 버튼을 누르고 최소 10초에서 1분 정도 녹음해주세요.
          </Typography>
          
          <Box display="flex" justifyContent="space-around" mt={4}>
            <Button
              variant={isRecording ? "outlined" : "contained"}
              color={isRecording ? "error" : "primary"}
              onClick={handleRecording}
              sx={{ padding: 2 }}
            >
              {isRecording ? "녹음 중지" : "녹음 시작"}
            </Button>
            
            <Button
              variant="contained"
              color="secondary"
              onClick={handlePlayback}
              disabled={!audioURL}
              sx={{ padding: 2 }}
            >
              들어보기
            </Button>
            
            <Button
              variant="contained"
              color="success"
              onClick={handleSave}
              disabled={!audioBlob}
              sx={{ padding: 2 }}
            >
              목소리 저장
            </Button>
          </Box>
        </Container>
      </Box>

      <Footer />
    </div>
  );
};

export default SettingVoice;