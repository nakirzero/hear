import React, { useState } from "react";
import { TextField, Button, Box, Typography, Grid } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { UserLogin } from "../api/user";

function Login() {
  const navigate = useNavigate();

  const [userid, setUserId] = useState("");
  const [userpw, setUserpw] = useState("");
  const [message, setMessage] = useState("");

  const handleIdChange = (e) => {
    setUserId(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setUserpw(e.target.value);
  };

  const handleUserLogin = async () => {
    try {
      if (!userid || !userpw) {
        setMessage("아이디 또는 비밀번호를 입력해주세요.");
        return;
      }
      const exists = await UserLogin(userid, userpw);
      console.log("exists", exists);

      setMessage(exists ? "로그인 성공." : "아이디 혹은 비밀번호 오류1");
      if (exists) {
        navigate("/menu");
      } else {
        setMessage("아이디 혹은 비밀번호 오류");
      }
    } catch {
      setMessage("아이디 혹은 비밀번호 오류2.");
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
        padding: 2,
      }}
    >
      <Typography
        variant="h4"
        sx={{ mb: 4, fontWeight: "bold", textAlign: "center" }}
      >
        H-ear 로그인
      </Typography>

      <Box sx={{ width: "100%", maxWidth: 600, padding: 3 }}>
        <Grid container spacing={2}>
          <Grid item xs={3}>
            <Typography sx={{ textAlign: "right" }}>아이디</Typography>
          </Grid>
          <Grid item xs={9}>
            <TextField fullWidth onChange={handleIdChange} value={userid} />
          </Grid>
          <Grid item xs={3}>
            <Typography sx={{ textAlign: "right" }}>비밀번호</Typography>
          </Grid>
          <Grid item xs={9}>
            <TextField
              fullWidth
              type="password"
              onChange={handlePasswordChange}
              value={userpw}
            />
          </Grid>
        </Grid>

        <Grid container spacing={2}>
          <Grid item xs={6}>
            <Button
              variant="contained"
              onClick={handleUserLogin}
              sx={{ mt: 3, width: "100%" }}
            >
              로그인
            </Button>
          </Grid>
          <Grid item xs={6}>
            <Button
              variant="contained"
              onClick={() => navigate("/")}
              sx={{ mt: 3, width: "100%" }}
            >
              취소
            </Button>
          </Grid>
        </Grid>
        <Grid item xs={12}>
          {console.log('message', message)}
          {message && (
            <Typography
              sx={{
                color: "red",
                mt: 1,
                textAlign: "center",
              }}
            >
              {message}
            </Typography>
          )}
        </Grid>
      </Box>
    </Box>
  );
}

export default Login;
