import React from 'react';
import { AppBar, Toolbar, Typography, Box, Button, Avatar, Grid2, Paper } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import { useNavigate } from 'react-router-dom';

const Board = () => {
  const navigate = useNavigate();

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      
      {/* Header */}
      <AppBar position="static" color="transparent" elevation={0} style={{ borderBottom: '1px solid #e0e0e0' }}>
        <Toolbar style={{ justifyContent: 'space-between' }}>
          <Typography variant="h6" noWrap>
            H - ear
          </Typography>
          <Typography variant="body1">Hear-o 님 환영합니다.</Typography>
          <Button variant="contained" color="primary">로그아웃</Button>
        </Toolbar>
      </AppBar>

      {/* Breadcrumb */}
      <Box bgcolor="#000000"  color="#fff" py={1} px={2} display="flex" alignItems="center">
        <HomeIcon />
        <Typography variant="body2" ml={1} onClick={() => navigate('/menu')}>
          HOME &gt; 고객게시판
        </Typography>
      </Box>

      {/* User Profile Section */}
      <Box bgcolor="#FFD700" py={4} display="flex" flexDirection="column" alignItems="center">
        <Avatar
          sx={{ width: 100, height: 100, bgcolor: 'gray', mb: 2 }}
          alt="Profile"
        />
        <Typography variant="h6">누구누구</Typography>
        <Typography variant="body2">인증 완료</Typography>
        <Typography variant="body2">24. 11.14 부터 1일간 함께 듣는 중</Typography>
      </Box>

      {/* Options Section */}
      <Box flexGrow={1} display="flex" justifyContent="center" py={6} bgcolor="#fff">
        <Grid2 container spacing={10} maxWidth="1000px">
          <Grid2 item xs={6}>
            <Paper elevation={3} sx={{ padding: 10, height:10, textAlign: 'center' }} onClick={() => navigate('/notice')}>
              <Typography variant="h6">공지사항</Typography>
            </Paper>
          </Grid2>
          <Grid2 item xs={6}>
            <Paper elevation={3} sx={{ padding: 10, height:10, textAlign: 'center' }} onClick={() => navigate('/suggest')}>
              <Typography variant="h6">건의사항</Typography>
            </Paper>
          </Grid2>
          <Grid2 item xs={6}>
            <Paper elevation={3} sx={{ padding: 10, height:10, textAlign: 'center' }} onClick={() => navigate('/qna')}>
              <Typography variant="h6">Q&A</Typography>
            </Paper>
          </Grid2>
          <Grid2 item xs={6}>
            <Paper elevation={3} sx={{ padding: 10, height:10, textAlign: 'center' }} onClick={() => navigate('/wishbook')}>
              <Typography variant="h6">희망도서신청조회</Typography>
            </Paper>
          </Grid2>
        </Grid2>
      </Box>

      {/* Footer */}
      <Box bgcolor="#666" color="#fff" py={2} textAlign="center">
        <Typography variant="body2">
          주소: 61740 광주광역시 남구 양림로 60 광주여고 25 6층실 TEL: 062-123-4567 FAX: 062-987-6543
        </Typography>
        <Typography variant="body2">
          © Copyright 2024 Hear. All rights reserved.
        </Typography>
      </Box>
    </div>
  );
};

export default Board;
