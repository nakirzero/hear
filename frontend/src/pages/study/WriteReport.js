import React, { useState } from "react";
import { Box, Button, TextField, Typography, Rating } from "@mui/material";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import Header from "../../components/Header";
import Breadcrumb from "../../components/BreadCrumb";
import { submitBookReport } from "../../api/studyAPI";

const WriteReport = () => {
  const { userObject } = useAuth();
  const navigate = useNavigate();
  
  const [title, setTitle] = useState('');
  const [detail, setDetail] = useState('');
  const [rating, setRating] = useState(0);

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
          <Typography variant="h5" gutterBottom>독서노트 작성</Typography>
          <Typography variant="subtitle1" gutterBottom>작성자: {userObject?.NICKNAME}</Typography>

          <TextField label="제목" fullWidth required value={title} onChange={(e) => setTitle(e.target.value)} sx={{ mb: 2 }} />
          <TextField label="내용" fullWidth required multiline rows={6} value={detail} onChange={(e) => setDetail(e.target.value)} sx={{ mb: 2 }} />

          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Typography variant="subtitle1" sx={{ mr: 2 }}>평점:</Typography>
            <Rating value={rating} onChange={(e, newValue) => setRating(newValue)} />
          </Box>

          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button type="submit" variant="contained" color="primary" fullWidth>작성 완료</Button>
            <Button onClick={() => navigate(-1)} variant="outlined" color="secondary" fullWidth>취소</Button>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default WriteReport;
