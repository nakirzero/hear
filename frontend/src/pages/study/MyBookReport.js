// MyBookReport.js
import React, { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, Box, Pagination, Rating, Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/Header';
import Breadcrumb from '../../components/BreadCrumb';
import ProfileSection from '../../components/ProfileSection';
import { fetchBookReports } from '../../api/studyAPI';
import { useAuth } from '../../context/AuthContext';
import usePagination from '../../hooks/usePagination';

import './MyBookReport.css';

const MyBookReport = () => {
  const { userObject } = useAuth();
  const navigate = useNavigate();
  const [bookReports, setBookReports] = useState([]);
  const [selectedRow, setSelectedRow] = useState(null); 
  const [dialogOpen, setDialogOpen] = useState(false); 
  const rowsPerPage = 5;
  const { currentData, totalPages, page, handlePageChange } = usePagination(bookReports, rowsPerPage);

  useEffect(() => {
    if (userObject) {
      const getBookReports = async () => {
        try {
          const data = await fetchBookReports(userObject.USER_SEQ); 
          setBookReports(data);
        } catch (error) {
          console.error("Error fetching book reports:", error);
        }
      };
      getBookReports();
    }
  }, [userObject]);

  const truncateText = (text, maxLength) => {
    return text.length > maxLength ? text.slice(0, maxLength) + '...' : text;
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

  const handleRowClick = (reportId) => {
    setSelectedRow(reportId);
    navigate(`/mystudy/mybookreport/${reportId}`, { state: { reportId } });
  };

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#FFCF8B' }}>
      <Header />
      <Breadcrumb />
      <ProfileSection />

      <Dialog open={dialogOpen} onClose={handleDialogClose}>
        <DialogTitle>입력 방식 선택</DialogTitle>
        <DialogContent>어떻게 글을 작성하시겠습니까?</DialogContent>
        <DialogActions>
          <Button onClick={handleTextWrite} color="primary">글쓰기</Button>
          <Button onClick={handleVoiceWrite} color="primary">말하기</Button>
          <Button onClick={handleDialogClose} color="secondary">취소</Button>
        </DialogActions>
      </Dialog>

      <Box sx={{ maxWidth: '80%', margin: 'auto', padding: 2 }}>
        {/* 글쓰기 버튼을 테이블 상단 오른쪽에 배치 */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6">독서노트 목록</Typography>
          <Button variant="contained" color="primary" onClick={handleDialogOpen}>
            글쓰기
          </Button>
        </Box>

        <TableContainer component={Paper} sx={{ boxShadow: 3, borderRadius: 2 }}>
          <Table sx={{ tableLayout: 'fixed' }}>
            <TableHead>
              <TableRow>
                <TableCell align="center" sx={{ width: '5%' }}>번호</TableCell>
                <TableCell align="center" sx={{ width: '20%' }}>책 제목</TableCell>
                <TableCell align="center" sx={{ width: '40%' }}>요약</TableCell>
                <TableCell align="center" sx={{ width: '20%' }}>평점</TableCell>
                <TableCell align="center" sx={{ width: '15%' }}>작성 날짜</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {currentData.map((report, index) => (
                <TableRow 
                  key={report.REPORT_SEQ} 
                  onClick={() => handleRowClick(report.REPORT_SEQ)} 
                  tabIndex={0} 
                  sx={{ 
                    '&:hover': { backgroundColor: '#FFD433', cursor: 'pointer' },
                    backgroundColor: selectedRow === report.REPORT_SEQ ? '#e0f7fa' : 'inherit'
                  }}
                >
                  <TableCell align="center">{index + 1 + (page - 1) * rowsPerPage}</TableCell>
                  <TableCell align="center">{report.REPORT_TITLE}</TableCell>
                  <TableCell align="center">{truncateText(report.REPORT_DETAIL, 45)}</TableCell>
                  <TableCell align="center">
                    <Rating value={report.RATING} readOnly />
                  </TableCell>
                  <TableCell align="center">{new Date(report.REPORT_CrtDt).toLocaleDateString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        
        <Box display="flex" justifyContent="center" my={2}>
          <Pagination count={totalPages} page={page} onChange={handlePageChange} variant="outlined" shape="rounded" />
        </Box>
      </Box>
    </Box>
  );
};

export default MyBookReport;
