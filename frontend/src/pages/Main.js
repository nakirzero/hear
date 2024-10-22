import React from "react";
import { Container, Typography, Box, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

function Main() {
  const navigate = useNavigate();

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
      <Typography variant="h3" sx={{ mb: 4 }}>
        H - ear
      </Typography>
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
