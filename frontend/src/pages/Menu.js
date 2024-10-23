import React, { useMemo } from "react";
import { Typography, Box, Grid, IconButton } from "@mui/material";
import BookIcon from "@mui/icons-material/Book";
import LibraryBooksIcon from "@mui/icons-material/LibraryBooks";
import SettingsIcon from "@mui/icons-material/Settings";
import SupportAgentIcon from "@mui/icons-material/SupportAgent";
import { useNavigate } from "react-router-dom";

import Header from "../components/Header";
import Footer from "../components/Footer";

import useMenuShortcut from "../hooks/useMenuShortcut";

const Menu = () => {
  const navigate = useNavigate();

  // useMemo를 사용해 menuItems 배열을 메모이제이션
  const menuItems = useMemo(() => [
    { icon: <BookIcon fontSize="inherit" />, label: "1 도서마당", path: "/book" },
    { icon: <LibraryBooksIcon fontSize="inherit" />, label: "2 내 서재", path: "/path1" },
    { icon: <SettingsIcon fontSize="inherit" />, label: "3 설정", path: "/setting" },
    { icon: <SupportAgentIcon fontSize="inherit" />, label: "4 고객게시판", path: "/board" }
  ], []);

  // 단축키 설정, 각 숫자에 대응하는 메뉴의 인덱스에 따라 이동
  useMenuShortcut({
    '1': () => navigate(menuItems[0].path),
    '2': () => navigate(menuItems[1].path),
    '3': () => navigate(menuItems[2].path),
    '4': () => navigate(menuItems[3].path)
  });

  return (
    <Box minHeight="100vh" display="flex" flexDirection="column">
      <Header />

      {/* Main Content */}
      <Box
        flexGrow={1}
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <Grid container spacing={4} justifyContent="center" alignItems="center">
          {menuItems.map(({ icon, label, path }, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Box
                textAlign="center"
                onClick={() => navigate(path)}
                sx={{ cursor: "pointer" }}
              >
                <IconButton sx={{ fontSize: 400 }}>{icon}</IconButton>
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
