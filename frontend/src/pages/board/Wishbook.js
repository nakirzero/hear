import React, { useState }from 'react'
import Header from '../../components/Header';
import Breadcrumb from '../../components/BreadCrumb';
import ProfileSection from '../../components/ProfileSection';
import Footer from '../../components/Footer';
import { fetchWishbook } from '../../api/boardAPI';
import { Typography, Box, TextField, Button,Alert } from '@mui/material';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';


const Wishbook = () => {
    const { userObject } = useAuth(); // 전역 사용자 정보 가져오기
    const navigate = useNavigate();
    const [ message, setMessage ] = useState();
    const [isSuccess, setIsSuccess] = useState(false); // 메시지 상태의 유형을 구분
    const [ wishbook, setWishbook] = useState({
        user_seq : userObject.USER_SEQ,
        wb_name : "",
        wb_author : "",
      });

    const handleForm = (event) => {
        const { name, value } = event.target;
        setWishbook((prevWishbook) => ({
            ...prevWishbook,
            [name]: value,
        }));
    };
    

    const handleWishbook = async (e) => {
      e.preventDefault();      
      try {
        if (!wishbook.wb_name || !wishbook.wb_author) {
          setMessage('내용을 입력해주세요.');
          console.log('message', message);
          
          setIsSuccess(false);
          return;
        }
        const responseMessage = await fetchWishbook(e, wishbook);
        if (responseMessage) {
          setMessage('신청이 완료되었습니다.');
          setIsSuccess(true);
          // 페이지 이동 (예: 신청 완료 후 목록 페이지로 이동)
          setTimeout(() => navigate('/mystudy/mywishbook'), 1500);
        } else {
          setMessage('신청이 되지 않았습니다.');
          setIsSuccess(false);
        }
      } catch (error) {
        setMessage('희망도서 신청 중 오류가 발생했습니다.');
        setIsSuccess(false);
      }
    };

 
  return (
    <div>
          
        <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header />
      <Breadcrumb />
      <ProfileSection />
      <Box sx={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <Box component="form" onSubmit={handleWishbook} sx={{ width: '35%', p: 3, boxShadow: 3, borderRadius: 2 }}>
          <Typography variant="h5" gutterBottom>희망 도서 신청</Typography>
          <Typography variant="subtitle1" gutterBottom>작성자: {userObject?.NICKNAME}</Typography>

          <TextField label="책 제목" fullWidth required name="wb_name" onChange={handleForm} sx={{ mb: 2 }} />

          <TextField label="작가" fullWidth required name="wb_author" onChange={handleForm} sx={{ mb: 2 }} />

          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Button type="submit" variant="contained" color="primary" sx={{ width: '48%' }}>신청 완료</Button>
            <Button variant="outlined" color="secondary" sx={{ width: '48%' }} onClick={() => navigate(-1)}>취소</Button>
          </Box>
        </Box>
      </Box>
      {message && (
        <Alert variant="filled" severity={isSuccess ? 'success' : 'error'} sx={{ mb: 4 }}>
          {message}
        </Alert>
      )}
    </Box>
        
        
        
        
        
        <Footer />
    </div>
  )
}

export default Wishbook