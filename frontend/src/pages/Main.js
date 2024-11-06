import React, { useEffect, useState } from "react";
import { Container, Grid, Box, Button, Card, CardContent, CardActions, Typography, TextField, Dialog, DialogActions, DialogContent, DialogContentText, Alert } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { UserLogin } from "../api/userAPI";
import { useAuth } from "../context/AuthContext";
import logo1 from '../assets/logo1.png';

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

  const buttonStyle = {
    width: 300,
    height: 50,
    borderRadius: 10,
    fontSize: "1.3rem",
  };



  return (
    <Container 
      maxWidth="lg" 
      sx={{ 
        minHeight: "100vh", 
        display: "flex", 
        flexDirection: "column", 
        position: "relative", 
        backgroundSize: "cover", 
        backgroundPosition: "center", 
        backgroundRepeat: "no-repeat",
        backgroundColor:  "#F7FAFF"
      }}
    >
        {alertMessage && (
      <Alert variant="filled" severity="success" className="alert-message">
        {alertMessage}
      </Alert>
  )}
      
      <Grid container spacing={4} sx={{ flex: 1, alignItems: "center", zIndex: 2 }}>
        
        {/* 좌측 카드형태 설명 섹션 */}
        <Grid item xs={12} md={6}>
          <Card 
            sx={{ 
              backgroundColor: "#FFB74D", 
              padding: 3, 
              borderRadius: 2, 
              position: "relative", 
              boxShadow: 3,
              ml: 4,
              border: "none",
              overflow: "visible"
            }}
          >
            <Box
              component="img"
              src={logo1}
              alt="Logo"
              sx={{
                position: "absolute",
                top: "-35px",
                left: "10px",
                height: 80,
                width: "auto",
              }}
            />

            <Typography variant="h6" sx={{ fontWeight: "bold", mb: 1, mt: 6 }}>오디오북 목소리 설정</Typography>
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
          </Card>
        </Grid>

       {/* 우측 로그인 카드 */}
<Grid item xs={12} md={6}>
  <Card 
    sx={{ 
      backgroundColor: "rgba(255, 224, 178, 0.8)", 
      width: "100%", 
      maxWidth: 500, 
      minHeight: 510, // 좌측 카드의 높이와 동일하게 설정
      padding: 3, 
      textAlign: "center", 
      boxShadow: 10, 
      borderRadius: 2,
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center"
    }}
  >
    <CardContent sx={{ width: "100%" }}>
      <Typography variant="h6" sx={{ mb: 2, gap: '10px', marginTop: '-20px' }}>로그인</Typography>

      <TextField
        label="아이디"
        variant="outlined"
        fullWidth
        sx={{ mb: 4, backgroundColor: "#FFFFFF", borderRadius: 1 }}
        onChange={handleInputChange(setUserId)} value={userid} />

      <TextField
        label="패스워드"
        type="password"
        variant="outlined"
        fullWidth
        sx={{ mb: 3, backgroundColor: "#FFFFFF", borderRadius: 1 }}
        onChange={handleInputChange(setUserpw)} value={userpw} />
   {message && <Typography className="error-message">{message}</Typography>}

    </CardContent>

    <CardActions sx={{ width: "100%", flexDirection: "column", gap: 3 }}>
      <Button
        variant="contained"
        color="primary"
        sx={buttonStyle}
        onClick={handleUserLogin} >
<Typography variant="h6">로그인</Typography>

      </Button>
      <Button
        variant="contained"
        color="primary"
        onClick={() => navigate("/join")}
        sx={buttonStyle}
      >
         <Typography variant="h6">회원가입</Typography>
      </Button>
    </CardActions>
  </Card>
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