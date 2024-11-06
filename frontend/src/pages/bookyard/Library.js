import React, { useState, useEffect } from "react";
import Breadcrumb from "../../components/BreadCrumb";
import Header from "../../components/Header";
import {
  Box,
  Card,
  CardContent,
  Paper,
  TableContainer,
  Table,
  TableBody,
  TableCell,
  TableHead,
  Typography,
  TableRow,
  Pagination,
  PaginationItem,
} from "@mui/material";
import { fetchLibrary } from "../../api/libraryAPI";
import usePagination from "../../hooks/usePagination";
import { useNavigate, useLocation } from "react-router-dom";
import { ImportContacts, Article, Create, Share } from "@mui/icons-material";

const Library = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [bookList, setBookList] = useState([]);
  const rowsPerPage = 6;
  const { currentData, totalPages, page, handlePageChange } = usePagination(bookList, rowsPerPage);
  const [category, setCategory] = useState(location.state?.category || null);
  const [book, setBook] = useState();

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

  const handleBook = (book) => {
    setBook(book.BOOK_SEQ);
    navigate(`/library/book/`, { state: { selected: book.BOOK_SEQ } });
  };

  const handleKeyPress = (event, book) => {
    if (event.key === "Enter" || event.key === " ") {
      setBook(book.BOOK_SEQ);
      handleBook(book);
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
    <Box bgcolor="#FFFEFE"
    sx={{ 
      minHeight: '100vh', 
      overflow: 'hidden', 
      display: 'flex', 
      flexDirection: 'column' 
    }}>
      <Header />
      <Breadcrumb selected={book} />

      <Box
        bgcolor="#f7f7f7"
        py={4}
        display="flex"
        justifyContent="center"
        gap={10}
      >

         {/* 카테고리 카드 */}

        <Card sx={cardStyle} onClick={() => setCategory("200")}>
          <CardContent sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
            <Box display="flex" alignItems="center" gap={1}>
              <ImportContacts fontSize="large" sx={{ marginTop: '5px', color: "#246624" }} />
              <Typography variant="h6" sx={{ marginTop: '10px' }}>시</Typography>
            </Box>
          </CardContent>
        </Card>

        <Card sx={cardStyle} onClick={() => setCategory("100")}>
          <CardContent sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
            <Box display="flex" alignItems="center" gap={1}>
              <Article fontSize="large" sx={{ marginTop: '5px', color: "#246624" }} />
              <Typography variant="h6" sx={{ marginTop: '10px' }}>소설</Typography>
            </Box>
          </CardContent>
        </Card>

        <Card sx={cardStyle} onClick={() => setCategory("300")}>
          <CardContent sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
            <Box display="flex" alignItems="center" gap={1}>
              <Create fontSize="large" sx={{ marginTop: '5px', color: "#246624" }} />
              <Typography variant="h6" sx={{ marginTop: '10px' }}>수필</Typography>
            </Box>
          </CardContent>
        </Card>
        
        <Card sx={cardStyle} onClick={() => setCategory("400")}>
          <CardContent sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
            <Box display="flex" alignItems="center" gap={1}>
              <Share fontSize="large" sx={{ marginTop: '5px', color: "#246624" }} />
              <Typography variant="h6" sx={{ marginTop: '10px' }}>공유세상</Typography>
            </Box>
          </CardContent>
        </Card>
      </Box>

      {/* 도서 테이블을 카드 안에 배치 */}
      <Card sx={{ maxWidth: '75%', margin: 'auto', mt: 4, p: 4, borderRadius: 2, boxShadow: 3 }}>
        <Typography variant="h6" gutterBottom textAlign="center">
          도서마당
        </Typography>
        <TableContainer component={Paper} sx={{ maxWidth: '100%', overflow: 'auto' }}>
          <Table sx={{ tableLayout: 'fixed' }}>
            <TableHead>
              <TableRow>
                <TableCell align="center" sx={{  width: '40%' }}>책 제목</TableCell>
                <TableCell align="center" sx={{ width: '20%' }}>작가</TableCell> {/* 오른쪽 정렬 및 패딩 조정 */}
                <TableCell align="center" sx={{ width: '20%' }}>전체 재생 시간</TableCell>
                <TableCell align="center" sx={{ width: '20%' }}>요약 재생 시간</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {currentData.map((book, index) => (
                <TableRow
                  key={index}
                  sx={{
                    backgroundColor: setBook === book.index ? '#e0f7fa' : 'inherit',
                    '&:hover': { backgroundColor: '#DCEEDC', cursor: 'pointer' },
                    '&:focus': { backgroundColor: '#DCEEDC' }
                  }}
                  onClick={() => handleBook(book)}
                  onKeyPress={(event) => handleKeyPress(event, book)}
                  tabIndex={0}
                >
                  <TableCell component="th" scope="row" align="center" >
                    {book.BOOK_NAME}
                  </TableCell>
                  <TableCell align="center">{book.AUTHOR}</TableCell> {/* 오른쪽 정렬 */}
                  <TableCell align="center">{book.FULL_PATH}</TableCell>
                  <TableCell align="center">{book.SUM_PATH}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
          <Pagination
            count={totalPages}
            page={page}
            onChange={handlePageChange}
            renderItem={(item) => (
              <PaginationItem
                {...item}
                sx={{
                  "&.Mui-selected": {
                    bgcolor: "#246624",
                    color: "#ffffff",
                  },
                  "&:hover": {
                    bgcolor: "#246624",
                    color: "#ffffff",
                  },
                }}
              />
            )}
          />
        </Box>
      </Card>
    </Box>
  );
};

export default Library;
