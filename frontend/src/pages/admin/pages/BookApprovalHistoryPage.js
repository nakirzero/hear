import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Typography,
  Box,
  Tabs,
  Tab,
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
} from "@mui/material";
import CustomAppBar from "../components/CustomAppBar.js";
import DrawerComponent from "../components/DrawerComponent.js";
import theme from "../../../theme.js";
import { fetchApprovalHistory } from "../api/wishbookAPI.js"; // axios API 호출 함수 import
import { formatInTimeZone } from 'date-fns-tz';

const BookApprovalHistoryPage = () => {
  const [selectedTab, setSelectedTab] = useState(1); // 기본적으로 두 번째 탭 선택
  const [historyData, setHistoryData] = useState([]);
  const [open, setOpen] = useState(true);
  const navigate = useNavigate();

  const toggleDrawer = () => {
    setOpen(!open);
  };

  const handleTabChange = (newValue) => {
    setSelectedTab(newValue);
    if (newValue === 0) {
      // 첫 번째 탭 클릭 시 승인 요청 페이지로 이동
      navigate("/admin/approval");
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case "2":
        return "승인";
      case "3":
        return "승인 거절";
      default:
        return "알 수 없음";
    }
  };

  useEffect(() => {
    // axios API 호출로 승인 이력 데이터를 가져오기
    const loadHistoryData = async () => {
      try {
        const data = await fetchApprovalHistory();
        console.log('data', data);
        
        setHistoryData(data);
      } catch (error) {
        console.error("Error fetching approval history:", error);
      }
    };

    loadHistoryData();
  }, []);

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
            <Tabs value={selectedTab} onChange={(_, newValue) => handleTabChange(newValue)} centered>
              <Tab label={<Typography variant="h4" noWrap>희망 도서 신청 승인</Typography>} />
              <Tab label={<Typography variant="h4" noWrap>희망 도서 승인 이력</Typography>} />
            </Tabs>

            <TableContainer component={Paper} sx={{ marginTop: 4 }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>도서 제목</TableCell>
                    <TableCell>신청자 닉네임</TableCell>
                    <TableCell>상태</TableCell>
                    <TableCell>승인 날짜</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {historyData.map((history, index) => (
                    <TableRow key={index}>
                      <TableCell>{history.WB_NAME}</TableCell>
                      <TableCell>{history.NICKNAME}</TableCell>
                      <TableCell>{getStatusLabel(history.WB_APPROVAL)}</TableCell>
                      <TableCell>{formatInTimeZone(new Date(history.WB_AplDt), 'UTC', 'yyyy.MM.dd')}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Container>
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default BookApprovalHistoryPage;
