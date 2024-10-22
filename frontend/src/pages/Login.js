import React from "react";
import { TextField, Button, Box, Typography, Grid } from "@mui/material";
import { useNavigate } from 'react-router-dom';

function Login() {
  const navigate = useNavigate();
  
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
        H-ear 로그인
      </Typography>

      <Box sx={{ width: "100%", maxWidth: 600, padding: 3 }}>
        <Grid container spacing={2}>
          <Grid item xs={3}>
            <Typography sx={{ textAlign: "right" }}>아이디</Typography>
          </Grid>
          <Grid item xs={9}>
            <TextField fullWidth />
          </Grid>
          <Grid item xs={3}>
            <Typography sx={{ textAlign: "right" }}>비밀번호</Typography>
          </Grid>
          <Grid item xs={9}>
            <TextField fullWidth type="password" />
          </Grid>
        </Grid>

        <Grid container spacing={2}>
          <Grid item xs={6}>
            <Button variant="contained" sx={{ mt: 3, width: "100%" }}>
              로그인
            </Button>
          </Grid>
          <Grid item xs={6}>
            <Button variant="contained" onClick={() => navigate('/')} sx={{ mt: 3, width: "100%" }}>
              취소
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}

export default Login;
