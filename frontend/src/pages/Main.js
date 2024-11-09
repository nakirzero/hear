import React, { useEffect, useState } from "react";
import {
  Container,
  Grid,
  Box,
  Button,
  Card,
  CardContent,
  Typography,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  Alert,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { UserLogin } from "../api/userAPI";
import logo1 from "../assets/logo1.png";
import { jwtDecode } from "jwt-decode";
import { useAuth } from "../context/AuthContext";
import {
  AutoStories,
  InterpreterMode,
  House,
  LibraryBooks,
} from "@mui/icons-material";

function Main() {
  const navigate = useNavigate();
  const [userid, setUserId] = useState("");
  const [userpw, setUserpw] = useState("");
  const [message, setMessage] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState(null);
  const { setUserObject } = useAuth();

  useEffect(() => {
    const token =
      localStorage.getItem("token") || sessionStorage.getItem("token");
    if (token) {
      navigate("/menu");
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
      if (response && response.token) {
        // token을 sessionStorage에 기본 저장
        sessionStorage.setItem("token", response.token);
  
        // JWT 토큰 디코딩 및 전역 상태 업데이트
        const decodedUser = jwtDecode(response.token);
        setUserObject(decodedUser);
  
        if (decodedUser.is_admin) {
          navigate("/dashboard");
        } else {
          setDialogOpen(true);
        }
      } else {
        setMessage("아이디 혹은 비밀번호가 잘못되었습니다.");
      }
    } catch (error) {
      setMessage("로그인 중 오류가 발생했습니다.");
      console.error("Login error:", error);
    }
  };

  const handlePersistChoice = (persist) => {
    if (persist) {
      const token = sessionStorage.getItem("token");
      if (token) {
        localStorage.setItem("token", token);
        sessionStorage.removeItem("token"); // sessionStorage에서 삭제
      }
    }
  
    // 다이얼로그 닫기 및 페이지 이동
    setDialogOpen(false);
    setAlertMessage("로그인에 성공하였습니다.");
    setTimeout(() => {
      setAlertMessage(null);
      navigate("/menu");
    }, 1000);
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
        backgroundColor: "#F7FAFF",
      }}
    >
      {alertMessage && (
        <Alert variant="filled" severity="success" className="alert-message">
          {alertMessage}
        </Alert>
      )}

      <Grid
        container
        spacing={4}
        sx={{ flex: 1, alignItems: "center", zIndex: 2 }}
      >
        {/* 좌측 카드형태 설명 섹션 */}
        <Grid item xs={12} md={6}>
          <Card
            sx={{
              backgroundColor: "#FFB74D",
              width: "100%",
              maxWidth: 500,
              minHeight: 550, // 좌측 카드의 높이와 동일하게 설정
              padding: 3,
              boxShadow: 10,
              borderRadius: 2,
              marginLeft: "50px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
            }}
          >
             <Box display="flex" alignItems="center" justifyContent={'left'}
              gap={1}>
             <House fontSize="large" sx={{ color: "#000000" }} />
              <Typography variant="h6"  sx={{ mb: 2, mt: 2 }}>
                가족의 목소리로 도서 재생
              </Typography>
              </Box>
              {/* <Typography variant="body2" textAlign='left' sx={{ color: "#333" }}>
            [ 가족의 목소리로 책을 읽어주는 AI ]
            </Typography> */}
            <Typography variant="body2" textAlign='left' sx={{ color: "#333", mb: 3 }}>
가족의 목소리를 학습한 AI로 책을 읽으며 따뜻한 심리적 안정감을 느껴보세요.
            </Typography>


            <Box display="flex" alignItems="center" justifyContent={'left'}
              gap={1}>
              <AutoStories fontSize="large" sx={{ color: "#000000" }} />
              <Typography variant="h6" sx={{ mb: 2, mt: 3 }}>
                 자연스러운 목소리로 몰입감 향상
              </Typography>
            </Box>
            {/* <Typography variant="body2" fontWeight='bold' fontSize=' 16px' textAlign='center' sx={{ color: "#333", mb: 1 }}>
            [ 몰입을 더하는 자연스러운 음성 ]
            </Typography> */}
            <Typography variant="body2" textAlign='left' sx={{ color: "#333", mb: 3 }}>
            기계적인 음성을 넘어선, 듣기 편하고 자연스러운 음성으로 몰입감을 높입니다
            </Typography>

            <Box display="flex" alignItems="center" justifyContent={'left'}
              gap={1}>
              <InterpreterMode fontSize="large" sx={{ color: "#000000" }} />
              <Typography variant="h6" sx={{ mb: 2, mt: 3 }}>
                사용자를 위한 편의성과 접근성 제공
              </Typography>
            </Box>
            {/* <Typography variant="body2" fontWeight='bold' fontSize=' 18px' textAlign='center' sx={{ color: "#333", mb: 1 }}>
            [ 편리하고 접근성 높은 서비스 ]
            </Typography> */}
            <Typography variant="body2" textAlign='left' sx={{ color: "#333", mb: 3 }}>
음성 명령과 사용자 친화적인 UX/UI로 누구나 쉽게 사용할 수 있습니다.
            </Typography>

            <Box display="flex" alignItems="center" justifyContent={'left'}
              gap={1}>
              <LibraryBooks fontSize="large" sx={{ color: "#000000" }} />
              <Typography variant="h6" sx={{ mb: 2, mt: 3 }}>
                ChatGPT를 활용한 요약 낭독 기능
              </Typography>
            </Box>
            {/* <Typography variant="body2" fontWeight='bold' fontSize=' 18px' textAlign='center' sx={{ color: "#333", mb: 1 }}>
            [ 책의 핵심만 쏙쏙! ]
            </Typography> */}
            <Typography variant="body2" textAlign='left' sx={{ color: "#333", mb: 3 }}>
            ChatGPT를 활용해 책 내용을 요약하고 하이라이트를 간단히 들려드립니다.
            </Typography>
          </Card>
        </Grid>

        {/* 우측 로그인 카드 */}
        <Grid item xs={12} md={6}>
          <Card
            sx={{
              backgroundColor: "#ffe0b2",
              width: "100%",
              maxWidth: 500,
              minHeight: 550, // 좌측 카드의 높이와 동일하게 설정
              padding: 3,
              textAlign: "center",
              boxShadow: 10,
              borderRadius: 2,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Box
              component="img"
              src={logo1}
              alt="Logo"
              sx={{
                position: "absolute",
                marginTop: "-380px",
                marginLeft: "-15px",
                height: 80,
                width: "auto",
              }}
            />
            <CardContent sx={{ width: "100%", mt: 10 }}>
              {" "}
              {/* 텍스트 필드와 버튼을 아래로 배치하기 위해 marginTop을 추가 */}
              <TextField
                label="아이디"
                variant="outlined"
                fullWidth
                sx={{ mb: 4, backgroundColor: "#FFFFFF", borderRadius: 1 }}
                onChange={handleInputChange(setUserId)}
                value={userid}
              />
              <TextField
                label="패스워드"
                type="password"
                variant="outlined"
                fullWidth
                sx={{ mb: 3, backgroundColor: "#FFFFFF", borderRadius: 1 }}
                onChange={handleInputChange(setUserpw)}
                value={userpw}
              />
              {message && (
                <Typography className="error-message">{message}</Typography>
              )}
            </CardContent>

            <Box
              sx={{
                width: "100%",
                display: "flex",
                flexDirection: "column",
                gap: 3,
                alignItems: "center",
                justifyContent: "center",
                mt: 2,
              }}
            >
              <Button
                variant="contained"
                color="primary"
                sx={buttonStyle}
                onClick={handleUserLogin}
              >
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
            </Box>
          </Card>
        </Grid>
      </Grid>
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
        <DialogContent>
          <DialogContentText>자동 로그인을 설정하시겠습니까?</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => handlePersistChoice(true)}>네</Button>
          <Button onClick={() => handlePersistChoice(false)}>아니오</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

export default Main;
