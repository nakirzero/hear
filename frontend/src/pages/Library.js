import React, { useState, useEffect } from "react";
import Breadcrumb from "../components/BreadCrumb";
import Header from "../components/Header";
import Footer from "../components/Footer";

import {Box, Button, Paper, TableContainer, Table, TableBody, TableCell, TableHead, TableRow, Stack, Pagination, } from "@mui/material";
import { fetchLibrary } from "../api/libraryAPI";
import { useNavigate, useLocation } from "react-router-dom";
import usePagination from "../hooks/usePagination";

const Library = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [bookList, setBookList] = useState([]);

  const { currentData, totalPages, page, handlePageChange } = usePagination(
    bookList,
    10
  );

  // 데이터를 가져오는 함수
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetchLibrary();
        console.log(response);

        // URL 파라미터를 기반으로 필터링 적용
        const params = new URLSearchParams(location.search);
        const category = params.get("category");
        if (category) {
          const filteredBooks = response.filter(
            (book) => book.CATEGORY === category
          );
          setBookList(filteredBooks);
        } else {
          setBookList(response); // 파라미터가 없을 경우 전체 목록을 표시
        }
      } catch (error) {
        console.error("데이터를 불러오는 중 오류가 발생했습니다.", error);
      }
    };

    fetchData();
  }, [location.search]);

  const buttonStyle = {
    width: 300,
    height: 160,
    borderRadius: 10,
    fontSize: "1.5rem",
  };

  // 카테고리 필터링 함수
  const handleCategoryFilter = (category) => {
    navigate(`/library?category=${category}`);
  };

  const handleBook = (book) => {
    console.log(book.BOOK_NAME);
    navigate(`/book?BOOK_SEQ=${book.BOOK_SEQ}`);
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
            onClick={() => handleCategoryFilter("200")}
            aria-label="카테고리 시로 이동"
          >
            1. 시
          </Button>
          <Button
            variant="contained"
            sx={buttonStyle}
            onClick={() => handleCategoryFilter("100")}
            aria-label="카테고리 소설로 이동"
          >
            2. 소설
          </Button>
          <Button
            variant="contained"
            sx={buttonStyle}
            onClick={() => handleCategoryFilter("300")}
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

      <TableContainer
        component={Paper}
        sx={{ marginTop: 4, width: "80%", marginX: "auto" }}
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
                총 파일 시간
              </TableCell>
              <TableCell align="center" sx={{ fontSize: "2rem" }}>
                요약 파일 시간
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {currentData.map((book) => (
              <TableRow
                key={book.BOOK_NAME}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                onClick={() => handleBook(book)}
              >
                <TableCell
                  align="center"
                  component="th"
                  scope="row"
                  sx={{ fontSize: "1.75rem" }}
                >
                  {book.BOOK_NAME}
                </TableCell>
                <TableCell align="center" sx={{ fontSize: "1.75rem" }}>
                  {book.AUTHOR}
                </TableCell>
                <TableCell align="center" sx={{ fontSize: "1.75rem" }}>
                  {book.FULL_PATH}
                </TableCell>
                <TableCell align="center" sx={{ fontSize: "1.75rem" }}>
                  {book.SUM_PATH}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <Stack spacing={2} alignItems={"center"} sx={{ mb: 4 }}>
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
