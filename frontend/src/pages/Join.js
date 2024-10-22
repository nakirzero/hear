import { useState } from "react";
import { TextField, Button, Box, Typography, Grid } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { checkUserId } from "../api/user"; // API 호출 함수 import

function Join() {
  const navigate = useNavigate();

  const [userid, setUserId] = useState("");
  const [message, setMessage] = useState("");

  const handleUserIdChange = (e) => {
    setUserId(e.target.value);
  };

  const handleCheckUserId = async () => {
    try {
      const exists = await checkUserId(userid);
      if (exists) {
        setMessage("아이디가 이미 사용 중입니다.");
      } else {
        setMessage("사용 가능한 아이디입니다.");
      }
    } catch {
      setMessage("아이디 확인 중 오류가 발생했습니다.");
    }
  };

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
        H-ear 회원가입
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
            <Typography
              sx={{ textAlign: "right" }}
            >
              아이디
            </Typography>
          </Grid>
          <Grid item xs={7}>
            <TextField
              fullWidth
              onChange={handleUserIdChange}
              sx={{
                backgroundColor: "#fff" /* 배경을 흰색으로 설정 */,
                borderRadius: 1,
              }}
            />
          </Grid>

          {/* 중복확인 버튼 */}
          <Grid item xs={2} sx={{ textAlign: "right" }}>
            <Button
              onClick={handleCheckUserId}
              variant="contained"
              size="small"
            >
              중복확인
            </Button>
          </Grid>

          {/* 중복 확인 결과 메시지 */}
          <Grid item xs={12}>
            {message && (
              <Typography
                sx={{
                  color: message.includes("가능") ? "green" : "red",
                  mt: 1,
                  textAlign: "center",
                }}
              >
                {message}
              </Typography>
            )}
          </Grid>

          {/* 비밀번호 필드 */}
          <Grid item xs={3}>
            <Typography sx={{ textAlign: "right" }}>비밀번호</Typography>
          </Grid>
          <Grid item xs={7}>
            <TextField
              fullWidth
              type="password"
              sx={{
                backgroundColor: "#fff" /* 배경을 흰색으로 설정 */,
                borderRadius: 1,
              }}
            />
          </Grid>

          {/* 비밀번호 확인 필드 */}
          <Grid item xs={3}>
            <Typography sx={{ textAlign: "right" }}>비밀번호 확인</Typography>
          </Grid>
          <Grid item xs={7}>
            <TextField
              fullWidth
              type="password"
              sx={{
                backgroundColor: "#fff" /* 배경을 흰색으로 설정 */,
                borderRadius: 1,
              }}
            />
          </Grid>

          {/* 장애등록코드 필드 */}
          <Grid item xs={3}>
            <Typography sx={{ textAlign: "right" }}>장애등록코드</Typography>
          </Grid>
          <Grid item xs={7}>
            <TextField
              fullWidth
              sx={{
                backgroundColor: "#fff" /* 배경을 흰색으로 설정 */,
                borderRadius: 1,
              }}
            />
          </Grid>
        </Grid>

        {/* 가입 완료, 취소 버튼 */}
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <Button
              variant="contained"
              color="primary"
              sx={{ mt: 3, width: "100%" }}
            >
              가입완료
            </Button>
          </Grid>
          <Grid item xs={6}>
            <Button
              variant="contained"
              color="primary"
              onClick={() => navigate("/")}
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

export default Join;
