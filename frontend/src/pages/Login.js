import React, { useState } from "react";
import { TextField, Button, Box, Typography, Grid } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { UserLogin } from "../api/userAPI";
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import Alert from '@mui/material/Alert';

function Login() {
  const navigate = useNavigate();

  const [userid, setUserId] = useState("");
  const [userpw, setUserpw] = useState("");
  const [userInfo, setUserInfo] = useState("");
  const [message, setMessage] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState(null);

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
      const response = await UserLogin(userid, userpw);
      console.log('response', response);
      
      if (response) {
        setUserInfo(response.userInfo);
        setDialogOpen(true);
      } else {
        setMessage("아이디 혹은 비밀번호 오류");
      }
    } catch {
      setMessage("아이디 혹은 비밀번호 오류2.");
    }
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    sessionStorage.setItem("userInfo", JSON.stringify({ userInfo })); // 세션 저장 예시
    setAlertMessage("로그인에 성공하였습니다."); // 알림 설정

    setTimeout(() => {
      setAlertMessage(null); // 3초 후에 알림을 숨기기 위한 타이머 설정
      navigate("/menu"); // 메뉴 페이지로 이동
    }, 3000);
  };

  const handleLocalStorage = () => {
    if (userid && userpw) {
      localStorage.setItem("userInfo", JSON.stringify({ userInfo })); // userInfo 저장
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
      {/* 로그인 성공 시 알림 */}
      {alertMessage && (
        <Alert variant="filled" severity="success" sx={{ mb: 4 }}>
          {alertMessage}
        </Alert>
      )}
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
        {/* 비밀번호 실패 문구 */}
        {message && (
              <Grid item xs={12}>
                <Typography
                  sx={{
                    color: message.includes("비밀번호를 확인해주세요") ? "red" : "red",
                    mt: 1,
                    textAlign: "center",
                  }}
                >
                  {message}
                </Typography>
              </Grid>
            )}

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
      </Box>

       {/* 다이얼로그 */}
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
