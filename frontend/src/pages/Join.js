import { useState, useEffect } from "react";
import { TextField, Button, Box, Typography, Grid } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { checkUserId, joinSubmit } from "../api/userAPI";

function Join() {
  const navigate = useNavigate();
  const [message, setMessage] = useState("");
  const [pwMessage, setpwMessage] = useState("");
  const [formData, setFormData] = useState({
    userId: "",
    pw: "",
    pwok: "",
    disabled: "",
  });

  const handleJoinInput = ({ target: { name, value } }) => {
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleCheckUserId = async () => {
    try {
      if (!formData.userId) {
        setMessage("아이디를 입력해주세요.");
        return;
      }
      const exists = await checkUserId(formData.userId);
      setMessage(
        exists ? "아이디가 이미 사용 중입니다." : "사용 가능한 아이디입니다."
      );
    } catch {
      setMessage("아이디 확인 중 오류가 발생했습니다.");
    }
  };

  useEffect(() => {
    if (!formData.pw && !formData.pwok) {
      setpwMessage("");
      return;
    }
    if (!formData.pw || !formData.pwok) {
      setpwMessage("비밀번호와 비밀번호 확인을 모두 입력해주세요.");
      return;
    }
    if (formData.pw === formData.pwok) {
      setpwMessage("패스워드가 일치합니다.");
    } else {
      setpwMessage("패스워드가 일치하지 않습니다.");
    }
  }, [formData.pw, formData.pwok]); // pw나 pwok가 변경될 때마다 실행

  const handleJoin = async (e) => {
    e.preventDefault();
    try {
      const message = await joinSubmit(e, formData);
      console.log(
        message ? "회원가입을 완료하였습니다." : "회원가입에 실패하였습니다."
      );
      if (message) {
        navigate('/login');
      }
    } catch {
      console.log("회원가입 중 오류가 발생했습니다.");
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
        H-ear 회원가입
      </Typography>
      <form onSubmit={handleJoin}>
        <Box sx={{ width: "100%", maxWidth: 600, padding: 3 }}>
          <Grid container spacing={2} alignItems="center">
            {/* 아이디 */}
            <Grid item xs={3}>
              <Typography sx={{ textAlign: "right" }}>아이디</Typography>
            </Grid>
            <Grid item xs={7}>
              <TextField
                fullWidth
                name="userId"
                onChange={handleJoinInput}
                value={formData.userId}
              />
            </Grid>
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
            {message && (
              <Grid item xs={12}>
                <Typography
                  sx={{
                    color: message.includes("가능") ? "green" : "red",
                    mt: 1,
                    textAlign: "center",
                  }}
                >
                  {message}
                </Typography>
              </Grid>
            )}

            {/* 비밀번호 */}
            <Grid item xs={3}>
              <Typography sx={{ textAlign: "right" }}>비밀번호</Typography>
            </Grid>
            <Grid item xs={7}>
              <TextField
                fullWidth
                type="password"
                name="pw"
                onChange={handleJoinInput}
                value={formData.pw}
              />
            </Grid>

            {/* 비밀번호 확인 */}
            <Grid item xs={3}>
              <Typography sx={{ textAlign: "right" }}>비밀번호 확인</Typography>
            </Grid>
            <Grid item xs={7}>
              <TextField
                fullWidth
                type="password"
                name="pwok"
                onChange={handleJoinInput}
                value={formData.pwok}
              />
            </Grid>

            {/* 비밀번호 일치 확인 */}
            {pwMessage && (
              <Grid item xs={12}>
                <Typography
                  sx={{
                    color: pwMessage.includes("일치합니다") ? "green" : "red",
                    mt: 1,
                    textAlign: "center",
                  }}
                >
                  {pwMessage}
                </Typography>
              </Grid>
            )}

            {/* 장애등록코드 */}
            <Grid item xs={3}>
              <Typography sx={{ textAlign: "right" }}>장애등록코드</Typography>
            </Grid>
            <Grid item xs={7}>
              <TextField
                fullWidth
                name="disabled"
                onChange={handleJoinInput}
                value={formData.disabled}
              />
            </Grid>
          </Grid>

          {/* 가입 완료, 취소 버튼 */}
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <Button
                type="submit"
                variant="contained"
                sx={{ mt: 3, width: "100%" }}
              >
                가입완료
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
      </form>
    </Box>
  );
}

export default Join;
