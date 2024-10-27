import React, { useState, useRef } from "react";
import { Box, Button, TextField, Typography, Rating } from "@mui/material";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import Header from "../../components/Header";
import Breadcrumb from "../../components/BreadCrumb";
import { submitBookReport, convertSpeechToText } from "../../api/studyAPI";

const WriteReport = () => {
  const { userObject } = useAuth();
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [detail, setDetail] = useState('');
  const [rating, setRating] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
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
  
        mediaRecorder.onstop = async () => {
          const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });

          // Blob을 File로 변환
          const file = new File([audioBlob], 'recording.wav', { type: 'audio/wav' });
          
          try {
            // STT API 호출
            const text = await convertSpeechToText(file);
            setDetail((prevDetail) => prevDetail + " " + text); // 변환된 텍스트를 내용에 추가
          } catch (error) {
            console.error("STT 변환 중 오류:", error);
          }
        };
  
        mediaRecorder.start();
        setIsRecording(true);
      } catch (err) {
        console.error("Error accessing microphone:", err);
      }
    }
  };

  const handleReportSubmit = async (event) => {
    event.preventDefault();
    const reportData = { userseq: userObject?.USER_SEQ, nickname: userObject?.NICKNAME, title, detail, rating };

    try {
      await submitBookReport(reportData);
      setTitle(''); 
      setDetail(''); 
      setRating(0);
      navigate('/mystudy/mybookreport');
    } catch (error) {
      console.error("독서노트 작성 실패:", error);
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header />
      <Breadcrumb />

      <Box sx={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <Box component="form" onSubmit={handleReportSubmit} sx={{ width: '35%', p: 3, boxShadow: 3, borderRadius: 2 }}>
          {/* 녹음 버튼 */}
          <Button 
            variant={isRecording ? "contained" : "outlined"} 
            color={isRecording ? "error" : "primary"} 
            onClick={handleRecording} 
            sx={{ width: '100%', mb: 2 }}
          >
            {isRecording ? "녹음 중지" : "음성 녹음 시작"}
          </Button>

          <Typography variant="h5" gutterBottom>독서노트 작성</Typography>
          <Typography variant="subtitle1" gutterBottom>작성자: {userObject?.NICKNAME}</Typography>

          <TextField label="제목" fullWidth required value={title} onChange={(e) => setTitle(e.target.value)} sx={{ mb: 2 }} />
          <TextField label="내용" fullWidth required multiline rows={6} value={detail} onChange={(e) => setDetail(e.target.value)} sx={{ mb: 2 }} />

          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Typography variant="subtitle1" sx={{ mr: 2 }}>평점:</Typography>
            <Rating value={rating} onChange={(e, newValue) => setRating(newValue)} />
          </Box>

          <Button type="submit" variant="contained" color="primary" fullWidth>작성 완료</Button>
        </Box>
      </Box>
    </Box>
  );
};

export default WriteReport;
