import React from 'react';
import { AppBar, Toolbar, Typography, Button } from '@mui/material';

const Header = () => {
  return (
    <AppBar position="static" elevation={0}>
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        <Typography variant="h6" noWrap>
          H - ear
        </Typography>
        <Typography variant="body1">Hear-o 님 환영합니다.</Typography>
        <Button variant="contained">로그아웃</Button>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
