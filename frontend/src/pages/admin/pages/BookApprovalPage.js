import React, { useState, useEffect } from "react";
import {
  Typography,
  Box,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Toolbar,
  Container,
  Paper,
  CssBaseline,
  ThemeProvider,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
} from "@mui/material";
import CustomAppBar from "../components/CustomAppBar.js";
import DrawerComponent from "../components/DrawerComponent.js";
import theme from "../../../theme";

import { fetchBookRequests, updateBookRequestStatus } from "../api/wishbookAPI.js";

const BookApprovalPage = () => {
  const [bookRequests, setBookRequests] = useState([]);
  const [error, setError] = useState(null);
  const [open, setOpen] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [actionType, setActionType] = useState("");

  const toggleDrawer = () => {
    setOpen(!open);
  };

  const loadBookRequests = async () => {
    try {
      const data = await fetchBookRequests();
      setBookRequests(data.map((request) => ({ ...request, comment: "" })));
    } catch (err) {
      setError("도서 신청 목록을 불러오는 중 오류가 발생했습니다.");
    }
  };

  useEffect(() => {
    loadBookRequests();
  }, []);

  const handleOpenDialog = (request, type) => {
    setSelectedRequest(request);
    setActionType(type);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setSelectedRequest(null);
    setActionType("");
  };

  const handleConfirmAction = async () => {
    if (selectedRequest) {
      const status = actionType === "approve" ? 2 : 3;
      await updateBookRequestStatus(selectedRequest.WB_SEQ, status, selectedRequest.comment);
      await loadBookRequests();
      handleCloseDialog();
    }
  };

  const handleCommentChange = (id, value) => {
    setBookRequests((prevRequests) =>
      prevRequests.map((request) =>
        request.WB_SEQ === id ? { ...request, comment: value } : request
      )
    );
  };

  return (
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
              theme.palette.mode === "light" ? theme.palette.grey[100] : theme.palette.grey[900],
            overflow: "auto",
          }}
        >
          <Toolbar />
          <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Typography variant="h4" gutterBottom>
              희망 도서 신청 승인
            </Typography>
            <TableContainer component={Paper} sx={{ marginTop: 4 }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ width: "20%", whiteSpace: "nowrap" }}>도서 제목</TableCell>
                    <TableCell sx={{ width: "15%", whiteSpace: "nowrap" }}>저자</TableCell>
                    <TableCell sx={{ width: "15%", whiteSpace: "nowrap" }}>신청자 닉네임</TableCell>
                    <TableCell sx={{ width: "15%", whiteSpace: "nowrap" }}>신청 날짜</TableCell>
                    <TableCell sx={{ width: "20%" }}>코멘트</TableCell>
                    <TableCell sx={{ width: "15%", whiteSpace: "nowrap" }} align="center">
                      상태 업데이트
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {bookRequests.map((request) => (
                    <TableRow key={request.WB_SEQ}>
                      <TableCell>{request.WB_NAME}</TableCell>
                      <TableCell>{request.WB_AUTHOR}</TableCell>
                      <TableCell>{request.NICKNAME}</TableCell>
                      <TableCell>{new Date(request.WB_AplDt).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <TextField
                          value={request.comment}
                          onChange={(e) => handleCommentChange(request.WB_SEQ, e.target.value)}
                          placeholder="코멘트를 입력하세요"
                          variant="outlined"
                          size="small"
                          fullWidth
                        />
                      </TableCell>
                      <TableCell align="center">
                        <Box sx={{ display: "flex", gap: 1, justifyContent: "center" }}>
                          <Button
                            variant="contained"
                            color="primary"
                            onClick={() => handleOpenDialog(request, "approve")}
                          >
                            승인
                          </Button>
                          <Button
                            variant="contained"
                            color="secondary"
                            onClick={() => handleOpenDialog(request, "reject")}
                          >
                            거절
                          </Button>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            {error && (
              <Typography color="error" variant="body1" mt={2}>
                오류: {error}
              </Typography>
            )}
          </Container>
        </Box>

        {/* 승인/거절 확인 다이얼로그 */}
        <Dialog open={dialogOpen} onClose={handleCloseDialog}>
          <DialogContent>
            <DialogContentText>
              {actionType === "approve"
                ? "이 도서 신청을 승인하시겠습니까?"
                : "이 도서 신청을 거절하시겠습니까?"}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleConfirmAction}>네</Button>
            <Button onClick={handleCloseDialog}>아니오</Button>
          </DialogActions>
        </Dialog>
      </Box>
    </ThemeProvider>
  );
};

export default BookApprovalPage;
