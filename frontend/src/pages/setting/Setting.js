import React, { useMemo } from 'react';
import { Typography, Box, Grid, Card, CardContent, Container } from '@mui/material';
import { useNavigate } from 'react-router-dom';

import Header from '../../components/Header';
import Breadcrumb from '../../components/BreadCrumb';
import ProfileSection from '../../components/ProfileSection';
import Footer from '../../components/Footer';

import useMenuShortcut from "../../hooks/useMenuShortcut";
import HeadsetIcon from '@mui/icons-material/Headset';
import PersonIcon from '@mui/icons-material/Person';
import MicIcon from '@mui/icons-material/Mic';

import './Setting.css';

const Setting = () => {
  const navigate = useNavigate();

  const menuItems = useMemo(
    () => [
      {
        icon: <HeadsetIcon className="icon-box icon-audio" />,
        label: "31. 오디오북 설정",
        path: "/setting/audio",
      },
      {
        icon: <PersonIcon className="icon-box icon-user" />,
        label: "32. 회원정보수정",
        path: "/setting/user",
      },
      {
        icon: <MicIcon className="icon-box icon-voice" />,
        label: "33. 목소리 녹음",
        path: "/setting/voice",
      },
    ],
    []
  );

  useMenuShortcut({
    1: () => navigate(menuItems[0].path),
    2: () => navigate(menuItems[1].path),
    3: () => navigate(menuItems[2].path),
  });

  return (
    <Box className="setting-container">
      <Header />
      <Breadcrumb />
      <ProfileSection />

      <Box className="main-content">
        <Container className="grid-container">
          <Grid container spacing={6} justifyContent="center" alignItems="center">
            {menuItems.map(({ icon, label, path }, index) => (
              <Grid item xs={6} sm={4} md={4} key={index}>
                <Card
                  onClick={() => navigate(path)}
                  className="menu-card"
                >
                  <CardContent className="card-content">
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

export default Setting;
