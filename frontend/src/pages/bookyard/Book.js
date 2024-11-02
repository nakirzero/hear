import React, { useState, useEffect } from "react";
import Breadcrumb from "../../components/BreadCrumb";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { Box, Button, Typography, Stack, Paper } from "@mui/material";
import { fetchLibrary, getLastPosition } from "../../api/libraryAPI";
import { useNavigate, useLocation } from "react-router-dom";
import useOpenAISummary from "../../hooks/useOpenAISummary";
import useElevenLabsTTS from "../../hooks/useElevenLabsTTS";
import { useAuth } from "../../context/AuthContext";

const Book = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [book, setBook] = useState([]);
  const { saveTTSFile } = useElevenLabsTTS();
  const { getSummary, isLoading: summaryLoading } = useOpenAISummary();
  const { userObject } = useAuth();
  const [lastPosition, setLastPosition] = useState(0); // 마지막 위치 상태 추가
  const [hasHistory, setHasHistory] = useState(false); // 히스토리 존재 여부

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

          console.log('bookData', bookData);

          if (bookData) {
            setBook(bookData);
            // 마지막 재생 위치 조회
            const position = await getLastPosition(bookSeq, userObject?.USER_SEQ);
            
            if (position > 0) {
              setLastPosition(position); // 마지막 위치 설정
              setHasHistory(true); // 히스토리가 있는 경우
            } else {
              setHasHistory(false); // 히스토리가 있는 경우
            }
            
          } else {
            console.error("해당 책을 찾을 수 없습니다.");
          }
        } catch (error) {
          console.error("책 데이터를 불러오는 중 오류가 발생했습니다.", error);
        }
      }
    };

    fetchBookData();
  }, [location.search, userObject]);

  const handleAISummary = async () => {
    if (userObject) {
      console.log('userObject', userObject);
      try {
        const summary = await getSummary(book.INFORMATION);
        await saveTTSFile(userObject.EL_ID, summary, book.BOOK_SEQ, true); // 요약 플래그 추가
        navigate(`/library/book/aisummary?BOOK_SEQ=${book.BOOK_SEQ}`);
      } catch (error) {
        console.error("AI 요약 파일 생성 중 오류 발생:", error);
      }
    }
  };

  const handleListenFromStart = async () => {
    if (userObject) {
      try {
        await saveTTSFile(userObject.EL_ID, book.INFORMATION, book.BOOK_SEQ, false); // TTS 파일 생성
        navigate(`/library/book/play?BOOK_SEQ=${book.BOOK_SEQ}`, { state: { lastPosition: 0 } });
      } catch (error) {
        console.error("파일 생성 중 오류 발생:", error);
      }
    }
  };
  
  const handleContinueListening = async () => {
    if (userObject) {
      try {
        await saveTTSFile(userObject.EL_ID, book.INFORMATION, book.BOOK_SEQ, false); // TTS 파일 생성
        navigate(`/library/book/play?BOOK_SEQ=${book.BOOK_SEQ}`, { state: { lastPosition } });
      } catch (error) {
        console.error("파일 생성 중 오류 발생:", error);
      }
    }
  };

  const buttonStyle = {
    width: 300,
    height: 160,
    borderRadius: 10,
    fontSize: "1.5rem",
  };

  const handlePoem = () => {
    navigate("/library?category=200");
  };

  const handleNovel = () => {
    navigate("/library?category=100");
  };

  const handleEssay = () => {
    navigate("/library?category=300");
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
            color="secondary"
            sx={buttonStyle}
            onClick={handlePoem}
            aria-label="카테고리 시로 이동"
          >
            1. 시
          </Button>
          <Button
            variant="contained"
            color="secondary"
            sx={buttonStyle}
            onClick={handleNovel}
            aria-label="카테고리 소설로 이동"
          >
            2. 소설
          </Button>
          <Button
            variant="contained"
            color="secondary"
            sx={buttonStyle}
            onClick={handleEssay}
            aria-label="카테고리 수필로 이동"
          >
            3. 수필
          </Button>
          <Button
            variant="contained"
            color="secondary"
            sx={buttonStyle}
            aria-label="카테고리 혜리언니로 이동"
          >
            4. 혜리언니
          </Button>
        </Box>
      </Box>
      <Box
        display="flex"
        padding="20px"
        bgcolor="#f0f0f0"
        borderRadius="10px"
        sx={{ marginTop: 4, width: "70%", marginX: "auto" }}
      >
        <Paper
          sx={{
            width: "300px",
            height: "400px",
            backgroundColor: "#d3d3d3",
            borderRadius: "10px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {/* 이미지 아이콘 */}
          <Typography variant="h6" color="textSecondary">
            🖼
          </Typography>
        </Paper>
        <Stack spacing={2} ml={2} flex={1}>
          <Typography variant="body2">{book.BOOK_NAME}</Typography>
          <Typography variant="h4" fontWeight="bold">
            {book.BOOK_NAME}
          </Typography>
          <Typography variant="subtitle2" color="textSecondary">
            {book.FULL_PATH}
          </Typography>
          <Typography variant="body1" color="textSecondary">
            {book.INFORMATION}
          </Typography>
          <Stack spacing={1} mt={2}>
            <Button variant="outlined" onClick={handleAISummary} disabled={summaryLoading}>
              {summaryLoading ? "요약 생성 중..." : "AI요약듣기"}
            </Button>
            {hasHistory ? (
            <>
                <Button variant="outlined" onClick={handleListenFromStart}>처음부터 듣기</Button>
                <Button variant="outlined" onClick={handleContinueListening}>이어 듣기</Button>
              </>
            ) : (
              <Button variant="outlined" onClick={handleListenFromStart}>전체 듣기</Button>
            )}
          </Stack>
        </Stack>
      </Box>

      <Footer />
    </div>
  );
};

export default Book;
