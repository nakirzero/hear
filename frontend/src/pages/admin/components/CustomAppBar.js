import React from 'react';
import { AppBar as MuiAppBar, Toolbar, IconButton, Badge, styled, Box } from '@mui/material';
import { Menu as MenuIcon, Notifications as NotificationsIcon, Logout as LogoutIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';

// 로고 이미지 가져오기
import logo from '../assets/logo1.png'

const drawerWidth = 240;

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

export default function CustomAppBar({ open, toggleDrawer }) {
  const navigate = useNavigate();
  const { setUserObject } = useAuth();

  const handleLogout = () => {
    localStorage.clear();
    sessionStorage.clear();
    setUserObject(null); // 전역 상태 초기화
    navigate("/"); // 메인 페이지로 이동
  };

  return (
    <AppBar position="absolute" open={open}>
      <Toolbar sx={{ pr: '24px' }}>
        <IconButton
          edge="start"
          color="inherit"
          aria-label="open drawer"
          onClick={toggleDrawer}
          sx={{ marginRight: '36px', ...(open && { display: 'none' }) }}
        >
          <MenuIcon />
        </IconButton>
        
        {/* 로고 이미지 삽입 */}
        <Box component="img" src={logo} alt="Logo" sx={{ height: 40, marginRight: 'auto' }} />

        <IconButton color="inherit">
          <Badge badgeContent={4} color="secondary">
            <NotificationsIcon />
          </Badge>
        </IconButton>
        <IconButton color="inherit" onClick={handleLogout} sx={{ marginLeft: '16px' }}>
          <LogoutIcon />
        </IconButton>
      </Toolbar>
    </AppBar>
  );
}
