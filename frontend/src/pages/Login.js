import React, { useState } from "react";
import { TextField, Button, Box, Typography, Grid, Dialog, DialogActions, DialogContent, DialogContentText, Alert } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { UserLogin } from "../api/userAPI";
import { useAuth } from "../context/AuthContext"; // AuthContext 사용

function Login() {
  const navigate = useNavigate();
  const { setUserObject } = useAuth(); // 전역 상태를 설정할 수 있도록 추가
  const [userid, setUserId] = useState("");
  const [userpw, setUserpw] = useState("");
  const [userInfo, setUserInfo] = useState(null);
  const [message, setMessage] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState(null);

  const handleInputChange = (setter) => (e) => setter(e.target.value);

  const handleUserLogin = async () => {
    if (!userid || !userpw) {
      setMessage("아이디 또는 비밀번호를 입력해주세요.");
      return;
    }
    try {
      const response = await UserLogin(userid, userpw);
      if (response) {
        setUserInfo(response.userInfo);
        setUserObject(response.userInfo); // 로그인 성공 시 AuthContext 업데이트
        setDialogOpen(true);
      } else {
        setMessage("아이디 혹은 비밀번호가 잘못되었습니다.");
      }
    } catch {
      setMessage("로그인 중 오류가 발생했습니다.");
    }
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    if (userInfo) {
      sessionStorage.setItem("userInfo", JSON.stringify({ userInfo }));
      setAlertMessage("로그인에 성공하였습니다.");
      setTimeout(() => {
        setAlertMessage(null);
        navigate("/menu");
      }, 3000);
    }
  };

  const handleLocalStorage = () => {
    if (userInfo) {
      localStorage.setItem("userInfo", JSON.stringify({ userInfo }));
      sessionStorage.setItem("userInfo", JSON.stringify({ userInfo }));
      setDialogOpen(false);
      setAlertMessage("자동 로그인이 설정되었습니다.");
      setTimeout(() => {
        setAlertMessage(null);
        navigate("/menu");
      }, 3000);
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
      {alertMessage && (
        <Alert variant="filled" severity="success" sx={{ mb: 4 }}>
          {alertMessage}
        </Alert>
      )}

      <Typography variant="h4" sx={{ mb: 4, fontWeight: "bold", textAlign: "center" }}>
        H-ear 로그인
      </Typography>

      <Box sx={{ width: "100%", maxWidth: 600, padding: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={3}>
            <Typography sx={{ textAlign: "right" }}>아이디</Typography>
          </Grid>
          <Grid item xs={9}>
            <TextField fullWidth onChange={handleInputChange(setUserId)} value={userid} />
          </Grid>
          <Grid item xs={3}>
            <Typography sx={{ textAlign: "right" }}>비밀번호</Typography>
          </Grid>
          <Grid item xs={9}>
            <TextField fullWidth type="password" onChange={handleInputChange(setUserpw)} value={userpw} />
          </Grid>
        </Grid>

        {message && (
          <Typography
            sx={{ color: "red", mt: 1, textAlign: "center" }}
          >
            {message}
          </Typography>
        )}

        <Grid container spacing={2} sx={{ mt: 3 }}>
          <Grid item xs={6}>
            <Button variant="contained" onClick={handleUserLogin} fullWidth>
              로그인
            </Button>
          </Grid>
          <Grid item xs={6}>
            <Button variant="contained" onClick={() => navigate("/")} fullWidth>
              취소
            </Button>
          </Grid>
        </Grid>
      </Box>

      <Dialog open={dialogOpen} onClose={handleCloseDialog}>
        <DialogContent>
          <DialogContentText>자동 로그인을 설정하시겠습니까?</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleLocalStorage}>네</Button>
          <Button onClick={handleCloseDialog}>아니오</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default Login;
