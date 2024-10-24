import React from 'react';
import { AppBar, Toolbar, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const Header = () => {
  const navigate = useNavigate(); // useNavigate 훅 사용
  const handleLogout = () => {
    localStorage.clear()
    sessionStorage.clear()
    navigate('/');
  }

  return (
    <AppBar position="static" elevation={0}>
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        <Typography variant="h6" noWrap>
          H - ear
        </Typography>
        <Typography variant="body1">Hear-o 님 환영합니다.</Typography>
        <Button variant="contained" onClick={handleLogout}>로그아웃</Button>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
