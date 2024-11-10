import React, { useState } from 'react';
import { AppBar as MuiAppBar, Toolbar, IconButton, Badge, styled, Box, Menu, MenuItem, Typography } from '@mui/material';
import { Menu as MenuIcon, Notifications as NotificationsIcon, Logout as LogoutIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';

// 로고 이미지 가져오기
import logo from '../assets/logo1.png';

import { formatNotificationMessage } from '../utils/notificationUtils'; // 메시지 조합 함수

import { usePolling } from '../hooks/usePolling'; // 새로운 훅

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
  const [notifications, setNotifications] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null); // 메뉴 열기 상태 관리

  // SSE 대신 폴링 훅 사용
  usePolling(setNotifications);

  const handleLogout = () => {
    localStorage.clear();
    sessionStorage.clear();
    setUserObject(null); // 전역 상태 초기화
    navigate("/"); // 메인 페이지로 이동
  };

  const handleNotificationClick = (event) => {
    setAnchorEl(event.currentTarget); // 메뉴를 여는 요소 설정
  };

  const handleClose = () => {
    setAnchorEl(null); // 메뉴 닫기
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

        <IconButton color="inherit" onClick={handleNotificationClick}>
          <Badge badgeContent={notifications.length} color="secondary">
            <NotificationsIcon />
          </Badge>
        </IconButton>
        
        {/* 알림 메뉴 */}
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleClose}
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
        >
          {notifications.length > 0 ? (
            notifications.map((notification, index) => (
              <MenuItem key={index} onClick={handleClose}>
                <Typography variant="body2">
                  {formatNotificationMessage(notification)}
                </Typography>
              </MenuItem>
            ))
          ) : (
            <MenuItem onClick={handleClose}>
              <Typography variant="body2">No new notifications</Typography>
            </MenuItem>
          )}
        </Menu>

        <IconButton color="inherit" onClick={handleLogout} sx={{ marginLeft: '16px' }}>
          <LogoutIcon />
        </IconButton>
      </Toolbar>
    </AppBar>
  );
}
