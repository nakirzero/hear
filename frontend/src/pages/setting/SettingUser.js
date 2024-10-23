import React from 'react';
import { AppBar, Toolbar, Typography, Container, Box, Button, Avatar, TextField} from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import { useNavigate } from 'react-router-dom';

const SettingUser = () => {
  const navigate = useNavigate();

  return (
    <div>
      {/* Header */}
      <AppBar position="static" color="transparent" elevation={0} style={{ borderBottom: '1px solid #e0e0e0' }}>
        <Toolbar style={{ justifyContent: 'space-between' }}>
          <Typography variant="h2" noWrap>
            H - ear
          </Typography>
          <Typography variant="body1">Hear-o 님 환영합니다.</Typography>
          <Button variant="contained" color="primary">로그아웃</Button>
        </Toolbar>
      </AppBar>

      {/* Breadcrumb */}
      <Box bgcolor="#000000" color="#fff" py={1} px={2} display="flex" alignItems="center">
        <HomeIcon />
        <Typography variant="body2" ml={1}>
          HOME &gt; 설정 &gt; 회원정보수정
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


      {/* Main Content */}
      <Container maxWidth="sm" sx={{ mt: 4 }}>

        {/* Pitch Adjustment */}
        <Typography variant="subtitle1" sx={{ mt: 3 }} align="center">
          회원정보수정
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 4 }}>
            <TextField id="outlined-basic" label="아이디" variant="outlined" />
        <TextField id="outlined-basic" label="비밀번호" variant="outlined" />
        <TextField id="outlined-basic" label="닉네임" variant="outlined" />
        </Box>

        {/* Buttons */}
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 5, mt: 4 }}>
          <Button variant="contained">저장하기</Button>
          <Button variant="outlined">취소</Button>
        </Box>
      </Container>

      <Box onClick={() => navigate('/menu')}
      sx={{
          backgroundColor: '#e0e0e0',
          py: 3,
          mt: 1,
          textAlign: 'center',
        }}
        >
        <Typography>홈으로</Typography>
        </Box>

      {/* Footer */}
      <Box
        sx={{
          backgroundColor: '#e0e0e0',
          py: 3,
          mt: 4,
          textAlign: 'center',
        }}
      >
       
        <Typography>주소: 61740 광주광역시 남구 양림로 60 63-7 GS센터 2층 GS홈쇼핑</Typography>
        <Typography>TEL: 062.123.4567 FAX: 062.987.6543</Typography>
        <Typography>© Copyright 2024 Hear. all rights reserved.</Typography>
      </Box>
    </div>
  );
};

export default SettingUser;
