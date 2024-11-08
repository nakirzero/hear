import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Typography,
  Paper,
  Toolbar,
  CssBaseline,
  ThemeProvider,
  Container,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import CustomAppBar from "../../components/CustomAppBar.js";
import DrawerComponent from "../../components/DrawerComponent.js";
import theme from "../../../../theme.js";
import Copyright from "../../components/Copyright.js";
import { fetchRecentNotices, deleteNotice } from "../../api/NoticeAPI.js"; // deleteNotice 함수 임포트
import NoticeWriteModal from "./NoticeWriteModal.js";
import NoticeUpdateModal from "./NoticeUpdateModal.js"; // 업데이트 모달 임포트

const NoticeList = () => {
  const [notices, setNotices] = useState([]);
  const [open, setOpen] = useState(true);
  const [openWriteModal, setOpenWriteModal] = useState(false);
  const [openUpdateModal, setOpenUpdateModal] = useState(false); // 업데이트 모달 상태
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false); // 삭제 다이얼로그 상태
  const [selectedNotice, setSelectedNotice] = useState(null); // 선택된 공지사항

  const getNotices = async () => {
    try {
      const result = await fetchRecentNotices();
      setNotices(result);
    } catch (error) {
      console.error("Error fetching notices:", error);
    }
  };

  useEffect(() => {
    getNotices();
  }, []);

  const toggleDrawer = () => {
    setOpen(!open);
  };

  const handleOpenWriteModal = () => {
    setOpenWriteModal(true);
  };

  const handleCloseWriteModal = () => {
    setOpenWriteModal(false);
  };

  const handleOpenUpdateModal = (notice) => {
    setSelectedNotice(notice);
    setOpenUpdateModal(true);
  };

  const handleCloseUpdateModal = () => {
    setSelectedNotice(null);
    setOpenUpdateModal(false);
  };

  const handleSuccessWrite = () => {
    getNotices(); // 글쓰기 성공 시 목록 새로고침
  };

  const handleSuccessUpdate = () => {
    getNotices(); // 업데이트 성공 시 목록 새로고침
  };

  // 삭제 다이얼로그 핸들러
  const handleOpenDeleteDialog = (notice) => {
    setSelectedNotice(notice);
    setOpenDeleteDialog(true);
  };

  const handleCloseDeleteDialog = () => {
    setSelectedNotice(null);
    setOpenDeleteDialog(false);
  };

  const handleDeleteNotice = async () => {
    try {
      await deleteNotice(selectedNotice.NOTICE_SEQ); // 선택된 공지사항 삭제
      getNotices(); // 목록 새로고침
      handleCloseDeleteDialog(); // 다이얼로그 닫기
    } catch (error) {
      console.error("Error deleting notice:", error);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ display: "flex", minHeight: "100vh", overflowX: "hidden" }}>
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
            overflowY: "auto",
            height: "100vh",
          }}
        >
          <Toolbar />
          <Container
            sx={{
              height: "calc(100vh - 64px)",
              display: "flex",
              flexDirection: "column",
              py: 4,
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="h4" gutterBottom>
                공지사항 목록
              </Typography>
              <Button variant="contained" color="primary" onClick={handleOpenWriteModal}>
                글쓰기
              </Button>
            </Box>

            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>제목</TableCell>
                    <TableCell>작성일</TableCell>
                    <TableCell>작성자</TableCell>
                    <TableCell>액션</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {notices.map((notice, index) => (
                    <TableRow key={index}>
                      <TableCell>{notice.NOTICE_TITLE}</TableCell>
                      <TableCell>
                        {new Date(notice.NOTICE_CrtDt).toLocaleDateString("ko-KR")}
                      </TableCell>
                      <TableCell>{notice.NICKNAME || "관리자"}</TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', gap: 1 }}> {/* gap을 통해 버튼 사이에 간격 추가 */}
                          <Button
                            variant="outlined"
                            size="small"
                            onClick={() => handleOpenUpdateModal(notice)}
                          >
                            수정
                          </Button>
                          <Button
                            variant="outlined"
                            size="small"
                            color="error"
                            onClick={() => handleOpenDeleteDialog(notice)}
                          >
                            삭제
                          </Button>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Container>
        </Box>
      </Box>
      <NoticeWriteModal
        open={openWriteModal}
        onClose={handleCloseWriteModal}
        onSuccess={handleSuccessWrite}
      />
      <NoticeUpdateModal
        open={openUpdateModal}
        onClose={handleCloseUpdateModal}
        notice={selectedNotice}
        onSuccess={handleSuccessUpdate}
      />

      {/* 삭제 확인 다이얼로그 */}
      <Dialog open={openDeleteDialog} onClose={handleCloseDeleteDialog}>
        <DialogTitle>삭제 확인</DialogTitle>
        <DialogContent>
          <DialogContentText>
            정말로 이 공지사항을 삭제하시겠습니까?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog} color="primary">
            아니요
          </Button>
          <Button onClick={handleDeleteNotice} color="error">
            네, 삭제합니다.
          </Button>
        </DialogActions>
      </Dialog>

      <Copyright />
    </ThemeProvider>
  );
};

export default NoticeList;
