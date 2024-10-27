// Breadcrumb 컴포넌트 코드
import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Typography, Box, Breadcrumbs, Link } from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import SettingsIcon from "@mui/icons-material/Settings";
import HeadsetIcon from '@mui/icons-material/Headset';
import PersonIcon from "@mui/icons-material/Person";
import SupportAgentIcon from "@mui/icons-material/SupportAgent";
import NotificationsIcon from "@mui/icons-material/Notifications";
import MicIcon from '@mui/icons-material/Mic';
import { IoLibrary } from "react-icons/io5";
import MailIcon from '@mui/icons-material/Mail';
import CreateIcon from '@mui/icons-material/Create';
import LibraryMusicIcon from '@mui/icons-material/LibraryMusic';
import AutoStoriesIcon from '@mui/icons-material/AutoStories';
import { FaPrayingHands } from "react-icons/fa";
import CommentIcon from '@mui/icons-material/Comment';
import NoteAltIcon from '@mui/icons-material/NoteAlt';

const Breadcrumb = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const pathNameMap = {
    "setting": "설정",
    "audio": "오디오북 설정",
    "user": "회원정보 수정",
    "board": "고객 게시판",
    "notice": "공지사항",
    "voice": "목소리 녹음",
    "mystudy" : "내 서재",
    "suggest" : "건의사항",
    "write" : "건의사항 작성",
    "library" : "도서마당",
    "book" : "책 화면",
    "mywishbook" : "희망도서 신청조회",
    'mybookreport' : '독서노트',
    'writereport' : '독서노트 작성',
  };

  const iconMap = {
    "setting": <SettingsIcon sx={{ verticalAlign: "middle" }} />,
    "audio": <HeadsetIcon sx={{ verticalAlign: "middle" }} />,
    "user": <PersonIcon sx={{ verticalAlign: "middle" }} />,
    "board": <SupportAgentIcon sx={{ verticalAlign: "middle" }} />,
    "notice": <NotificationsIcon sx={{ verticalAlign: "middle" }} />,
    "voice": <MicIcon sx={{ verticalAlign: "middle" }} />,
    "mystudy": <IoLibrary style={{ verticalAlign: "middle", fontSize: "20px" }} />,
    "suggest": <MailIcon sx={{ verticalAlign: "middle" }} />,
    "write": <CreateIcon sx={{ verticalAlign: "middle" }} />,
    "library": <LibraryMusicIcon sx={{ verticalAlign: "middle" }} />,
    "book": <AutoStoriesIcon sx={{ verticalAlign: "middle" }} />,
    "mywishbook": <FaPrayingHands style={{ verticalAlign: "middle", fontSize: "20px" }} />,
    "mybookreport": <CommentIcon sx={{ verticalAlign: "middle" }} />,
    "writereport": <NoteAltIcon sx={{ verticalAlign: "middle" }} />,
  };

  const pathnames = location.pathname.split("/").filter((x) => x);

  return (
    <Box bgcolor="#000000" color="#fff" py={1} px={2} display="flex" alignItems="center">
      <Breadcrumbs aria-label="breadcrumb" separator=">" sx={{ color: "#fff" }}>
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
            홈
          </Typography>
        </Link>

        {pathnames.map((value, index) => {
          const to = `/${pathnames.slice(0, index + 1).join("/")}`;
          const displayName = pathNameMap[value] || value.toLowerCase();
          const icon = iconMap[value] || null;
          const isLast = index === pathnames.length - 1;
          const isId = !isNaN(value);

          return isLast && isId ? null : (
            isLast ? (
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
            )
          );
        })}
      </Breadcrumbs>
    </Box>
  );
};

export default Breadcrumb;
