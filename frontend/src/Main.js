import React from 'react';
import { Container, Typography, Box } from '@mui/material';

function Main() {
  return (
    <Container
      maxWidth="md"
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        textAlign: 'center',
      }}
    >
      <Typography variant="h3" sx={{ mb: 4 }}>
        H - ear
      </Typography>
      <Box sx={{ display: 'flex', gap: 4 }}>
        <Box
          component="button"
          sx={{
            width: 400,
            height: 160,
            borderRadius: 20,
            fontSize: '1.5rem',
            backgroundColor: '#1976d2', // 기본 버튼 색상
            color: '#fff',
            border: 'none',
            cursor: 'pointer',
            '&:hover': {
              backgroundColor: '#1565c0', // 호버 효과
            },
          }}
        >
          로그인
        </Box>
        <Box
          component="button"
          sx={{
            width: 400,
            height: 160,
            borderRadius: 20,
            fontSize: '1.5rem',
            backgroundColor: '#1976d2',
            color: '#fff',
            border: 'none',
            cursor: 'pointer',
            '&:hover': {
              backgroundColor: '#1565c0',
            },
          }}
        >
          회원가입
        </Box>
      </Box>
      <Typography variant="body2" sx={{ mt: 8 }}>
        주소: 61740 광주광역시 남구 송암로 60 광주 CGI센터 2층 6강의실
        <br />
        TEL. 062.123.4567 FAX. 062.987.6543
        <br />
        © 2024 H-ear. all rights reserved.
      </Typography>
    </Container>
  );
}

export default Main;
