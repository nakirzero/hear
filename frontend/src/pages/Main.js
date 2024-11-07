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
        const storageType = localStorage; // 예시로 로컬 스토리지 사용
        storageType.setItem("token", response.token);

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
    const token = sessionStorage.getItem("token");
    if (token) {
      const storageType = persist ? localStorage : sessionStorage;
      storageType.setItem("token", token);
      sessionStorage.removeItem("token"); // sessionStorage에서 삭제

      // 다이얼로그 닫기
      setDialogOpen(false);

      setAlertMessage("로그인에 성공하였습니다.");
      setTimeout(() => {
        setAlertMessage(null);
        navigate("/menu");
      }, 1000);
    }
  };

  const handleCloseDialog = () => {
    setDialogOpen(false); // 다이얼로그 닫기
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
            <Box display="flex" alignItems="center" gap={1}>
              <AutoStories fontSize="large" sx={{ color: "#000000" }} />
              <Typography variant="h6" sx={{ mb: 1, mt: 2 }}>
                오디오북 목소리 설정
              </Typography>
            </Box>
            <Typography variant="body2" sx={{ color: "#333", mb: 3 }}>
              Our product effortlessly adjusts to your needs, boosting
              efficiency and simplifying your tasks.
            </Typography>

            <Box display="flex" alignItems="center" gap={1}>
              <InterpreterMode fontSize="large" sx={{ color: "#000000" }} />
              <Typography variant="h6" sx={{ mb: 1, mt: 2 }}>
                가족 목소리 녹음재생
              </Typography>
            </Box>
            <Typography variant="body2" sx={{ color: "#333", mb: 3 }}>
              Our product effortlessly adjusts to your needs, boosting
              efficiency and simplifying your tasks.
            </Typography>

            <Box display="flex" alignItems="center" gap={1}>
              <House fontSize="large" sx={{ color: "#000000" }} />
              <Typography variant="h6" sx={{ mb: 1, mt: 2 }}>
                가족 목소리 녹음재생
              </Typography>
            </Box>
            <Typography variant="body2" sx={{ color: "#333", mb: 3 }}>
              Our product effortlessly adjusts to your needs, boosting
              efficiency and simplifying your tasks.
            </Typography>

            <Box display="flex" alignItems="center" gap={1}>
              <LibraryBooks fontSize="large" sx={{ color: "#000000" }} />
              <Typography variant="h6" sx={{ mb: 1, mt: 2 }}>
                가족 목소리 녹음재생
              </Typography>
            </Box>
            <Typography variant="body2" sx={{ color: "#333", mb: 3 }}>
              Our product effortlessly adjusts to your needs, boosting
              efficiency and simplifying your tasks.
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
      <Dialog open={dialogOpen} onClose={handleCloseDialog}>
        <DialogContent>
          <DialogContentText>자동 로그인을 설정하시겠습니까?</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => handlePersistChoice(true)}>네</Button>
          <Button onClick={handleCloseDialog}>아니오</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

export default Main;
