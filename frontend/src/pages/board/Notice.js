import React from 'react';
import { AppBar, Toolbar, Typography, Box, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Pagination, IconButton, InputBase } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import HomeIcon from '@mui/icons-material/Home';
import { useNavigate } from 'react-router-dom';

const data = [
  { title: "Full name", publisher: "Company name", author: "14", requester: "Team name", date: "Jan 11, 2050" },
  { title: "Full name", publisher: "Company name", author: "14", requester: "Team name", date: "Jan 11, 2050" },
  { title: "Full name", publisher: "Company name", author: "14", requester: "Team name", date: "Jan 11, 2050" },
  { title: "Full name", publisher: "Company name", author: "14", requester: "Team name", date: "Jan 11, 2050" },
  { title: "Full name", publisher: "Company name", author: "14", requester: "Team name", date: "Jan 11, 2050" },
];

const Notice = () => {
  const navigate = useNavigate();

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      
      {/* Header */}
      <AppBar position="static" color="transparent" elevation={0} style={{ borderBottom: '1px solid #e0e0e0' }}>
        <Toolbar style={{ justifyContent: 'space-between' }}>
          <Typography variant="h2" noWrap>
            H - ear
          </Typography>
          <Typography variant="body1">Hear-o 님 환영합니다.</Typography>
          <Button variant="contained" color="primary">로그아웃</Button>
        </Toolbar>
      </AppBar>

      {/* Breadcrumb */}
      <Box bgcolor="#000000" color="#fff" py={1} px={2} display="flex" alignItems="center">
        <HomeIcon />
        <Typography variant="body2" ml={1} onClick={() => navigate('/path3')}>
          HOME &gt; 고객게시판 &gt; 공지사항
        </Typography>
      </Box>

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

      {/* Footer */}
      <Box bgcolor="#666" color="#fff" py={2} textAlign="right">
        <Typography variant="body2">
          주소: 61740 광주광역시 남구 양림로 60 광주여고 25 6층실
          </Typography>
          <Typography variant="body2">
          TEL: 062-123-4567 / FAX: 062-987-6543
        </Typography>
        <Typography variant="body2">
          © Copyright 2024 Hear. All rights reserved.
        </Typography>
      </Box>
    </div>
  );
};

export default Notice;
