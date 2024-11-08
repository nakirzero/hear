import React, { useEffect, useState } from 'react';
import { Typography, Box, Table, TableBody, Card, CardContent, Container, TableCell, PaginationItem,TableContainer, TableHead, TableRow, Paper, Pagination, IconButton, InputBase } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

import Header from '../../components/Header';
import Breadcrumb from '../../components/BreadCrumb';
import ProfileSection from '../../components/ProfileSection';
import { fetchNotices } from '../../api/boardAPI';
import usePagination from '../../hooks/usePagination';

// 날짜 포맷팅 함수
const formatDate = (dateString) => {
  const date = new Date(dateString);
  return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}.${String(date.getDate()).padStart(2, '0')}`;
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
        console.log('sorted notices', sortedNotices);
        
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
    
    const filtered = data.filter((notices) => 
      notices.NOTICE_TITLE.includes(searchTerm) ||  
      notices.NICKNAME.includes(searchTerm)
    );
    
    setFilteredData(filtered);
  };

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
      <Breadcrumb />
      <ProfileSection />

      {/* Main Content */}
      
      <Container maxWidth="xl" sx={{ mt: 3, marginTop: '0px' }} >
        <Card
        sx={{ width: 1200, margin: 'auto', mt: 5, mb: 10, p: 12, borderRadius: 5, boxShadow: 10, display: "flex", alignItems: "center", bgcolor: '#ffe0b2',
          justifyContent: "center"}}
        >
           <CardContent>
          <Typography variant="h6" align="center" sx={{fontSize: "36px", marginTop: '-70px'}}>공지사항</Typography>

        {/* Search and Filters */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 6, mb: 2 }}>
          <Paper component="form" onSubmit={handleSearch} sx={{ display: 'flex', alignItems: 'center', width: 400 }}>
            <InputBase
              sx={{ ml: 1, flex: 1 }}
              placeholder="검색"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              inputProps={{ 'aria-label': 'search' }}
            />
            <IconButton type="submit" sx={{p: '10px' }} aria-label="search">
              <SearchIcon />
            </IconButton>
          </Paper>
        </Box>

         {/* Table */}
         <TableContainer component={Paper} sx={{ maxWidth: '100%', overflow: 'auto', mt: 3 }}>
         <Table sx={{ tableLayout: 'fixed' }}>
            <TableHead>
            <TableRow>
              <TableCell align="center" sx={{  fontSize: "18px", fontWeight: 'bold',width: '10%' }}>번호</TableCell>
                <TableCell align="center" sx={{ fontSize: "18px", fontWeight: 'bold',width: '50%' }}>제목</TableCell>
                <TableCell align="center" sx={{ fontSize: "18px", fontWeight: 'bold',width: '20%' }}>작성일</TableCell>
                <TableCell align="center" sx={{ fontSize: "18px", fontWeight: 'bold',width: '20%' }}>작성자</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {currentData.map((row, index) => (
                <TableRow key={index}>
                  <TableCell sx={{ textAlign: "center" }}>{row.NOTICE_SEQ}</TableCell>
                  <TableCell sx={{ textAlign: "center" }}>{row.NOTICE_TITLE}</TableCell>
                  <TableCell sx={{ textAlign: "center" }}>{formatDate(row.NOTICE_CrtDt)}</TableCell>
                  <TableCell sx={{ textAlign: "center" }}>{row.NICKNAME}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

         {/* Pagination */}
         <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2, mb: -10 }}>
          <Pagination
            count={totalPages}
            page={page}
            onChange={handlePageChange}
            renderItem={(item) => (
              <PaginationItem
                {...item}
                sx={{
                  "&.Mui-selected": {
                    bgcolor: "#FFB74D",
                    color: "#ffffff",
                  },
                  "&:hover": {
                    bgcolor: "#FFB74D",
                    color: "#ffffff",
                  },
                }}
              />
            )}
          />
        </Box>
        </CardContent>
    </Card>
      </Container>
    </Box>
  );
};

export default Notice;
