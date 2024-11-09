import React, { useState, useEffect } from "react";
import {
  fetchBookData,
  fetchBookDelete,
} from "../api/BookAPI.js";
import {
  Box,
  Button,
  Paper,
  Toolbar,
  CssBaseline,
  ThemeProvider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,

  Dialog,
  DialogContent,
  DialogTitle,
  DialogActions,Tabs, Tab
} from "@mui/material";

import DrawerComponent from "../components/DrawerComponent.js";
import theme from "../../../theme";
import Copyright from "../components/Copyright.js";
import CustomAppBar from "../components/CustomAppBar.js";
import { useNavigate } from "react-router-dom";

const BookList = () => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(true);
  const [bookData, setBookData] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedTab, setSelectedTab] = useState(1);
  const [selectedBookText, setSelectedBookText] = useState("");


  const toggleDrawer = () => setOpen(!open);





  const handleBookData = async () => {
    try {
      const response = await fetchBookData();
      setBookData(response);
    } catch (error) {
      console.error("도서 데이터를 불러오는 중 오류 발생:", error);
    }
  };

  const handleBookDelete = async (bookseq) => {
    const response = await fetchBookDelete(bookseq);
    console.log(response);
    handleBookData();
  };

  useEffect(() => {
    handleBookData();
  }, []);

  // 팝업창 열기
  const handleOpenDialog = (bookText) => {
    setSelectedBookText(bookText);
    setOpenDialog(true);
  };

  // 팝업창 닫기
  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

 
const handleTabChange = (newValue) => {
    setSelectedTab(newValue);
    if (newValue === 0) {
      navigate("/admin/bookadd");
    }
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
              theme.palette.mode === "light"
                ? theme.palette.grey[100]
                : theme.palette.grey[900],
            overflow: "auto",
            p: 3,
          }}
        >
          <Toolbar />
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              gap: 4, // 두 요소 사이의 간격
              mb: 4, // 아래쪽 여백
            }}
          >
          <Tabs value={selectedTab} onChange={(_, newValue) => handleTabChange(newValue)} centered>
                <Tab label={<Typography variant="h4" noWrap>도서 추가</Typography>} />
                <Tab label={<Typography variant="h4" noWrap>도서 목록</Typography>} />
            </Tabs>
          </Box>



          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>카테고리</TableCell>
                  <TableCell>도서 이미지</TableCell>
                  <TableCell>도서 제목</TableCell>
                  <TableCell>저자</TableCell>
                  <TableCell>출판사</TableCell>
                  <TableCell>도서 정보</TableCell>
                  <TableCell>도서 본문</TableCell>
                  <TableCell>등록일</TableCell>
                  <TableCell>삭제</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {bookData.map((row, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      {row.CATEGORY === "100"
                        ? "소설"
                        : row.CATEGORY === "200"
                        ? "시"
                        : "수필"}
                    </TableCell>            
                    <TableCell>
                      <img
                        src={`/static/image/bookcover/${row.IMG_PATH}`}
                        alt={row.BOOK_NAME}
                        style={{ width: "100px", height: "auto" }}
                      />
                  
                    </TableCell>
                    <TableCell>{row.BOOK_NAME}</TableCell>
                    <TableCell>{row.AUTHOR}</TableCell>
                    <TableCell>{row.PUBLISHER}</TableCell>
                    <TableCell>{row.INFORMATION}</TableCell>
                    <TableCell sx={{ verticalAlign: "middle", padding: "8px" }}>
                      <Typography
                        variant="body2"
                        onClick={() => handleOpenDialog(row.BOOK_TEXT)}
                        sx={{
                          cursor: "pointer",
                          textDecoration: "underline",
                          textAlign: "center",
                          display: "inline-block",
                        }}
                      >
                        본문 보기
                      </Typography>
                    </TableCell>

                    <TableCell>{row.formatted_date}</TableCell>
                    <TableCell>
                      <Button
                        variant="contained"
                        color="secondary"
                        onClick={() => handleBookDelete(row.BOOK_SEQ)}
                      >
                        삭제
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </Box>

      {/* 팝업창 */}
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>상세 내용</DialogTitle>
        <DialogContent>
          <Typography variant="body1">{selectedBookText}</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            닫기
          </Button>
        </DialogActions>
      </Dialog>

      <Copyright />
    </ThemeProvider>
  );
};

export default BookList;
