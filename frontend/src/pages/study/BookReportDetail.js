import React, { useEffect, useState } from "react";
import { Box, Button, Typography, Rating, Paper, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import Header from "../../components/Header";
import Breadcrumb from "../../components/BreadCrumb";
import { fetchBookReportById, deleteBookReport } from "../../api/studyAPI";
import useLoading from "../../hooks/useLoading";

const BookReportDetail = () => {
  const { reportId } = useParams();
  const navigate = useNavigate();
  const [report, setReport] = useState(null);
  const { isLoading, setIsLoading, LoadingIndicator } = useLoading();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false); // 삭제 확인 다이얼로그 상태

  useEffect(() => {
    const getReport = async () => {
      try {
        const data = await fetchBookReportById(reportId);
        console.log('data', data);
        
        setReport(data);
      } catch (error) {
        console.error("Error fetching book report:", error);
      }
    };
    getReport();
  }, [reportId, setIsLoading]);

  const handleEdit = () => {
    navigate(`/mystudy/writereport`, { state: { mode: "voice", report } });
  };

  const handleDelete = async () => {
    try {
      await deleteBookReport(reportId); // 삭제 API 호출
      navigate('/mystudy/mybookreport'); // 삭제 후 목록 페이지로 이동
    } catch (error) {
      console.error("Error deleting book report:", error);
    } finally {
      setIsDeleteDialogOpen(false); // 다이얼로그 닫기
    }
  };

  const openDeleteDialog = () => setIsDeleteDialogOpen(true);
  const closeDeleteDialog = () => setIsDeleteDialogOpen(false);

  if (isLoading || !report) return <LoadingIndicator />;

  return (
    <Box sx={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <Header />
      <Breadcrumb />
      
      <Box sx={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <Paper sx={{ padding: 4, boxShadow: 3, borderRadius: 2, width:'35%' }}>
          <Typography variant="h4" gutterBottom align="center" sx={{ mb: 4 }}>
            독서노트 상세
          </Typography>
          <Typography variant="subtitle1" align="right" gutterBottom>
            작성자: { report.nickname }
          </Typography>

          <Box sx={{ mt: 4 }}>
            <Typography variant="h5" sx={{ mb: 1 }}>
              제목
            </Typography>
            <Typography variant="body1" sx={{ padding: 1, bgcolor: "#f5f5f5", borderRadius: 1 }}>
              {report.REPORT_TITLE}
            </Typography>

            <Typography variant="h5" sx={{ mt: 4, mb: 1 }}>
              내용
            </Typography>
            <Typography variant="body1" sx={{ padding: 1, bgcolor: "#f5f5f5", borderRadius: 1 }}>
              {report.REPORT_DETAIL}
            </Typography>

            <Typography variant="h5" sx={{ mt: 4, mb: 1 }}>
              평점
            </Typography>
            <Rating value={report.RATING} readOnly sx={{ fontSize: 28 }} />
          </Box>

          <Box sx={{ display: "flex", justifyContent: "space-between", mt: 6 }}>
            <Button variant="contained" color="primary" onClick={handleEdit} sx={{ width: "48%", fontSize: 16 }}>
              수정
            </Button>
            <Button variant="outlined" color="error" onClick={openDeleteDialog} sx={{ width: "48%", fontSize: 16 }}>
              삭제
            </Button>
          </Box>
        </Paper>
      </Box>

      {/* 삭제 확인 다이얼로그 */}
      <Dialog open={isDeleteDialogOpen} onClose={closeDeleteDialog}>
        <DialogTitle>삭제 확인</DialogTitle>
        <DialogContent>
          <DialogContentText>정말로 이 독서노트를 삭제하시겠습니까?</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDeleteDialog} color="primary">취소</Button>
          <Button onClick={handleDelete} color="error">삭제</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default BookReportDetail;
