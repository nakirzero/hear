import React, { useEffect, useState } from 'react';
import { Typography, Box, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Pagination, IconButton, InputBase } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { useNavigate } from 'react-router-dom';

import Header from '../../components/Header';
import Breadcrumb from '../../components/BreadCrumb';
import Footer from '../../components/Footer';
import { fetchSuggests } from '../../api/boardAPI';

// 날짜 포맷팅 함수
const formatDate = (dateString) => {
  const date = new Date(dateString);
  return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}.${String(date.getDate()).padStart(2, '0')}`;
};

// 분류를 "공지"로 변환하는 함수
const formatSuggestDiv = (divValue) => {
  // 특정 값일 경우 "공지"로 변환
  if (divValue === 2) {
    return '건의';
  }
  // 다른 값일 경우 원래의 값을 반환
  return divValue;
};

const Suggest = () => {
  const navigate = useNavigate();

  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);  // 필터링된 데이터 상태
  const [page, setPage] = useState(1);  // 현재 페이지 상태
  const [rowsPerPage] = useState(10);  // 한 페이지당 표시할 행 수 (10개)
  const [totalPages, setTotalPages] = useState(0);  // 전체 페이지 수
  const [searchTerm, setSearchTerm] = useState('');  // 검색어 상태

  
  useEffect(() => {
    const getSuggests = async () => {
      try {
        const suggests = await fetchSuggests();

        // 데이터 NOTICE_CrtDt 기준으로 내림차순 정렬
        const sortedSuggests = suggests.sort((a, b) => new Date(b.NOTICE_CrtDt) - new Date(a.NOTICE_CrtDt));
        console.log('sorted Suggests', sortedSuggests);
        
        setData(sortedSuggests);
        setFilteredData(sortedSuggests); 
        setTotalPages(Math.ceil(sortedSuggests.length / rowsPerPage));
      } catch (error) {
        console.error("Failed to fetch suggests:", error);
      }
    };
    getSuggests();
  }, [rowsPerPage]);

  const handleSearch = (event) => {
    event.preventDefault();
    
    const filtered = data.filter((suggest) => 
      suggest.NOTICE_TITLE.includes(searchTerm) ||  // 제목에 검색어 포함
    suggest.NICKNAME.includes(searchTerm)         // 작성자에 검색어 포함
    );
    
    setFilteredData(filtered);
    setTotalPages(Math.ceil(filtered.length / rowsPerPage));
    setPage(1);  // 페이지를 첫 페이지로 초기화
  };

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header />
      <Breadcrumb />

      {/* Main Content */}
      <Box flexGrow={1} bgcolor="#FFD700" p={2}>
        <Typography variant="h6">건의사항</Typography>

         {/* Search and Filters */}
         <Box display="flex" justifyContent="space-between" alignItems="center" my={2}>
          <Paper component="form" onSubmit={handleSearch} sx={{ display: 'flex', alignItems: 'center', width: 400 }}>
            <InputBase
              sx={{ ml: 1, flex: 1 }}
              placeholder="검색"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              inputProps={{ 'aria-label': 'search' }}
            />
            <IconButton type="submit" sx={{ p: '10px' }} aria-label="search">
              <SearchIcon />
            </IconButton>
          </Paper>
          <Button variant="contained" onClick={() => navigate("/board/write")} fullWidth>
              게시글 작성
            </Button>
        </Box>

        {/* Table */}
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ textAlign: "center" }}>번호</TableCell>
                <TableCell sx={{ textAlign: "center" }}>분류</TableCell>
                <TableCell sx={{ textAlign: "center" }}>제목</TableCell>
                <TableCell sx={{ textAlign: "center" }}>작성일</TableCell>
                <TableCell sx={{ textAlign: "center" }}>작성자</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
            {filteredData
                .slice((page - 1) * rowsPerPage, page * rowsPerPage)  // 페이지 번호에 맞는 데이터 슬라이싱
                .map((row, index) => (
                <TableRow key={index}>
                  <TableCell sx={{ textAlign: "center" }}>{row.NOTICE_SEQ}</TableCell>
                  <TableCell sx={{ textAlign: "center" }}>{formatSuggestDiv(row.NOTICE_DIV)}</TableCell>
                  <TableCell sx={{ textAlign: "center" }}>{row.NOTICE_TITLE}</TableCell>
                  <TableCell sx={{ textAlign: "center" }}>{formatDate(row.NOTICE_CrtDt)}</TableCell>
                  <TableCell sx={{ textAlign: "center" }}>{row.NICKNAME}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

      {/* Pagination */}
      <Box display="flex" justifyContent="center" my={2}>
          <Pagination
            count={totalPages}
            page={page}
            onChange={handlePageChange}
            variant="outlined"
            shape="rounded"
          />
        </Box>
      </Box>
      <Footer />
    </div>
  );
};

export default Suggest;
