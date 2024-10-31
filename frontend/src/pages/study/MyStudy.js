import React from 'react';
import { Typography, Box, Grid, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

import Header from '../../components/Header';
import Breadcrumb from '../../components/BreadCrumb';
import ProfileSection from '../../components/ProfileSection';
import Footer from '../../components/Footer';

const MyStudy = () => {
  const navigate = useNavigate();
  
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header />
      <Breadcrumb />
      <ProfileSection />

      <Box flexGrow={1} display="flex" justifyContent="center" py={6} bgcolor="#fff">
        <Grid container spacing={10} maxWidth="1000px">
          <Grid item xs={6}>
            <Button
              variant="contained"
              sx={{ padding: 10, textAlign: 'center', width: '100%' }}
              onClick={() => navigate('/mystudy/history')}
            >
              <Typography variant="h6">최근 읽은 기록</Typography>
            </Button>
          </Grid>
          <Grid item xs={6}>
            <Button
              variant="contained"
              sx={{ padding: 10, textAlign: 'center', width: '100%' }}
              onClick={() => navigate('/mystudy/highlight')}
            >
              <Typography variant="h6">하이라이트</Typography>
            </Button>
          </Grid>
          <Grid item xs={6}>
            <Button
              variant="contained"
              sx={{ padding: 10, textAlign: 'center', width: '100%' }}
              onClick={() => navigate('/mystudy/mybookreport')}
            >
              <Typography variant="h6">독서노트</Typography>
            </Button>
          </Grid>
          <Grid item xs={6}>
            <Button
              variant="contained"
              sx={{ padding: 10, textAlign: 'center', width: '100%' }}
              onClick={() => navigate('/mystudy/mywishbook')}
            >
              <Typography variant="h6">희망도서신청조회</Typography>
            </Button>
          </Grid>
        </Grid>
      </Box>

      <Footer />
    </div>
  );
};

export default MyStudy;
