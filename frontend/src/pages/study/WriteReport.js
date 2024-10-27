import React, { useState, useRef, useEffect } from "react";
import { Box, Button, TextField, Typography, Rating } from "@mui/material";
import { useAuth } from "../../context/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";
import Header from "../../components/Header";
import Breadcrumb from "../../components/BreadCrumb";
import { submitBookReport, updateBookReport, convertSpeechToText } from "../../api/studyAPI";

const WriteReport = () => {
  const { userObject } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { mode, report } = location.state || {}; // location.state에서 mode와 report 추출

  const [title, setTitle] = useState('');
  const [detail, setDetail] = useState('');
  const [rating, setRating] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef(null);

  useEffect(() => {
    if (report) {
      // 수정 모드일 경우, report 데이터로 필드 초기화
      setTitle(report.REPORT_TITLE || '');
      setDetail(report.REPORT_DETAIL || '');
      setRating(report.RATING || 0);
    }
  }, [report]);

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
          const file = new File([audioBlob], 'recording.wav', { type: 'audio/wav' });

          try {
            const text = await convertSpeechToText(file);
            setDetail((prevDetail) => prevDetail + " " + text);
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

  const speakText = () => {
    const synth = window.speechSynthesis;
    const utterance = new SpeechSynthesisUtterance(detail);
    synth.speak(utterance);
  };

  const handleReportSubmit = async (event) => {
    event.preventDefault();
    const reportData = { userseq: userObject?.USER_SEQ, nickname: userObject?.NICKNAME, title, detail, rating };

    try {
      if (report) {
        // 수정 모드일 경우, updateBookReport 호출
        await updateBookReport(report.REPORT_SEQ, reportData);
      } else {
        // 새로 작성하는 경우
        await submitBookReport(reportData);
      }
      navigate('/mystudy/mybookreport');
    } catch (error) {
      console.error("독서노트 처리 실패:", error);
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header />
      <Breadcrumb />

      <Box sx={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <Box component="form" onSubmit={handleReportSubmit} sx={{ width: '35%', p: 3, boxShadow: 3, borderRadius: 2 }}>
          <Typography variant="h5" gutterBottom>{report ? '독서노트 수정' : '독서노트 작성'}</Typography>
          <Typography variant="subtitle1" gutterBottom>작성자: {userObject?.NICKNAME}</Typography>

          <TextField label="제목" fullWidth required value={title} onChange={(e) => setTitle(e.target.value)} sx={{ mb: 2 }} />

          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Typography variant="subtitle1" sx={{ mr: 2 }}>평점:</Typography>
            <Rating value={rating} onChange={(e, newValue) => setRating(newValue)} />
          </Box>

          {mode === 'voice' && (
            <>
              <Button
                variant={isRecording ? "contained" : "outlined"}
                color={isRecording ? "error" : "primary"}
                onClick={handleRecording}
                sx={{ width: '100%', mb: 2 }}
              >
                {isRecording ? "녹음 중지" : "음성 녹음 시작"}
              </Button>
              <Button variant="outlined" onClick={speakText} color="secondary" fullWidth sx={{ mb: 2 }}>작성 중인 내용 듣기</Button>
            </>
          )}

          <TextField
            label="내용"
            fullWidth
            required
            multiline
            rows={6}
            value={detail}
            onChange={(e) => setDetail(e.target.value)}
            sx={{ mb: 2 }}
          />

          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Button type="submit" variant="contained" color="primary" sx={{ width: '48%' }}>{report ? '수정 완료' : '작성 완료'}</Button>
            <Button variant="outlined" color="secondary" sx={{ width: '48%' }} onClick={() => navigate(-1)}>취소</Button>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default WriteReport;
