import React, { useMemo } from "react";
import { Typography, Box, Grid, Card, CardContent, Container } from "@mui/material";
import LibraryMusicIcon from "@mui/icons-material/LibraryMusic";
import { IoLibrary } from "react-icons/io5";
import SettingsIcon from "@mui/icons-material/Settings";
import SupportAgentIcon from "@mui/icons-material/SupportAgent";
import { useNavigate } from "react-router-dom";

import Header from "../components/Header";
import Footer from "../components/Footer";
import useMenuShortcut from "../hooks/useMenuShortcut";

import "./Menu.css";

const Menu = () => {
  const navigate = useNavigate();

  const menuItems = useMemo(  
    () => [
      {
        icon: <LibraryMusicIcon className="icon-box icon-library" />,
        label: "1. 도서마당",
        path: "/library",
      },
      {
        icon: <IoLibrary className="icon-box icon-mystudy" />,
        label: "2. 내 서재",
        path: "/mystudy",
      },
      {
        icon: <SettingsIcon className="icon-box icon-settings" />,
        label: "3. 설정",
        path: "/setting",
      },
      {
        icon: <SupportAgentIcon className="icon-box icon-support" />,
        label: "4. 고객게시판",
        path: "/board",
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
    <Box className="menu-container">
      <Header />

      <Box className="main-content">
        <Container className="grid-container">
          <Grid container spacing={6} justifyContent="center" alignItems="center">
            {menuItems.map(({ icon, label, path }, index) => (
              <Grid item xs={12} sm={6} md={6} key={index}>
                <Card
                  onClick={() => navigate(path)}
                  className="menu-card"
                >
                  <CardContent className="card-content">
                    <Box className="icon-box">{icon}</Box>
                    <Typography  className="menu-label" variant="h6">{label}</Typography>
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

export default Menu;
