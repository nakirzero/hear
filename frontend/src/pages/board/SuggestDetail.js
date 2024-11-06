import React, { useEffect, useState } from "react";
import { Box, Button, Typography, Paper, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import Header from "../../components/Header";
import Breadcrumb from "../../components/BreadCrumb";
import { useAuth } from '../../context/AuthContext';
import { fetchSuggestDetail,fetchSuggestDelete } from "../../api/boardAPI";



const SuggestDetail = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { userObject } = useAuth(); // 전역 사용자 정보 가져오기
  const [report, setReport] = useState(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false); // 삭제 확인 다이얼로그 상태
  const notice_seq = location.state.selected;


  useEffect(() => {
    console.log("selected", notice_seq);

    
  
    const getReport = async () => {
      try {
        const data = await fetchSuggestDetail(notice_seq);
        console.log('data', data.data);
        setReport(data.data);
        
      } catch (error) {
        console.error("Error fetching suggest detail report:", error);
      }
    };
    getReport();
  }, [notice_seq]);
  


  const openHandleEdit = async () => {
    try {
        const data = await fetchSuggestDelete(notice_seq); // 삭제 API 호출
        console.log(data,"답장");
        
        navigate('/board/suggest'); // 삭제 후 목록 페이지로 이동
      } catch (error) {
        console.error("Error deleting book report:", error);
      } finally {
        setIsDeleteDialogOpen(false); // 다이얼로그 닫기
      }
  };

  const handleModify = async () => {
    try {
        const data = await fetchSuggestDetail(notice_seq);
        console.log('data', data.data);
        setReport(data.data);
        navigate('/board/suggest/suggestwrite', { state: { selected : report } } )
      } catch (error) {
        console.error("Error fetching suggest detail report:", error);
      }
      
    };
   
  


  const openDeleteDialog = () => setIsDeleteDialogOpen(true);
  const closeDeleteDialog = () => setIsDeleteDialogOpen(false);


if(report){
    return (
        <Box sx={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <Header />
      <Breadcrumb />
      
      <Box sx={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <Paper sx={{ padding: 4, boxShadow: 3, borderRadius: 2, width:'35%' }}>
          <Typography variant="h4" gutterBottom align="center" sx={{ mb: 4 }}>
            건의사항 상세
          </Typography>
          <Typography variant="subtitle1" align="right" gutterBottom>
            작성일: { report.NOTICE_MdfDt  ? new Date(report.NOTICE_MdfDt).toLocaleDateString().replace(/\.$/, "") : new Date(report.NOTICE_CrtDt).toLocaleDateString().replace(/\.$/, "") }<br></br>
            작성자: { report.NICKNAME }
          </Typography>

          <Box sx={{ mt: 4 }}>
            <Typography variant="h5" sx={{ mb: 1 }}>
              제목
            </Typography>
            <Typography variant="body1" sx={{ padding: 1, bgcolor: "#f5f5f5", borderRadius: 1 }}>
              {report.NOTICE_TITLE}
            </Typography>

            <Typography variant="h5" sx={{ mt: 4, mb: 1 }}>
              내용
            </Typography>
            <Typography variant="body1" sx={{ padding: 1, bgcolor: "#f5f5f5", borderRadius: 1 }} style={{ whiteSpace: 'pre-line' }}>
              {report.NOTICE_DETAIL}
            </Typography>


          </Box>
        
                {report.USER_SEQ === userObject.USER_SEQ && (
                    <Box sx={{ display: "flex", justifyContent: "space-between", mt: 6 }}>
                    <Button variant="contained" color="primary" onClick={handleModify} sx={{ width: "48%", fontSize: 16 }}>
                        수정
                    </Button>
                    <Button variant="outlined" color="error" onClick={openDeleteDialog} sx={{ width: "48%", fontSize: 16 }}>
                        삭제
                    </Button>
                    </Box>
                )}

        </Paper>
      </Box>

      {/* 삭제 확인 다이얼로그 */}
      <Dialog open={isDeleteDialogOpen} onClose={closeDeleteDialog}>
        <DialogTitle>삭제 확인</DialogTitle>
        <DialogContent>
          <DialogContentText>정말로 이 건의사항을 삭제하시겠습니까?</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDeleteDialog} color="primary">취소</Button>
          <Button onClick={openHandleEdit} color="error">삭제</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
}
export default SuggestDetail;
