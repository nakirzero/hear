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
  Button,
  Menu,
  MenuItem,
  FormGroup,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import { fetchLibrary } from "../../api/libraryAPI";
import usePagination from "../../hooks/usePagination";
import { useNavigate, useLocation } from "react-router-dom";
import {
  ImportContacts,
  Article,
  Create,
  Share,
  FilterList,
} from "@mui/icons-material";

const Library = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [bookList, setBookList] = useState([]);
  const rowsPerPage = 6;
  const { currentData, totalPages, page, handlePageChange } = usePagination(
    bookList,
    rowsPerPage
  );
  const [category, setCategory] = useState(location.state?.category || null);
  const [book, setBook] = useState();
  const [anchorEl, setAnchorEl] = useState(null);

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
            filteredBooks = response.filter(
              (book) => book.CATEGORY === category
            );
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

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const cardStyle = (selectedCategory, currentCategory) => ({
    width: 200,
    height: 100,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    boxShadow: 3,
    cursor: "pointer",
    transition: "0.3s",
    bgcolor: selectedCategory === currentCategory ? "#246624" : "#DCEEDC",
    color: selectedCategory === currentCategory ? "#ffffff" : "inherit",
    "&:hover": {
      boxShadow: 6,
    },
  });

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
      <Breadcrumb selected={book} />

      <Box
        bgcolor="#f7f7f7"
        py={4}
        display="flex"
        justifyContent="center"
        gap={10}
      >
        {/* 카테고리 카드 */}

        <Card
          sx={cardStyle(category, "200")}
          onClick={() => setCategory("200")}
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
                sx={{
                  marginTop: "5px",
                  color: category === "200" ? "#ffffff" : "#246624",
                }}
              />
              <Typography variant="h6" sx={{ marginTop: "10px" }}>
                시
              </Typography>
            </Box>
          </CardContent>
        </Card>

        <Card
          sx={cardStyle(category, "100")}
          onClick={() => setCategory("100")}
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
                sx={{
                  marginTop: "5px",
                  color: category === "100" ? "#ffffff" : "#246624",
                }}
              />
              <Typography variant="h6" sx={{ marginTop: "10px" }}>
                소설
              </Typography>
            </Box>
          </CardContent>
        </Card>

        <Card
          sx={cardStyle(category, "300")}
          onClick={() => setCategory("300")}
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
                sx={{
                  marginTop: "5px",
                  color: category === "300" ? "#ffffff" : "#246624",
                }}
              />
              <Typography variant="h6" sx={{ marginTop: "10px" }}>
                수필
              </Typography>
            </Box>
          </CardContent>
        </Card>

        <Card
          sx={cardStyle(category, "400")}
          onClick={() => setCategory("400")}
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
                sx={{
                  marginTop: "5px",
                  color: category === "400" ? "#ffffff" : "#246624",
                }}
              />
              <Typography variant="h6" sx={{ marginTop: "10px" }}>
                공유세상
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Box>

      {/* 도서 테이블을 카드 안에 배치 */}
      <Card
        sx={{
          maxWidth: "75%",
          margin: "auto",
          mt: 4,
          p: 4,
          borderRadius: 2,
          boxShadow: 3,
        }}
      >
        <Typography variant="h6" gutterBottom textAlign="center">
          {category === "400" ? "공유세상" : "도서마당"}
        </Typography>
        {/* 공유세상인 경우에만 필터 버튼과 메뉴 렌더링 */}
        {category === "400" && (
          <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
            <Button
              variant="outlined"
              startIcon={<FilterList />}
              onClick={handleMenuOpen}
              sx={{
                color: "#246624",
                borderColor: "#246624",
                "&:hover": {
                  bgcolor: "#246624",
                  color: "#ffffff",
                  borderColor: "#246624",
                },
              }}
            >
              필터
            </Button>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
            >
              <MenuItem>
                <FormGroup>
                  <FormControlLabel
                    control={
                      <Checkbox
                        value="category1"
                        sx={{
                          color: "#246624", // 기본 체크박스 색상
                          "&.Mui-checked": {
                            color: "#246624", // 체크된 상태의 색상
                          },
                          "&:hover": {
                            bgcolor: "transparent", // 마우스 오버 시 배경색 제거
                          },
                        }}
                      />
                    }
                    label="분류 1"
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        value="category1"
                        sx={{
                          color: "#246624", // 기본 체크박스 색상
                          "&.Mui-checked": {
                            color: "#246624", // 체크된 상태의 색상
                          },
                          "&:hover": {
                            bgcolor: "transparent", // 마우스 오버 시 배경색 제거
                          },
                        }}
                      />
                    }
                    label="분류 2"
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        value="category1"
                        sx={{
                          color: "#246624", // 기본 체크박스 색상
                          "&.Mui-checked": {
                            color: "#246624", // 체크된 상태의 색상
                          },
                          "&:hover": {
                            bgcolor: "transparent", // 마우스 오버 시 배경색 제거
                          },
                        }}
                      />
                    }
                    label="분류 3"
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        value="category1"
                        sx={{
                          color: "#246624", // 기본 체크박스 색상
                          "&.Mui-checked": {
                            color: "#246624", // 체크된 상태의 색상
                          },
                          "&:hover": {
                            bgcolor: "transparent", // 마우스 오버 시 배경색 제거
                          },
                        }}
                      />
                    }
                    label="분류 4"
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        value="category1"
                        sx={{
                          color: "#246624", // 기본 체크박스 색상
                          "&.Mui-checked": {
                            color: "#246624", // 체크된 상태의 색상
                          },
                          "&:hover": {
                            bgcolor: "transparent", // 마우스 오버 시 배경색 제거
                          },
                        }}
                      />
                    }
                    label="분류 5"
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        value="category1"
                        sx={{
                          color: "#246624", // 기본 체크박스 색상
                          "&.Mui-checked": {
                            color: "#246624", // 체크된 상태의 색상
                          },
                          "&:hover": {
                            bgcolor: "transparent", // 마우스 오버 시 배경색 제거
                          },
                        }}
                      />
                    }
                    label="분류 6"
                  />
                </FormGroup>
              </MenuItem>
            </Menu>
          </Box>
        )}
        <TableContainer
          component={Paper}
          sx={{ maxWidth: "100%", overflow: "auto" }}
        >
          <Table sx={{ tableLayout: "fixed" }}>
            <TableHead>
              <TableRow>
                <TableCell align="center" sx={{ width: "40%" }}>
                  책 제목
                </TableCell>
                <TableCell align="center" sx={{ width: "20%" }}>
                  작가
                </TableCell>
                <TableCell align="center" sx={{ width: "20%" }}>
                  전체 재생 시간
                </TableCell>
                <TableCell align="center" sx={{ width: "20%" }}>
                  요약 재생 시간
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {currentData.map((book, index) => (
                <TableRow
                  key={index}
                  sx={{
                    backgroundColor:
                      setBook === book.index ? "#e0f7fa" : "inherit",
                    "&:hover": {
                      backgroundColor: "#DCEEDC",
                      cursor: "pointer",
                    },
                    "&:focus": { backgroundColor: "#DCEEDC" },
                  }}
                  onClick={() => handleBook(book)}
                  onKeyPress={(event) => handleKeyPress(event, book)}
                  tabIndex={0}
                >
                  <TableCell component="th" scope="row" align="center">
                    {book.BOOK_NAME}
                  </TableCell>
                  <TableCell align="center">{book.AUTHOR}</TableCell>
                  <TableCell align="center">{book.RUN_TIME}</TableCell>
                  <TableCell align="center">{book.SUM_TIME}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
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
