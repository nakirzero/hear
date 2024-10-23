import React from 'react';
import { Typography, Box, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Pagination, IconButton, InputBase } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';

import Header from '../../components/Header';
import Breadcrumb from '../../components/BreadCrumb';
import Footer from '../../components/Footer';

const data = [
  { title: "Full name", publisher: "Company name", author: "14", requester: "Team name", date: "Jan 11, 2050" },
  { title: "Full name", publisher: "Company name", author: "14", requester: "Team name", date: "Jan 11, 2050" },
  { title: "Full name", publisher: "Company name", author: "14", requester: "Team name", date: "Jan 11, 2050" },
  { title: "Full name", publisher: "Company name", author: "14", requester: "Team name", date: "Jan 11, 2050" },
  { title: "Full name", publisher: "Company name", author: "14", requester: "Team name", date: "Jan 11, 2050" },
];

const Notice = () => {

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
                <TableCell>제목</TableCell>
                <TableCell>출판사</TableCell>
                <TableCell>작가</TableCell>
                <TableCell>신청자</TableCell>
                <TableCell>작성일</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.map((row, index) => (
                <TableRow key={index}>
                  <TableCell>{row.title}</TableCell>
                  <TableCell>{row.publisher}</TableCell>
                  <TableCell>{row.author}</TableCell>
                  <TableCell>{row.requester}</TableCell>
                  <TableCell>{row.date}</TableCell>
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
