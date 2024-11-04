import React, { useState, useEffect } from "react";
import Breadcrumb from "../../components/BreadCrumb";
import Header from "../../components/Header";
import Footer from "../../components/Footer";

import {
  Box,
  Button,
  Paper,
  TableContainer,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Stack,
  Pagination,
} from "@mui/material";
import { fetchLibrary } from "../../api/libraryAPI";

import usePagination from "../../hooks/usePagination"; // usePagination 훅 가져오기
import { useNavigate, useLocation  } from "react-router-dom";


const Library = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [bookList, setBookList] = useState([]);
  const rowsPerPage = 5; // 페이지당 표시할 데이터 개수
  const { currentData, totalPages, page, handlePageChange } = usePagination(bookList, rowsPerPage);
  const [category, setCategory] = useState(location.state?.category || null);
  // 데이터를 가져오는 함수
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetchLibrary();
        let filteredBooks = response;

        if (category) {
          if (category === "400") {
            filteredBooks = response.filter((book) =>
              ["410", "420", "430", "440", "450", "460"].includes(book.CATEGORY)
            );
          } else {
            filteredBooks = response.filter((book) => book.CATEGORY === category);
          }
        }

        setBookList(filteredBooks);
      } catch (error) {
        console.error("데이터를 불러오는 중 오류가 발생했습니다.", error);
      }
    };
    fetchData();
  }, [category]);

  // 책을 클릭했을 때 해당 책을 선택하는 함수
  const handleBook = (book) => {
    console.log(book);  
    navigate(`/library/book/`, { state: { selected: book} });
  };

  const handleKeyPress = (event, book) => {
    if (event.key === "Enter" || event.key === " ") {
      handleBook(book);
    }
  };

  const buttonStyle = {
    width: 300,
    height: 160,
    borderRadius: 10,
    fontSize: "1.5rem",
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
            onClick={() => setCategory("200")}
            aria-label="시 카테고리로 이동"
          >
            1. 시
          </Button>
          <Button
            variant="contained"
            color="secondary"
            sx={buttonStyle}
            onClick={() => setCategory("100")}
            aria-label="소설 카테고리로 이동"
          >
            2. 소설
          </Button>
          <Button
            variant="contained"
            color="secondary"
            sx={buttonStyle}
            onClick={() => setCategory("300")}
            aria-label="수필 카테고리로 이동"
          >
            3. 수필
          </Button>
          <Button
            variant="contained"
            color="secondary"
            sx={buttonStyle}
            onClick={() => setCategory("400")}
            aria-label="공유세상 카테고리로 이동"
          >
            4. 공유세상
          </Button>
        </Box>
      </Box>

     
      
        <TableContainer
          component={Paper}
          sx={{ marginTop: 4, width: "70%", marginX: "auto" }}
        >
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell align="center" sx={{ fontSize: "2rem" }}>
                  책 제목
                </TableCell>
                <TableCell align="center" sx={{ fontSize: "2rem" }}>
                  작가
                </TableCell>
                <TableCell align="center" sx={{ fontSize: "2rem" }}>
                  전체 재생 시간
                </TableCell>
                <TableCell align="center" sx={{ fontSize: "2rem" }}>
                  요약 재생 시간
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {currentData.map((book, index) => (
                <TableRow
                  key={index}
                  sx={{
                    "&:last-child td, &:last-child th": { border: 0 },
                    cursor: "pointer",
                  }}
                  onClick={() => handleBook(book)}
                  onKeyPress={(event) => handleKeyPress(event, book)}
                  tabIndex={0}
                >
                  <TableCell
                    align="center"
                    component="th"
                    scope="row"
                    sx={{ fontSize: "1.6rem" }}
                  >
                    {book.BOOK_NAME}
                  </TableCell>
                  <TableCell align="center" sx={{ textAlign: "center" }}>
                    {book.AUTHOR}
                  </TableCell>
                  <TableCell align="center" sx={{ textAlign: "center" }}>
                    {book.FULL_PATH}
                  </TableCell>
                  <TableCell align="center" sx={{ textAlign: "center" }}>
                    {book.SUM_PATH}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <Stack spacing={2} alignItems="center" sx={{ mb: 4 }}>
            <Pagination
              count={totalPages}
              page={page}
              onChange={handlePageChange}
              variant="outlined"
              shape="rounded"
            />
          </Stack>
        </TableContainer>
      

      <Footer />
    </div>
  );
};

export default Library;
