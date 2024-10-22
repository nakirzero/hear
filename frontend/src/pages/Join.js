import { useState } from "react";
import { TextField, Button, Box, Typography, Grid } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { checkUserId } from "../api/user";

function Join() {
  const navigate = useNavigate();

  const [userid, setUserId] = useState("");
  const [message, setMessage] = useState("");

  const handleUserIdChange = (e) => {
    setUserId(e.target.value);
  };

  const handleCheckUserId = async () => {
    try {
      if (!userid) {
        setMessage("아이디를 입력해주세요.");
        return;
      }
      const exists = await checkUserId(userid);
      setMessage(exists ? "아이디가 이미 사용 중입니다." : "사용 가능한 아이디입니다.");
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
        padding: 2,
      }}
    >
      <Typography variant="h4" sx={{ mb: 4, fontWeight: "bold", textAlign: "center" }}>
        H-ear 회원가입
      </Typography>

      <Box sx={{ width: "100%", maxWidth: 600, padding: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={3}>
            <Typography sx={{ textAlign: "right" }}>아이디</Typography>
          </Grid>
          <Grid item xs={7}>
            <TextField fullWidth onChange={handleUserIdChange} />
          </Grid>
          <Grid item xs={2} sx={{ textAlign: "right" }}>
            <Button onClick={handleCheckUserId} variant="contained" size="small">
              중복확인
            </Button>
          </Grid>

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

          <Grid item xs={3}>
            <Typography sx={{ textAlign: "right" }}>비밀번호</Typography>
          </Grid>
          <Grid item xs={7}>
            <TextField fullWidth type="password" />
          </Grid>

          <Grid item xs={3}>
            <Typography sx={{ textAlign: "right" }}>비밀번호 확인</Typography>
          </Grid>
          <Grid item xs={7}>
            <TextField fullWidth type="password" />
          </Grid>

          <Grid item xs={3}>
            <Typography sx={{ textAlign: "right" }}>장애등록코드</Typography>
          </Grid>
          <Grid item xs={7}>
            <TextField fullWidth />
          </Grid>
        </Grid>

        <Grid container spacing={2}>
          <Grid item xs={6}>
            <Button variant="contained" sx={{ mt: 3, width: "100%" }}>
              가입완료
            </Button>
          </Grid>
          <Grid item xs={6}>
            <Button variant="contained" onClick={() => navigate("/")} sx={{ mt: 3, width: "100%" }}>
              취소
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}

export default Join;
