import React, { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, Box, Pagination, Rating, Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/Header';
import Breadcrumb from '../../components/BreadCrumb';
import ProfileSection from '../../components/ProfileSection';
import { fetchBookReports } from '../../api/studyAPI';
import { useAuth } from '../../context/AuthContext';
import usePagination from '../../hooks/usePagination';

const MyBookReport = () => {
  const { userObject } = useAuth();
  const navigate = useNavigate();
  const [bookReports, setBookReports] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false); // 다이얼로그 상태
  const rowsPerPage = 5;
  const { currentData, totalPages, page, handlePageChange } = usePagination(bookReports, rowsPerPage);

  useEffect(() => {
    if (userObject) {
      const getBookReports = async () => {
        try {
          const data = await fetchBookReports(userObject.USER_SEQ); // 사용자 ID 전달
          setBookReports(data);
        } catch (error) {
          console.error("Error fetching book reports:", error);
        }
      };
      getBookReports();
    }
  }, [userObject]);

  const truncateText = (text, maxLength) => {
    if (text.length > maxLength) {
      return text.slice(0, maxLength) + '...';
    }
    return text;
  };

  const handleDialogOpen = () => setDialogOpen(true);
  const handleDialogClose = () => setDialogOpen(false);

  const handleTextWrite = () => {
    setDialogOpen(false);
    navigate('/mystudy/writereport', { state: { mode: 'text' } });
  };

  const handleVoiceWrite = () => {
    setDialogOpen(false);
    navigate('/mystudy/writereport', { state: { mode: 'voice' } });
  };

  return (
    <Box>
      <Header />
      <Breadcrumb />
      <ProfileSection />

      <Box sx={{ maxWidth: '80%', margin: 'auto', marginTop: 4, textAlign: 'center' }}>
        <Typography variant="h5" gutterBottom>
          독서노트
        </Typography>
      </Box>
      <Box sx={{ maxWidth: '80%', textAlign: 'right' }}>
        <Button variant="contained" color="primary" onClick={handleDialogOpen}>
          글쓰기
        </Button>
      </Box>

      <Dialog open={dialogOpen} onClose={handleDialogClose}>
        <DialogTitle>입력 방식 선택</DialogTitle>
        <DialogContent>어떻게 글을 작성하시겠습니까?</DialogContent>
        <DialogActions>
          <Button onClick={handleTextWrite} color="primary">글쓰기</Button>
          <Button onClick={handleVoiceWrite} color="primary">말하기</Button>
          <Button onClick={handleDialogClose} color="secondary">취소</Button>
        </DialogActions>
      </Dialog>

      <TableContainer component={Paper} sx={{ maxWidth: '70%', margin: 'auto', padding: 2, marginTop: 2 }}>
        <Table sx={{ tableLayout: 'fixed' }}>
          <TableHead>
            <TableRow>
              <TableCell sx={{ width: '5%' }}>번호</TableCell>
              <TableCell sx={{ width: '20%' }}>책 제목</TableCell>
              <TableCell sx={{ width: '40%' }}>요약</TableCell>
              <TableCell sx={{ width: '20%' }}>평점</TableCell>
              <TableCell sx={{ width: '15%' }}>작성 날짜</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {currentData.map((report, index) => (
              <TableRow key={report.REPORT_SEQ}>
                <TableCell>{index + 1 + (page - 1) * rowsPerPage}</TableCell>
                <TableCell>{report.REPORT_TITLE}</TableCell>
                <TableCell>{truncateText(report.REPORT_DETAIL, 45)}</TableCell>
                <TableCell>
                  <Rating value={report.RATING} readOnly />
                </TableCell>
                <TableCell>{new Date(report.REPORT_CrtDt).toLocaleDateString()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: 2 }}>
        <Pagination count={totalPages} page={page} onChange={handlePageChange} color="primary" />
      </Box>
    </Box>
  );
};

export default MyBookReport;
