import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext.js";
import { fetchNoticeWrite } from "../api/NoticeAPI.js";
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  Toolbar,
  CssBaseline,
  ThemeProvider,
} from "@mui/material";

import DrawerComponent from "../components/DrawerComponent.js";
import theme from "../../../theme";
import Copyright from "../components/Copyright.js";
import CustomAppBar from "../components/CustomAppBar.js";

const NoticeWrite = () => {
  const [open, setOpen] = useState(true);
  const navigate = useNavigate();
  const { userObject } = useAuth();
  const [title, setTitle] = useState('');          
  const [detail, setDetail] = useState('');      


  const toggleDrawer = () => {
    setOpen(!open);
  };


  const handleWriteSubmit = async (event) => {
    event.preventDefault();

    const postData = {
      userseq: userObject?.USER_SEQ,
      nickname: '관리자',
      title,
      detail,
    };

      try {
        const message = await fetchNoticeWrite(postData);
        console.log("서버 응답:", message);

        setTitle("");
        setDetail("");
        navigate("/dashboard");
      } catch (error) {
        console.error("게시글 작성 실패:", error);
      }
    } 
  

  return (
    <div>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Box sx={{ display: "flex", minHeight: "100vh" }}>
          <CustomAppBar open={open} toggleDrawer={toggleDrawer} />
          <DrawerComponent open={open} toggleDrawer={toggleDrawer} />

          <Box
            component="main"
            sx={{
              flexGrow: 1,
              backgroundColor: (theme) =>
                theme.palette.mode === "light"
                  ? theme.palette.grey[100]
                  : theme.palette.grey[900],
              overflow: "auto",
            }}
          >
            <Toolbar />
            <Box
              sx={{
                flex: 1,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Paper elevation={3} sx={{ width: 600, p: 4 }}>
                <Typography variant="h4" gutterBottom>
                  공지사항 작성
                </Typography>

                {/* 사용자 정보 표시 */}
                <Typography variant="subtitle1" gutterBottom>
                  작성자: 관리자
                </Typography>

                <form onSubmit={handleWriteSubmit}>
                  {/* 제목 입력 */}
                  <TextField
                    label="제목"
                    variant="outlined"
                    fullWidth
                    required
                    margin="normal"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />

                  {/* 내용 입력 */}
                  <TextField
                    label="내용"
                    variant="outlined"
                    fullWidth
                    required
                    multiline
                    rows={8}
                    margin="normal"
                    value={detail}
                    onChange={(e) => setDetail(e.target.value)}
                  />

                  {/* 작성 완료 버튼 */}
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    fullWidth
                    sx={{ mt: 3 }}
                  >
                    작성 완료
                  </Button>
                </form>
              </Paper>
            </Box>
          </Box>
        </Box>
        <Copyright />
      </ThemeProvider>
    </div>
  );
};

export default NoticeWrite;
