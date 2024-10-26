import React, { useState, useEffect } from "react";
import Breadcrumb from "../components/BreadCrumb";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { Box, Button, Typography, Stack, Paper } from "@mui/material";
import { fetchLibrary } from "../api/libraryAPI";
import { useNavigate, useLocation  } from "react-router-dom";


const Book = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [ book, setBook ] = useState([]);
  

  useEffect(() => {
    const fetchBookData = async () => {
      // URL에서 BOOK_SEQ 쿼리 파라미터 가져오기
      const params = new URLSearchParams(location.search);
      const bookSeq = params.get("BOOK_SEQ");
      console.log(bookSeq);
      

      if (bookSeq) {
        try {
          // 전체 책 목록을 가져온 후 BOOK_SEQ에 해당하는 책을 찾습니다
          const response = await fetchLibrary(); // 전체 책 목록을 불러오는 API
          const bookData = response.find((b) => b.BOOK_SEQ === Number(bookSeq));

          if (bookData) {
            setBook(bookData);
          } else {
            console.error("해당 책을 찾을 수 없습니다.");
          }
        } catch (error) {
          console.error("책 데이터를 불러오는 중 오류가 발생했습니다.", error);
        }
      }
    };

    fetchBookData();
  }, [location.search]);

  const buttonStyle = {
    width: 300,
    height: 160,
    borderRadius: 10,
    fontSize: "1.5rem",
  };

  const handlePoem = () => {
    navigate('/library?category=200');
  };

  const handleNovel = () => {
    navigate('/library?category=100');
  };

  const handleEssay = () => {
    navigate('/library?category=300');
  };

  
  return (
    <div>
      <Header />
      <Breadcrumb />
      {/* 시, 소설, 수필 */}
      <Box
        bgcolor="#FFD700"
        py={4}
        display="flex"
        flexDirection="column"
        alignItems="center"
      >
        <Box sx={{ display: "flex", gap: 4 }}>
          <Button
            variant="contained"
            sx={buttonStyle}
            onClick={handlePoem}
            aria-label="카테고리 시로 이동"
          >
            1. 시
          </Button>
          <Button
            variant="contained"
            sx={buttonStyle}
            onClick={handleNovel}
            aria-label="카테고리 소설로 이동"
          >
            2. 소설
          </Button>
          <Button
            variant="contained"
            sx={buttonStyle}
            onClick={handleEssay}
            aria-label="카테고리 수필로 이동"
          >
            3. 수필
          </Button>
          <Button
            variant="contained"
            sx={buttonStyle}
            aria-label="카테고리 혜리언니로 이동"
          >
            4. 혜리언니
          </Button>
        </Box>
      </Box>
      <Box display="flex" padding="20px" bgcolor="#f0f0f0" borderRadius="10px" sx={{ marginTop: 4, width: "70%", marginX: "auto" }} >
      <Paper
        sx={{
          width: '300px',
          height: '400px',
          backgroundColor: '#d3d3d3',
          borderRadius: '10px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {/* 이미지 아이콘 */}
        <Typography variant="h6" color="textSecondary">
          🖼
        </Typography>
      </Paper>
      <Stack spacing={2} ml={2} flex={1}>
        <Typography variant="body2">{ book.BOOK_NAME}</Typography>
        <Typography variant="h4" fontWeight="bold">
        { book.BOOK_NAME}
        </Typography>
        <Typography variant="subtitle2" color="textSecondary">
         { book.FULL_PATH}
        </Typography>
        <Typography variant="body1" color="textSecondary">
          { book.INFORMATION}
        </Typography>
        <Stack spacing={1} mt={2}>
          <Button variant="outlined"  onClick={() => navigate("/library/book/aisummary")}>AI요약듣기</Button>
          <Button variant="outlined"  onClick={() => navigate("/library/book/full")} >전체듣기</Button>
        </Stack>
      </Stack>
    </Box>
      
      <Footer />
    </div>
  );
};

export default Book;
