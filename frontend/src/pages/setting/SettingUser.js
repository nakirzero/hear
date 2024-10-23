import React from "react";
import { Typography, Container, Box, Button, TextField } from "@mui/material";
import { useNavigate } from "react-router-dom";

import Header from "../../components/Header";
import Breadcrumb from "../../components/BreadCrumb";
import ProfileSection from "../../components/ProfileSection";
import Footer from "../../components/Footer";

const SettingUser = () => {
  const navigate = useNavigate();

  return (
    <div>
      <Header />
      <Breadcrumb />
      <ProfileSection />

      {/* Main Content */}
      <Container maxWidth="sm" sx={{ mt: 4 }}>
        {/* Pitch Adjustment */}
        <Typography variant="subtitle1" sx={{ mt: 3 }} align="center">
          회원정보수정
        </Typography>
        <Box sx={{ display: "flex", justifyContent: "center", gap: 2, mt: 4 }}>
          <TextField id="outlined-basic" label="아이디" variant="outlined" />
          <TextField id="outlined-basic" label="비밀번호" variant="outlined" />
          <TextField id="outlined-basic" label="닉네임" variant="outlined" />
        </Box>

        {/* Buttons */}
        <Box sx={{ display: "flex", justifyContent: "center", gap: 5, mt: 4 }}>
          <Button variant="contained">저장하기</Button>
          <Button variant="outlined">취소</Button>
        </Box>
      </Container>

      <Box
        onClick={() => navigate("/menu")}
        sx={{
          backgroundColor: "#e0e0e0",
          py: 3,
          mt: 1,
          textAlign: "center",
        }}
      >
        <Typography>홈으로</Typography>
      </Box>
      <Footer />
    </div>
  );
};

export default SettingUser;
