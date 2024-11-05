import React from "react";
import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext"; // AuthContext 사용
import logo1 from '../assets/logo1.png'; // 로고 이미지 가져오기
import './Header.css';

const Header = () => {
  const navigate = useNavigate();
  const { userObject, setUserObject } = useAuth(); // 전역 사용자 정보 가져오기

  const handleLogout = () => {
    localStorage.clear();
    sessionStorage.clear();
    setUserObject(null); // 전역 상태 초기화
    navigate("/");
  };

  const goPredict = () => {
    navigate("/predict");
  };

  return (
    <AppBar position="static" elevation={0}>
      <Toolbar className="header-toolbar">
        <Box display="flex" alignItems="center" margin={1}>
          <img src={logo1} alt="Logo 1" className="header-logo" />
        </Box>
        {userObject && (
          <Typography variant="body3" className="welcome-text">
            {'[ '}
            <Box component="span" className="nickname">
              {userObject.NICKNAME}
            </Box>
            {' ] 님, 환영합니다.'}
          </Typography>
        )}

        {/* Button Container with spacing */}
        <Box display="flex" alignItems="center" spacing={2}>
          <Button
            variant="contained"
            color="secondary"
            onClick={goPredict}
            className="predict-button"
          >
            <Typography>예측모델(임시)</Typography>
          </Button>
          <Button
            variant="contained"
            color="secondary"
            onClick={handleLogout}
            className="logout-button"
          >
            <Typography>로그아웃</Typography>
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
