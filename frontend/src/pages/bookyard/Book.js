import React, { useState, useEffect } from "react";
import Breadcrumb from "../../components/BreadCrumb";
import Header from "../../components/Header";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Stack,
  Button,
  Paper,
} from "@mui/material";
import { fetchLibrary, getLastPosition } from "../../api/libraryAPI";
import { useNavigate, useLocation } from "react-router-dom";
import useOpenAISummary from "../../hooks/useOpenAISummary";
import useElevenLabsTTS from "../../hooks/useElevenLabsTTS";
import { ImportContacts, Article, Create, Share } from "@mui/icons-material";
import { useAuth } from "../../context/AuthContext";

const Book = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [book, setBook] = useState([]);
  const { saveTTSFile } = useElevenLabsTTS();
  const { getSummary, isLoading: summaryLoading } = useOpenAISummary();
  const { userObject } = useAuth();
  const [lastPosition, setLastPosition] = useState(0);
  const [hasHistory, setHasHistory] = useState(false);
  const selectedBook = location.state.selected;

  useEffect(() => {
    const fetchBookData = async () => {
      if (selectedBook) {
        try {
          const response = await fetchLibrary();
          const bookData = response.find(
            (b) => b.BOOK_SEQ === Number(selectedBook)
          );
          if (bookData) {
            setBook(bookData);
            const position = await getLastPosition(
              selectedBook,
              userObject?.USER_SEQ
            );
            if (position > 0) {
              setLastPosition(position);
              setHasHistory(true);
            } else {
              setHasHistory(false);
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
  }, [selectedBook, userObject?.USER_SEQ]);

  const handleAISummary = async () => {
    if (userObject) {
      try {
        const summary = await getSummary(book.INFORMATION);
        await saveTTSFile(userObject.EL_ID, summary, book.BOOK_SEQ, true);
        navigate("/library/book/aisummary", {
          state: { selected: book.BOOK_SEQ },
        });
      } catch (error) {
        console.error("AI 요약 파일 생성 중 오류 발생:", error);
      }
    }
  };

  const handleListenFromStart = async () => {
    if (userObject) {
      try {
        await saveTTSFile(
          userObject.EL_ID,
          book.INFORMATION,
          book.BOOK_SEQ,
          false
        );
        navigate(`/library/book/play`, {
          state: { lastPosition: 0, selected: book.BOOK_SEQ },
        });
      } catch (error) {
        console.error("파일 생성 중 오류 발생:", error);
      }
    }
  };

  const handleContinueListening = async () => {
    if (userObject) {
      try {
        await saveTTSFile(
          userObject.EL_ID,
          book.INFORMATION,
          book.BOOK_SEQ,
          false
        );
        navigate(`/library/book/play`, {
          state: { lastPosition, selected: book.BOOK_SEQ },
        });
      } catch (error) {
        console.error("파일 생성 중 오류 발생:", error);
      }
    }
  };

  const cardStyle = {
    width: 200,
    height: 100,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    bgcolor: "#DCEEDC",
    borderRadius: 10,
    boxShadow: 3,
    cursor: "pointer",
    transition: "0.3s",
    "&:hover": {
      boxShadow: 6,
    },
  };

  return (
    <Box
      bgcolor="#FFFEFE"
      sx={{
        minHeight: "100vh",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Header />
      <Breadcrumb />

      {/* 카테고리 카드 */}
      <Box
        bgcolor="#f7f7f7"
        py={4}
        display="flex"
        justifyContent="center"
        gap={10}
      >
        <Card
          sx={cardStyle}
          onClick={() => navigate(`/library`, { state: { category: "200" } })}
        >
          <CardContent
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Box display="flex" alignItems="center" gap={1}>
              <ImportContacts
                fontSize="large"
                sx={{ marginTop: "5px", color: "#246624" }}
              />
              <Typography variant="h6" sx={{ marginTop: "10px" }}>
                시
              </Typography>
            </Box>
          </CardContent>
        </Card>

        <Card
          sx={cardStyle}
          onClick={() => navigate(`/library`, { state: { category: "100" } })}
        >
          <CardContent
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Box display="flex" alignItems="center" gap={1}>
              <Article
                fontSize="large"
                sx={{ marginTop: "5px", color: "#246624" }}
              />
              <Typography variant="h6" sx={{ marginTop: "10px" }}>
                소설
              </Typography>
            </Box>
          </CardContent>
        </Card>

        <Card
          sx={cardStyle}
          onClick={() => navigate(`/library`, { state: { category: "300" } })}
        >
          <CardContent
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Box display="flex" alignItems="center" gap={1}>
              <Create
                fontSize="large"
                sx={{ marginTop: "5px", color: "#246624" }}
              />
              <Typography variant="h6" sx={{ marginTop: "10px" }}>
                수필
              </Typography>
            </Box>
          </CardContent>
        </Card>

        <Card
          sx={cardStyle}
          onClick={() => navigate(`/library`, { state: { category: "400" } })}
        >
          <CardContent
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Box display="flex" alignItems="center" gap={1}>
              <Share
                fontSize="large"
                sx={{ marginTop: "5px", color: "#246624" }}
              />
              <Typography variant="h6" sx={{ marginTop: "10px" }}>
                공유세상
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Box>

      {/* 도서 정보 카드 */}
      <Card
        sx={{
          width: 1100,
          maxWidth: "90vw",
          margin: "auto",
          mt: 4,
          p: 4,
          borderRadius: 2,
          boxShadow: 3,
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-start",
        }}
      >
        <Box
          display="flex"
          gap={2}
          alignItems="center"
          sx={{ width: "100%", pl: 7 }}
        >
          <Paper
            sx={{
              width: "450px",
              height: "450px",
              backgroundColor: "#d3d3d3",
              borderRadius: "10px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Box>
              <img
                src={`/static/image/bookcover/${book.IMG_PATH}`}
                alt={"책 커버 사진 없음"}
                style={{ width: 250, height: 250, objectFit: "cover" }}
              />
            </Box>
          </Paper>

          {/* 도서 정보와 버튼들 */}
          <Stack
            spacing={2}
            sx={{
              width: "100%",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              textAlign: "center",
            }}
          >
            <Typography variant="h6">{book.BOOK_NAME}</Typography>

            <Box
              sx={{
                width: "50%",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                textAlign: "center",
              }}
            >
              <Typography
                variant="subtitle1"
                color="textSecondary"
                sx={{ mb: 2 }}
              >
                {book.FULL_PATH}
              </Typography>
              <Typography variant="body1" color="textSecondary" sx={{ mb: 2 }}>
                {book.INFORMATION}
              </Typography>

              {/* 버튼 그룹 */}
              <Stack
                spacing={2}
                mt={3}
                sx={{ width: "100%", alignItems: "center" }}
              >
                <Button
                  variant="outlined"
                  onClick={handleAISummary}
                  disabled={summaryLoading}
                  sx={{
                    width: "400px",
                    fontWeight: "Bold",
                    color: "#B833BA", // 기본 글자 색상
                    borderColor: "#B833BA", // 기본 테두리 색상
                    backgroundColor: "#E9B6EA", // 기본 배경색
                    "&:hover": {
                      color: "#FFFFFF", // 호버 시 글자 색상
                      borderColor: "#FFFFFF", // 호버 시 테두리 색상
                      backgroundColor: "#B833BA", // 호버 시 배경색
                    },
                  }}
                >
                  {summaryLoading ? "요약 생성 중..." : "AI요약듣기"}
                </Button>
                {hasHistory ? (
                  <>
                    <Button
                      variant="outlined"
                      onClick={handleListenFromStart}
                      sx={{
                        width: "400px",
                        fontWeight: "Bold",
                        color: "#246624",
                        borderColor: "#246624",
                        backgroundColor: "#DCEEDC",
                        "&:hover": {
                          color: "#FFFFFF",
                          borderColor: "#FFFFFF",
                          backgroundColor: "#246624",
                        },
                      }}
                    >
                      처음부터 듣기
                    </Button>
                    <Button
                      variant="outlined"
                      onClick={handleContinueListening}
                      sx={{
                        width: "400px",
                        fontWeight: "Bold",
                        color: "#246624",
                        borderColor: "#246624",
                        backgroundColor: "#DCEEDC",
                        "&:hover": {
                          color: "#FFFFFF",
                          borderColor: "#FFFFFF",
                          backgroundColor: "#246624",
                        },
                      }}
                    >
                      이어 듣기
                    </Button>
                  </>
                ) : (
                  <Button
                    variant="outlined"
                    onClick={handleListenFromStart}
                    sx={{
                      width: "400px",
                      fontWeight: "Bold",
                      color: "#246624",
                      borderColor: "#246624",
                      backgroundColor: "#DCEEDC",
                      "&:hover": {
                        color: "#FFFFFF",
                        borderColor: "#FFFFFF",
                        backgroundColor: "#246624",
                      },
                    }}
                  >
                    전체 듣기
                  </Button>
                )}
              </Stack>
            </Box>
          </Stack>
        </Box>
      </Card>
    </Box>
  );
};

export default Book;
