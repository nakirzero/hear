import React, { useState, useEffect } from 'react';
import { Box, Button, TextField, Typography, Paper } from '@mui/material';
import { useAuth } from '../../context/AuthContext';
import { writeSubmit } from '../../api/boardAPI';
import { useNavigate, useLocation } from 'react-router-dom';
import { fetchSuggestModify } from '../../api/boardAPI';

import Header from '../../components/Header'
import BreadCrumb from '../../components/BreadCrumb'

const Write = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { userObject } = useAuth();
  const [title, setTitle] = useState('');          
  const [detail, setDetail] = useState('');      
  const report = location.state?.selected
  const [notice_seq, setNotice_seq] = useState();
  
    // useEffect로 초기 데이터 설정
  useEffect(() => {
      if (report) {
        setTitle(report.NOTICE_TITLE);
        setDetail(report.NOTICE_DETAIL);        
        setNotice_seq(report.NOTICE_SEQ)
      }
    }, [report]);
  

  const handlewriteSubmit = async (event) => {
    event.preventDefault();

    const postData = {
      userseq: userObject?.USER_SEQ,
      nickname: userObject?.NICKNAME,
      title,
      detail,
    };

    if(report){  

      try {
      const message = await fetchSuggestModify(postData,notice_seq);
      console.log("서버 응답:", message);

      setTitle('');
      setDetail('');
      navigate('/board/suggest');
    } catch (error) {
      console.error("게시글 작성 실패:", error);
    }
  } else {
    try {
          
      const message = await writeSubmit(postData);
      console.log("서버 응답:", message);

      setTitle('');
      setDetail('');
      navigate('/board/suggest');
    } catch (error) {
      console.error("게시글 작성 실패:", error);
    }
  }
}


  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Header와 BreadCrumb 포함 */}
      <Header />
      <BreadCrumb />
      
      <Box sx={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <Paper elevation={3} sx={{ width: 600, p: 4 }}>
          <Typography variant="h4" gutterBottom>
          {report ? '건의사항 수정' : '건의사항 작성'}
          </Typography>

          {/* 사용자 정보 표시 */}
          <Typography variant="subtitle1" gutterBottom>
            작성자: {userObject?.NICKNAME}
          </Typography>

          <form onSubmit={handlewriteSubmit}>
            {/* 제목 입력 */}
            <TextField
              label="제목"
              variant="outlined"
              fullWidth
              required
              margin="normal"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />

            {/* 내용 입력 */}
            <TextField
              label="내용"
              variant="outlined"
              fullWidth
              required
              multiline
              rows={8}
              margin="normal"
              value={detail}
              onChange={(e) => setDetail(e.target.value)}
            />

            {/* 작성 완료 버튼 */}
            <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 3 }}>
              {report ? '수정완료' :  '작성 완료'}
            </Button>
          </form>
        </Paper>
      </Box>
    </Box>
  );
};

export default Write;
