import React, { useState } from 'react';
import { ThemeProvider, CssBaseline, Box, Container, Grid, Paper, Toolbar } from '@mui/material';
import CustomAppBar from './components/CustomAppBar';
import DrawerComponent from './components/DrawerComponent';
import Copyright from './components/Copyright';
import theme from '../../theme';

// 차트 컴포넌트 및 표 컴포넌트 임포트
import Chart1 from './pages/Dashboard/Chart1';
import Chart2 from './pages/Dashboard/Chart2';
import Table1 from './pages/Dashboard/Table1';
import Table2 from './pages/Dashboard/Table2';
import Table3 from './pages/Dashboard/Table3';

export default function Dashboard() {
  const [open, setOpen] = useState(true);
  const toggleDrawer = () => {
    setOpen(!open);
  };

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ display: 'flex' }}>
        <CssBaseline />
        <CustomAppBar open={open} toggleDrawer={toggleDrawer} />
        <DrawerComponent open={open} toggleDrawer={toggleDrawer} />
        <Box
          component="main"
          sx={{
            backgroundColor: (theme) =>
              theme.palette.mode === 'light' ? theme.palette.grey[100] : theme.palette.grey[900],
            flexGrow: 1,
            height: '100vh',
            overflow: 'auto',
          }}
        >
          <Toolbar />
          <Container maxWidth="xl" sx={{ mt: 2, mb: 4 }}>
            <Paper sx={{ p: 3 }}>
              {/* 상단 차트 */}
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Chart1 />
                </Grid>
                <Grid item xs={12} md={6}>
                  <Chart2 />
                </Grid>
              </Grid>

              {/* 하단 표 3개 */}
              <Grid container spacing={3} sx={{ mt: 3 }}>
                <Grid item xs={12} md={4}>
                  <Table1 />
                </Grid>
                <Grid item xs={12} md={4}>
                  <Table2 />
                </Grid>
                <Grid item xs={12} md={4}>
                  <Table3 />
                </Grid>
              </Grid>
            </Paper>

            <Copyright sx={{ pt: 2 }} />
          </Container>
        </Box>
      </Box>
    </ThemeProvider>
  );
}
