import React from "react";
import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext"; // AuthContext 사용

// 로고 이미지 가져오기
import logo1 from '../assets/logo1.png';
import logo2 from '../assets/logo2.png';
import logo3 from '../assets/logo3.png';
import logo4 from '../assets/logo4.png';
import logo5 from '../assets/logo5.png';

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
      <Toolbar sx={{ justifyContent: "space-between" }}>
        <Box display="flex" alignItems="center">
          <img src={logo1} alt="Logo 1" style={{ maxHeight: 60, marginRight: 8 }} />
          <img src={logo2} alt="Logo 2" style={{ maxHeight: 60, marginRight: 8 }} />
          <img src={logo3} alt="Logo 3" style={{ maxHeight: 60, marginRight: 8 }} />
          <img src={logo4} alt="Logo 4" style={{ maxHeight: 60, marginRight: 8 }} />
          <img src={logo5} alt="Logo 5" style={{ maxHeight: 60, marginRight: 8 }} />
        </Box>
        {userObject && (
          <Typography variant="body1">
            {userObject.NICKNAME}님 환영합니다.
          </Typography>
        )}
        <Box>
          <Button variant="contained" color="secondary" onClick={goPredict} sx={{mr:2}}>
            예측모델(임시)
          </Button>
          <Button variant="contained" color="secondary" onClick={handleLogout}>
            로그아웃
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
