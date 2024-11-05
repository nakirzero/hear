// Suggest.js
import React, { useEffect, useState } from 'react';
import { Typography, Box, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Pagination, IconButton, InputBase } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { useNavigate } from 'react-router-dom';

import Header from '../../components/Header';
import Breadcrumb from '../../components/BreadCrumb';
import Footer from '../../components/Footer';
import { fetchSuggests } from '../../api/boardAPI';
import usePagination from '../../hooks/usePagination';

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}.${String(date.getDate()).padStart(2, '0')}`;
};

const formatSuggestDiv = (divValue) => {
  return divValue === 2 ? '건의' : divValue;
};

const Suggest = () => {
  const navigate = useNavigate();

  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const { currentData, totalPages, page, handlePageChange } = usePagination(filteredData, 10);

  useEffect(() => {
    const getSuggests = async () => {
      try {
        const suggests = await fetchSuggests();
        const sortedSuggests = suggests.sort((a, b) => new Date(b.NOTICE_CrtDt) - new Date(a.NOTICE_CrtDt));
        
        setData(sortedSuggests);
        setFilteredData(sortedSuggests);
      } catch (error) {
        console.error("Failed to fetch suggests:", error);
      }
    };
    getSuggests();
  }, []);

  const handleSearch = (event) => {
    event.preventDefault();
    
    const filtered = data.filter((suggest) => 
      suggest.NOTICE_TITLE.includes(searchTerm) ||  
      suggest.NICKNAME.includes(searchTerm)
    );
    
    setFilteredData(filtered);
  };

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#FFCF8B' }}>
      <Header />
      <Breadcrumb />

      {/* Main Content */}
      <Box sx={{ maxWidth: '80%', margin: 'auto', padding: 3, textAlign: 'center' }}>
        <Typography variant="h5" gutterBottom>건의사항</Typography>

        {/* Search and "게시글 작성" Button */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
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
          <Button variant="contained" color="primary" onClick={() => navigate("/board/write")}>
            게시글 작성
          </Button>
        </Box>

        {/* Table */}
        <TableContainer component={Paper} sx={{ boxShadow: 3, borderRadius: 2, mt: 2 }}>
          <Table sx={{ tableLayout: 'fixed' }}>
            <TableHead>
              <TableRow>
                <TableCell align="center" sx={{ width: '5%' }}>번호</TableCell>
                <TableCell align="center" sx={{ width: '20%' }}>분류</TableCell>
                <TableCell align="center" sx={{ width: '40%' }}>제목</TableCell>
                <TableCell align="center" sx={{ width: '20%' }}>작성일</TableCell>
                <TableCell align="center" sx={{ width: '15%' }}>작성자</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {currentData.map((row, index) => (
                <TableRow key={index} sx={{ '&:hover': { backgroundColor: '#FFD433', cursor: 'pointer' } }}>
                  <TableCell align="center">{row.NOTICE_SEQ}</TableCell>
                  <TableCell align="center">{formatSuggestDiv(row.NOTICE_DIV)}</TableCell>
                  <TableCell align="center">{row.NOTICE_TITLE}</TableCell>
                  <TableCell align="center">{formatDate(row.NOTICE_CrtDt)}</TableCell>
                  <TableCell align="center">{row.NICKNAME}</TableCell>
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
    </Box>
  );
};

export default Suggest;
