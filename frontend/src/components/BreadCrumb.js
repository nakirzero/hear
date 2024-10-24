import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Typography, Box, Breadcrumbs, Link } from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import SettingsIcon from "@mui/icons-material/Settings";
import HeadsetIcon from '@mui/icons-material/Headset';
import PersonIcon from "@mui/icons-material/Person";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import NotificationsIcon from "@mui/icons-material/Notifications";
import MicIcon from '@mui/icons-material/Mic';

const Breadcrumb = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // URL 경로를 한글로 변환하는 매핑
  const pathNameMap = {
    "setting": "설정",
    "audio": "오디오북 설정",
    "user": "회원정보 수정",
    "board": "고객 게시판",
    "notice": "공지사항",
    "voice": "목소리 녹음"
  };

  // 각 경로에 맞는 아이콘 매핑
  const iconMap = {
    "setting": <SettingsIcon sx={{ verticalAlign: "middle" }} />,
    "audio": <HeadsetIcon sx={{ verticalAlign: "middle" }} />,
    "user": <PersonIcon sx={{ verticalAlign: "middle" }} />,
    "menu": <MenuBookIcon sx={{ verticalAlign: "middle" }} />,
    "board": <MenuBookIcon sx={{ verticalAlign: "middle" }} />,
    "notice": <NotificationsIcon sx={{ verticalAlign: "middle" }} />,
    "voice": <MicIcon sx={{ verticalAlign: "middle" }} />
  };

  const pathnames = location.pathname.split("/").filter((x) => x);

  return (
    <Box bgcolor="#000000" color="#fff" py={1} px={2} display="flex" alignItems="center">
      <Breadcrumbs aria-label="breadcrumb" separator=">" sx={{ color: "#fff" }}>
        {/* 홈 아이콘과 '/'를 항상 표시 */}
        <Link
          color="inherit"
          onClick={() => navigate("/menu")}
          sx={{
            display: "flex",
            alignItems: "center",
            cursor: "pointer",
            color: "#fff",
            textDecoration: "none",
          }}
        >
          <HomeIcon sx={{ verticalAlign: "middle" }} />
          <Typography variant="body2" ml={1}>
            HOME
          </Typography>
        </Link>

        {/* 동적 Breadcrumb 생성 */}
        {pathnames.map((value, index) => {
          const to = `/${pathnames.slice(0, index + 1).join("/")}`;
          const displayName = pathNameMap[value] || value.toLowerCase();
          const icon = iconMap[value] || null;

          return index + 1 === pathnames.length ? (
            <Box key={to} display="flex" alignItems="center" sx={{ color: "#fff" }}>
              {icon && <Box mr={0.5}>{icon}</Box>}
              <Typography variant="body2">{displayName}</Typography>
            </Box>
          ) : (
            <Link
              key={to}
              color="inherit"
              onClick={() => navigate(to)}
              sx={{
                display: "flex",
                alignItems: "center",
                cursor: "pointer",
                color: "#fff",
                textDecoration: "none",
              }}
            >
              {icon && <Box mr={0.5}>{icon}</Box>}
              <Typography variant="body2">{displayName}</Typography>
            </Link>
          );
        })}
      </Breadcrumbs>
    </Box>
  );
};

export default Breadcrumb;
