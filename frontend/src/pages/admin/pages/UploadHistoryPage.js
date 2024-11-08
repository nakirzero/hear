import React, { useState, useEffect } from "react";
import {
  Tabs,
  Tab,
  Toolbar,
  Typography,
  Box,
  Container,
  CssBaseline,
  ThemeProvider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import CustomAppBar from "../components/CustomAppBar.js";
import DrawerComponent from "../components/DrawerComponent.js";
import theme from "../../../theme";
import { fetchUploadHistory } from "../api/predictAPI.js";

const UploadHistoryPage = () => {
  const [selectedTab, setSelectedTab] = useState(1); // 기본적으로 두 번째 탭 선택
  const [open, setOpen] = useState(true);
  const navigate = useNavigate();
  const [uploadHistory, setUploadHistory] = useState([]);

  const toggleDrawer = () => {
    setOpen(!open);
  };

  useEffect(() => {
    const loadUploadHistory = async () => {
      try {
        const data = await fetchUploadHistory();
        console.log('data', data);
        
        setUploadHistory(data);
      } catch (err) {
        console.error("Error fetching upload history:", err);
      }
    };

    loadUploadHistory();
  }, []);

  const handleTabChange = (newValue) => {
    setSelectedTab(newValue);
    if (newValue === 0) {
      navigate("/admin/predict");
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
                theme.palette.mode === "light" ? theme.palette.grey[100] : theme.palette.grey[900],       overflowY: "auto",  // 세로 스크롤만 필요할 때 표시
            height: "100vh",            
          }}
        >
            <Toolbar />
          <Container sx={{ height: "calc(100vh - 64px)", display: "flex", flexDirection: "column", alignItems: "center", py: 4 }}>
            <Tabs value={selectedTab} onChange={(_, newValue) => handleTabChange(newValue)} centered>
                <Tab label={<Typography variant="h4" noWrap>공유 마당 데이터 업로드</Typography>} />
                <Tab label={<Typography variant="h4" noWrap>공유 마당 업로드 이력</Typography>} />
            </Tabs>

            {/* 업로드 이력 페이지 컨텐츠 */}
            <TableContainer component={Paper} sx={{ marginTop: 4 }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>업로드 날짜</TableCell>
                    <TableCell>파일명</TableCell>
                    <TableCell>상태</TableCell>
                    <TableCell>레코드 수</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {uploadHistory.map((history, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        {new Date(history.upload_date).toLocaleString("ko-KR", {
                          year: "numeric",
                          month: "2-digit",
                          day: "2-digit",
                          hour: "2-digit",
                          minute: "2-digit",
                          second: "2-digit",
                          hourCycle: "h23" // 24시간 형식 사용
                        })}
                      </TableCell>
                      <TableCell>{history.file_name}</TableCell>
                      <TableCell>{"성공"}</TableCell>
                      <TableCell>{history.record_count}</TableCell>
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

export default UploadHistoryPage;
