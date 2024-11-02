import React, { useEffect } from "react";
import { Container, Box, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

// 로고 이미지 가져오기
import logoImage1 from '../assets/logoImage1.png';
import logoImage2 from '../assets/logoImage2.png';
import logoImage3 from '../assets/logoImage3.png';
import logoImage4 from '../assets/logoImage4.png';
import logoImage5 from '../assets/logoImage5.png';
import logoImage6 from '../assets/logoImage6.png';
import logoImage7 from '../assets/logoImage7.png';
import logoImage8 from '../assets/logoImage8.png';
import logoImage9 from '../assets/logoImage9.png';
import logoImage10 from '../assets/logoImage10.jpg';

function Main() {
  const navigate = useNavigate();

  useEffect(() => {
    const userInfo = localStorage.getItem('userInfo') || sessionStorage.getItem('userInfo'); 
    if (userInfo) {
      navigate('/menu');
    }
  }, [navigate]);

  const buttonStyle = {
    width: 400,
    height: 160,
    borderRadius: 10,
    fontSize: "1.5rem",
  };

  return (
    <Container
      maxWidth="md"
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        textAlign: "center",
      }}
    >
      {/* 로고 이미지 20개 나열 */}
      <Box 
        sx={{
          display: "flex", 
          flexWrap: "wrap", 
          justifyContent: "center", 
          alignItems: "center",
          gap: 2, 
          mb: 4
        }}
      >
        <img src={logoImage1} alt="Logo 1" style={{ maxHeight: 80, margin: 4 }} />
        <img src={logoImage2} alt="Logo 2" style={{ maxHeight: 80, margin: 4 }} />
        <img src={logoImage3} alt="Logo 3" style={{ maxHeight: 80, margin: 4 }} />
        <img src={logoImage4} alt="Logo 4" style={{ maxHeight: 80, margin: 4 }} />
        <img src={logoImage5} alt="Logo 5" style={{ maxHeight: 80, margin: 4 }} />
        <img src={logoImage6} alt="Logo 6" style={{ maxHeight: 80, margin: 4 }} />
        <img src={logoImage7} alt="Logo 7" style={{ maxHeight: 80, margin: 4 }} />
        <img src={logoImage8} alt="Logo 8" style={{ maxHeight: 80, margin: 4 }} />
        <img src={logoImage9} alt="Logo 9" style={{ maxHeight: 80, margin: 4 }} />
        <img src={logoImage10} alt="Logo 10" style={{ maxHeight: 80, margin: 4 }} />
      </Box>
      
      <Box sx={{ display: "flex", gap: 4 }}>
        <Button
          variant="contained"
          onClick={() => navigate("/login")}
          sx={buttonStyle}
          aria-label="로그인 페이지로 이동"
        >
          로그인
        </Button>
        <Button
          variant="contained"
          onClick={() => navigate("/join")}
          sx={buttonStyle}
          aria-label="회원가입 페이지로 이동"
        >
          회원가입
        </Button>
      </Box>
    </Container>
  );
}

export default Main;
