import React from 'react';
import { Typography, Box, Grid, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

import Header from '../../components/Header';
import Breadcrumb from '../../components/BreadCrumb';
import ProfileSection from '../../components/ProfileSection';
import Footer from '../../components/Footer';

const Board = () => {
  const navigate = useNavigate();

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header />
      <Breadcrumb />
      <ProfileSection />

      {/* Options Section */}
      <Box flexGrow={1} display="flex" justifyContent="center" py={6} bgcolor="#fff">
        <Grid container spacing={10} maxWidth="1000px">
          <Grid item xs={6}>
            <Button
              variant="contained"
              sx={{ padding: 10, textAlign: 'center', width: '100%' }}
              onClick={() => navigate('/board/notice')}
            >
              <Typography variant="h6">공지사항</Typography>
            </Button>
          </Grid>
          <Grid item xs={6}>
            <Button
              variant="contained"
              sx={{ padding: 10, textAlign: 'center', width: '100%' }}
              onClick={() => navigate('/board/suggest')}
            >
              <Typography variant="h6">건의사항</Typography>
            </Button>
          </Grid>
        </Grid>
      </Box>

      <Footer />
    </div>
  );
};

export default Board;
