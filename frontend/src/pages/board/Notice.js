import React, { useEffect, useState } from 'react';
import { Typography, Box, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Pagination, IconButton, InputBase } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';

import Header from '../../components/Header';
import Breadcrumb from '../../components/BreadCrumb';
import ProfileSection from '../../components/ProfileSection';
import Footer from '../../components/Footer';
import { fetchNotices } from '../../api/boardAPI';
import usePagination from '../../hooks/usePagination';

import './Notice.css';

// 날짜 포맷팅 함수
const formatDate = (dateString) => {
  const date = new Date(dateString);
  return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}.${String(date.getDate()).padStart(2, '0')}`;
};

// 분류를 "공지"로 변환하는 함수
const formatNoticeDiv = (divValue) => {
  return divValue === 1 ? '공지' : divValue;
};

const Notice = () => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const { currentData, totalPages, page, handlePageChange } = usePagination(filteredData, 6);

  useEffect(() => {
    const getNotices = async () => {
      try {
        const notices = await fetchNotices();
        const sortedNotices = notices.sort((a, b) => new Date(b.NOTICE_CrtDt) - new Date(a.NOTICE_CrtDt));
        setData(sortedNotices);
        setFilteredData(sortedNotices);
      } catch (error) {
        console.error("Failed to fetch notices:", error);
      }
    };
    getNotices();
  }, []);

  const handleSearch = (event) => {
    event.preventDefault();
    const filtered = data.filter((notice) => 
      notice.NOTICE_TITLE.includes(searchTerm) || notice.NICKNAME.includes(searchTerm)
    );
    setFilteredData(filtered);
  };

  return (
    <div className="notice-container">
      <Header />
      <Breadcrumb />
      <ProfileSection />

      {/* Main Content */}
      <Box className="main-content">
        <Box className="notice-box">
          <Typography variant="h6" className="notice-title">공지사항</Typography>

          {/* Search and Filters */}
          <Box className="search-container">
            <Paper component="form" onSubmit={handleSearch} className="search-bar">
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
            <Button variant="outlined" className="filters-button" startIcon={<FilterListIcon />}>
              Filters
            </Button>
          </Box>

          {/* Table */}
          <TableContainer component={Paper} className="table-container">
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell className="table-cell-center">번호</TableCell>
                  <TableCell className="table-cell-center">분류</TableCell>
                  <TableCell className="table-cell-center">제목</TableCell>
                  <TableCell className="table-cell-center">작성일</TableCell>
                  <TableCell className="table-cell-center">작성자</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {currentData.map((row, index) => (
                  <TableRow key={index}>
                    <TableCell className="table-cell-center">{row.NOTICE_SEQ}</TableCell>
                    <TableCell className="table-cell-center">{formatNoticeDiv(row.NOTICE_DIV)}</TableCell>
                    <TableCell className="table-cell-center">{row.NOTICE_TITLE}</TableCell>
                    <TableCell className="table-cell-center">{formatDate(row.NOTICE_CrtDt)}</TableCell>
                    <TableCell className="table-cell-center">{row.NICKNAME}</TableCell>
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
      </Box>

      <Footer />
    </div>
  );
};

export default Notice;
