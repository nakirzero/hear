import * as React from "react";
import { TextField, Button, Box, Typography, Grid } from "@mui/material";
import { useNavigate } from 'react-router-dom';

function Login() {
  const navigate = useNavigate();
  
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        backgroundColor: "#FFD700", // 바깥 노란 배경색
        padding: 2,
      }}
    >
      <Typography
        variant="h4"
        component="h1"
        sx={{ mb: 4, fontWeight: "bold", textAlign: "center" }}
      >
        H-ear 로그인
      </Typography>

      {/* 내부 흰색 박스 */}
      <Box
        sx={{
          width: "100%",
          maxWidth: 600, // 최대 너비를 600px로 설정
          padding: 3,
          borderRadius: 2,
        }}
      >
        <Grid container spacing={2} alignItems="center">
          {/* 아이디 필드 */}
          <Grid item xs={3}>
            <Typography sx={{ textAlign: "right" }}>아이디</Typography>
          </Grid>
          <Grid item xs={9}>
            <TextField
              fullWidth
              sx={{
                backgroundColor: "#fff" /* 배경을 흰색으로 설정 */,
                borderRadius: 1,
              }}
            />
          </Grid>

          {/* 비밀번호 필드 */}
          <Grid item xs={3}>
            <Typography sx={{ textAlign: "right" }}>비밀번호</Typography>
          </Grid>
          <Grid item xs={9}>
            <TextField
              fullWidth
              type="password"
              sx={{
                backgroundColor: "#fff" /* 배경을 흰색으로 설정 */,
                borderRadius: 1,
              }}
            />
          </Grid>
        </Grid>

        {/* 로그인, 취소 버튼 */}
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <Button
              variant="contained"
              color="primary"
              sx={{ mt: 3, width: "100%" }}
            >
              로그인
            </Button>
          </Grid>
          <Grid item xs={6}>
            <Button
              variant="contained"
              color="primary"
              onClick={() => navigate('/')}
              sx={{ mt: 3, width: "100%" }}
            >
              취소
            </Button>
          </Grid>
        </Grid>
      </Box>

      <Box sx={{ mt: 4, textAlign: "center" }}>
        <Typography variant="caption">
          주소: 61740 광주광역시 남구 송암로 60 광주 CGI센터 2층 6강의실
        </Typography>
        <Typography variant="caption">
          TEL: 062.123.4567 FAX: 062.987.6543
        </Typography>
        <Typography variant="caption">
          &copy;Copyright 2024 H-ear all rights reserved.
        </Typography>
      </Box>
    </Box>
  );
}

export default Login;
