import React from "react";
import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext"; // AuthContext 사용

// 로고 이미지 가져오기
import logo1 from '../assets/logo1.png';

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
        <Box display="flex" alignItems="center" margin={1}>
          <img src={logo1} alt="Logo 1" style={{ maxHeight: 60, marginLeft:250 }} />
        </Box>
        {userObject && (
  <Typography variant="body3" fontSize="22px" sx={{ marginLeft: "40px", marginTop: "10px" }}>
    {'[ '}
    <Box component="span" sx={{ color: "#4F2F33" }}>
      {userObject.NICKNAME}
    </Box>
    {' ] 님, 환영합니다.'}
  </Typography>
)}

        <Box>
          <Button variant="contained" color="secondary" onClick={goPredict} sx={{marginRight: "250px", mr:2}}>
           <Typography> 예측모델(임시) </Typography>
          </Button>
          <Button variant="contained" color="secondary" onClick={handleLogout} sx={{marginRight: "250px",}}>
          <Typography> 로그아웃 </Typography>
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;