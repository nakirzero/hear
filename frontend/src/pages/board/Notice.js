import React, { useEffect, useState } from 'react';
import { Typography, Box, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Pagination, IconButton, InputBase } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';

import Header from '../../components/Header';
import Breadcrumb from '../../components/BreadCrumb';
import Footer from '../../components/Footer';
import { fetchNotices } from '../../api/boardAPI';

// 날짜 포맷팅 함수
const formatDate = (dateString) => {
  const date = new Date(dateString);
  return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}.${String(date.getDate()).padStart(2, '0')}`;
};

const Notice = () => {
  const [data, setData] = useState([]);
  
  useEffect(() => {
    const getNotices = async () => {
      try {
        const notices = await fetchNotices();
        console.log('notices', notices);
        
        setData(notices);
      } catch (error) {
        console.error("Failed to fetch notices:", error);
      }
    };
    getNotices();
  }, []);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header />
      <Breadcrumb />

      {/* Main Content */}
      <Box flexGrow={1} bgcolor="#FFD700" p={2}>
        <Typography variant="h6">공지사항</Typography>

        {/* Search and Filters */}
        <Box display="flex" justifyContent="space-between" alignItems="center" my={2}>
          <Paper component="form" sx={{ display: 'flex', alignItems: 'center', width: 400 }}>
            <InputBase
              sx={{ ml: 1, flex: 1 }}
              placeholder="Search"
              inputProps={{ 'aria-label': 'search' }}
            />
            <IconButton type="submit" sx={{ p: '10px' }} aria-label="search">
              <SearchIcon />
            </IconButton>
          </Paper>
          <Button variant="outlined" startIcon={<FilterListIcon />}>
            Filters
          </Button>
        </Box>

        {/* Table */}
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>번호</TableCell>
                <TableCell>분류</TableCell>
                <TableCell>제목</TableCell>
                <TableCell>작성일</TableCell>
                <TableCell>작성자</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.map((row, index) => (
                <TableRow key={index}>
                  <TableCell>{row.NOTICE_SEQ}</TableCell>
                  <TableCell>{row.NOTICE_DIV}</TableCell>
                  <TableCell>{row.NOTICE_TITLE}</TableCell>
                  <TableCell>{formatDate(row.NOTICE_CrtDt)}</TableCell>
                  <TableCell>{row.NICKNAME}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Pagination */}
        <Box display="flex" justifyContent="center" my={2}>
          <Pagination count={4} page={1} variant="outlined" shape="rounded" />
        </Box>
      </Box>

      <Footer />
    </div>
  );
};

export default Notice;
