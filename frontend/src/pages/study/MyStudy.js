import React, { useMemo }from 'react';
import { Typography, Box, Grid, Card, CardContent, Container } from '@mui/material';
import { useNavigate } from 'react-router-dom';

import Header from '../../components/Header';
import Breadcrumb from '../../components/BreadCrumb';
import ProfileSection from '../../components/ProfileSection';
import Footer from '../../components/Footer';

import useMenuShortcut from "../../hooks/useMenuShortcut";
import CommentIcon from '@mui/icons-material/Comment';
import { FaPrayingHands } from "react-icons/fa";
import HistoryIcon from '@mui/icons-material/History';
import StarOutlineIcon from '@mui/icons-material/StarOutline';

import './MyStudy.css';

const MyStudy = () => {
  const navigate = useNavigate();

  const menuItems = useMemo(
    () => [
      {
        icon: <HistoryIcon className="icon-box icon-history" />,
        label: "21. 최근 읽은 기록",
        path: "/mystudy/history",
      },
      {
        icon: <StarOutlineIcon className="icon-box icon-highlight" />,
        label: "22. 하이라이트",
        path: "/",
      },
      {
        icon: <CommentIcon className="icon-box icon-notes" />,
        label: "23. 독서노트",
        path: "/mystudy/mybookreport",
      },
      {
        icon: <FaPrayingHands className="icon-box icon-wishlist" />,
        label: "24. 희망도서신청조회",
        path: "/mystudy/mywishbook",
      },
    ],
    []
  );
  useMenuShortcut({
    1: () => navigate(menuItems[0].path),
    2: () => navigate(menuItems[1].path),
    3: () => navigate(menuItems[2].path),
    4: () => navigate(menuItems[3].path),
  });


  
  return (
    <Box className="my-study-container">
      <Header />
      <Breadcrumb />
      <ProfileSection />

      <Box className="main-content">
        <Container className="grid-container">
          <Grid container spacing={4} justifyContent="center" alignItems="center">
            {menuItems.map(({ icon, label, path }, index) => (
              <Grid item xs={6} sm={4} md={5} key={index}>
                <Card
                  onClick={() => navigate(path)}
                  className="menu-card"
                >
                  <CardContent>
                    {icon}
                    <Typography className="menu-label" variant='h6'>{label}</Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      <Footer />
    </Box>
  );
};

export default MyStudy;