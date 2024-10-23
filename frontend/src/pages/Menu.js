import React from 'react';
import { Typography, Box, Grid, IconButton } from '@mui/material';
import BookIcon from '@mui/icons-material/Book';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import SettingsIcon from '@mui/icons-material/Settings';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import { useNavigate } from 'react-router-dom';

import Header from '../components/Header';
import Footer from '../components/Footer';

const Menu = () => {
  const navigate = useNavigate();

  return (
    <Box minHeight="100vh" display="flex" flexDirection="column">
      <Header />

      {/* Main Content */}
      <Box flexGrow={1} display="flex" alignItems="center" justifyContent="center">
        <Grid container spacing={4} justifyContent="center" alignItems="center">
          {[
            { icon: <BookIcon fontSize="inherit" />, label: "1 도서마당", path: "/book" },
            { icon: <LibraryBooksIcon fontSize="inherit" />, label: "2 내 서재", path: "/path1" },
            { icon: <SettingsIcon fontSize="inherit" />, label: "3 설정", path: "/setting" },
            { icon: <SupportAgentIcon fontSize="inherit" />, label: "4 고객게시판", path: "/board" }
          ].map(({ icon, label, path }, index) => (
            <Grid item={true} xs={12} sm={6} md={3} key={index}>
              <Box textAlign="center" onClick={() => navigate(path)} sx={{ cursor: 'pointer' }}>
                <IconButton sx={{ fontSize: 300 }}>
                  {icon}
                </IconButton>
                <Typography variant="h6">{label}</Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Box>
      <Footer />
      
    </Box>
  );
};

export default Menu;
