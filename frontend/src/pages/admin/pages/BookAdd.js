import React, { useState } from "react";
import {
  fetchBookAdd,
} from "../api/BookAPI.js";
import {
  Box,
  Button,
  TextField,
  Paper,
  Toolbar,
  CssBaseline,
  ThemeProvider,
  Typography,
  Grid,
  InputLabel,
  MenuItem,
  FormControl,
  Select,
  Tabs, Tab
} from "@mui/material";

import DrawerComponent from "../components/DrawerComponent.js";
import theme from "../../../theme";
import Copyright from "../components/Copyright.js";
import CustomAppBar from "../components/CustomAppBar.js";
import { useNavigate } from "react-router-dom";

const BookAdd = () => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(true);
  const [selectedTab, setSelectedTab] = useState(0);

  const [filename, setFilename] = useState("");
  const [bookAdd, setBookAdd] = useState({
    category: "",
    img: null, // img를 null로 초기화
    title: "",
    author: "",
    publisher: "",
    information: "",
    text: "",
  });

  const toggleDrawer = () => setOpen(!open);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setBookAdd((prevBookAdd) => {
      return { ...prevBookAdd, [name]: value };
    });
  };

  const handleBookAdd = async () => {
    // 서버로 데이터 전송 시 img 파일 객체를 포함해야 합니다.
    const formData = new FormData();
    formData.append("category", bookAdd.category);
    formData.append("img", bookAdd.img); // 파일 객체를 추가
    formData.append("title", bookAdd.title);
    formData.append("author", bookAdd.author);
    formData.append("publisher", bookAdd.publisher);
    formData.append("information", bookAdd.information);
    formData.append("text", bookAdd.text); // 파일 객체를 추가
 
    await fetchBookAdd(formData);
    setBookAdd({
      category: "",
      img: null,
      title: "",
      author: "",
      publisher: "",
      information: "",
      text: "",
    });
    setFilename("");
   
  };



  const handleFileInputChange = (e) => {
    const { name } = e.target;
    const file = e.target.files[0];
    
    if (file) {
    const reader = new FileReader();

    reader.onload = () => {
      const fileContent = reader.result; // 파일 내용을 얻음
      console.log(fileContent); // 파일 내용을 출력
      
      if (name === "text") {
        setFilename(file.name);
        setBookAdd((prevBookAdd) => ({
          ...prevBookAdd,
          text: fileContent, // 파일 내용을 상태로 저장
        }));
      } else if (name === "img") {
        setBookAdd((prevBookAdd) => ({
          ...prevBookAdd,
          img: file, // 이미지 파일 객체로 저장
        }));
      }
    };

    reader.readAsText(file, "UTF-8"); // 파일 객체를 읽음
  }

  // 파일 입력 초기화 (같은 파일을 선택해도 onChange가 작동하도록 하기 위함)
  e.target.value = "";
};

const handleTabChange = (newValue) => {
  setSelectedTab(newValue);
  if (newValue === 1) {
    // 두 번째 탭 클릭 시 업로드 이력 페이지로 이동
    navigate("/admin/booklist");
  }
};
  
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ display: "flex", minHeight: "100vh" }}>
        <CustomAppBar open={open} toggleDrawer={toggleDrawer} />
        <DrawerComponent open={open} toggleDrawer={toggleDrawer} />

        <Box
          component="main"
          sx={{
            flexGrow: 1,
            backgroundColor: (theme) =>
              theme.palette.mode === "light"
                ? theme.palette.grey[100]
                : theme.palette.grey[900],
            overflow: "auto",
            p: 3,
          }}
        >
          <Toolbar />
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              gap: 4, // 두 요소 사이의 간격
              mb: 4, // 아래쪽 여백
            }}
          >
          <Tabs value={selectedTab} onChange={(_, newValue) => handleTabChange(newValue)} centered>
            <Tab label={<Typography variant="h4" noWrap>도서 추가</Typography>} />
            <Tab label={<Typography variant="h4" noWrap>도서 목록</Typography>} />
          </Tabs>
          </Box>

          <Paper sx={{ p: 4, mb: 4 }}>
            <Grid container spacing={3}>
              {/* 카테고리 선택 */}
              <Grid item xs={12} sm={3}>
                <FormControl fullWidth>
                  <InputLabel id="category-label">카테고리</InputLabel>
                  <Select
                    labelId="category-label"
                    name="category"
                    value={bookAdd.category}
                    onChange={handleInputChange}
                    label="카테고리"
                  >
                    <MenuItem value="100">100</MenuItem>
                    <MenuItem value="200">200</MenuItem>
                    <MenuItem value="300">300</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              {/* 도서 정보 입력 */}
              {["title", "author", "publisher", "information"].map((field) => (
                <Grid item xs={12} sm={3} key={field}>
                  <TextField
                    fullWidth
                    name={field}
                    value={bookAdd[field]}
                    onChange={handleInputChange}
                    label={field === "title" ? "도서 제목" : field === "author" ? "작가" : field === "publisher" ? "출판사" : field === "information" ? "정보" : "" }
                  />
                </Grid>
              ))}

              {/* 이미지 파일 입력 */}
              <Grid
                item
                xs={12}
                sm={3}
                sx={{ display: "flex", alignItems: "center", justifyContent: "flex-end" }}
              >
                <Typography
                  gutterBottom
                  align="right"
                  sx={{ textAlign: "right", mr: 2 }}
                >
                  {bookAdd.img ? bookAdd.img.name : ""}
                </Typography>
                <Button variant="contained" component="label" color="primary">
                  이미지파일
                  <input
                    type="file"
                    hidden
                    name="img"
                    onChange={handleFileInputChange}
                  />
                </Button>
              </Grid>

              {/* 본문 파일 입력 */}
              <Grid
                item
                xs={12}
                sm={3}
                sx={{ display: "flex", alignItems: "center", justifyContent: "flex-end" }}
              >
                <Typography
                  gutterBottom
                  align="right"
                  sx={{ textAlign: "right", mr: 2 }}
                >
                  {filename}
                </Typography>
                <Button variant="contained" component="label" color="primary">
                  본문파일
                  <input
                    type="file"
                    accept=".txt"
                    hidden
                    name="text"
                    onChange={handleFileInputChange}
                  />
                </Button>
              </Grid>

              <Grid
                item
                xs={12}
                sm={3}
                sx={{ display: "flex", alignItems: "center", justifyContent: "flex-Start" }}
              >
                <Button onClick={handleBookAdd} variant="contained" color="primary">
                  추가
                </Button>
              </Grid>
            </Grid>
          </Paper>

          
        </Box>
      </Box>

      

      <Copyright />
    </ThemeProvider>
  );
};

export default BookAdd;
