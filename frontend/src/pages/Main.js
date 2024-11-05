// Main.js

import React, { useEffect, useState } from "react";
import { Container, Grid, Box, Button, Typography, TextField, Dialog, DialogActions, DialogContent, DialogContentText, Alert } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { UserLogin } from "../api/userAPI";
import { useAuth } from "../context/AuthContext";

import logo5 from '../assets/logo5.png';
import './Main.css'; // CSS 파일 불러오기

function Main() {
  const navigate = useNavigate();
  const { setUserObject } = useAuth();
  const [userid, setUserId] = useState("");
  const [userpw, setUserpw] = useState("");
  const [userInfo, setUserInfo] = useState(null);
  const [message, setMessage] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState(null);

  useEffect(() => {
    const savedUserInfo = localStorage.getItem('userInfo') || sessionStorage.getItem('userInfo'); 
    if (savedUserInfo) {
      navigate('/menu');
    }
  }, [navigate]);

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
        setUserObject(response.userInfo);

        if (response.userInfo.is_admin) {
          navigate('/admin');          
        } else {
          setDialogOpen(true);
        }
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
      sessionStorage.setItem("userInfo", JSON.stringify(userInfo));
      setAlertMessage("로그인에 성공하였습니다.");
      setTimeout(() => {
        setAlertMessage(null);
        navigate("/menu");
      }, 3000);
    }
  };

  const handleLocalStorage = () => {
    if (userInfo) {
      localStorage.setItem("userInfo", JSON.stringify(userInfo));
      sessionStorage.setItem("userInfo", JSON.stringify(userInfo));
      setDialogOpen(false);
      setAlertMessage("자동 로그인이 설정되었습니다.");
      setTimeout(() => {
        setAlertMessage(null);
        navigate("/menu");
      }, 3000);
    }
  };

  return (
    <Container maxWidth="lg" className="container">
      {alertMessage && (
        <Alert variant="filled" severity="success" className="alert-message">
          {alertMessage}
        </Alert>
      )}

      <Box className="logo-box">
        <Box component="img" src={logo5} alt="Logo" className="logo" />
      </Box>
      
      <Grid container spacing={4} sx={{ flex: 1, alignItems: "center", zIndex: 2 }}>
        
        <Grid item xs={12} md={6}>
          <Box className="description-box">
            <Typography variant="h6" sx={{ fontWeight: "bold", mb: 1, mt: 4 }}>오디오북 목소리 설정</Typography>
            <Typography variant="body2" sx={{ color: '#333', mb: 3 }}>
              Our product effortlessly adjusts to your needs, boosting efficiency and simplifying your tasks.
            </Typography>

            <Typography variant="h6" sx={{ fontWeight: "bold", mb: 1 }}>가족 목소리 녹음 재생</Typography>
            <Typography variant="body2" sx={{ color: '#333', mb: 3 }}>
              Experience unmatched durability that goes above and beyond with lasting investment.
            </Typography>

            <Typography variant="h6" sx={{ fontWeight: "bold", mb: 1 }}>Great user experience</Typography>
            <Typography variant="body2" sx={{ color: '#333', mb: 3 }}>
              Integrate our product into your routine with an intuitive and easy-to-use interface.
            </Typography>

            <Typography variant="h6" sx={{ fontWeight: "bold", mb: 1 }}>Innovative functionality</Typography>
            <Typography variant="body2" sx={{ color: '#333', mb: 3 }}>
              Stay ahead with features that set new standards, addressing your evolving needs better than the rest.
            </Typography>
          </Box>
        </Grid>

        <Grid item xs={12} md={6} sx={{ display: "flex", justifyContent: "center", zIndex: 2 }}>
          <Box className="card-container">
            <Typography variant="h5" sx={{ fontWeight: "bold", mb: 2 }}>로그인</Typography>
            <TextField label="아이디" variant="outlined" fullWidth sx={{ mb: 4 }} onChange={handleInputChange(setUserId)} value={userid} />
            <TextField label="비밀번호" type="password" variant="outlined" fullWidth sx={{ mb: 3 }} onChange={handleInputChange(setUserpw)} value={userpw} />
            {message && (
              <Typography sx={{ color: "red", mt: 1, textAlign: "center" }}>
                {message}
              </Typography>
            )}
            <Grid container direction="column" alignItems="center" spacing={1} className="card-actions">
              <Grid item>
                <Button variant="contained" color="primary" onClick={handleUserLogin} className="button-style">
                  로그인
                </Button>
              </Grid>
              <Grid item>
                <Button variant="contained" color="primary" onClick={() => navigate("/join")} className="button-style">
                  회원가입
                </Button>
              </Grid>
            </Grid>
          </Box>
        </Grid>
      </Grid>

      <Dialog open={dialogOpen} onClose={handleCloseDialog}>
        <DialogContent>
          <DialogContentText>자동 로그인을 설정하시겠습니까?</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleLocalStorage}>네</Button>
          <Button onClick={handleCloseDialog}>아니오</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

export default Main;
