import React from "react";
import { useNavigate } from "react-router-dom";
import { Typography, Box } from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";

const Breadcrumb = () => {
  const navigate = useNavigate();
  return (
    <Box
      bgcolor="#000000"
      color="#fff"
      py={1}
      px={2}
      display="flex"
      alignItems="center"
    >
      <HomeIcon />
      <Typography variant="body2" ml={1} onClick={() => navigate("/menu")}>
        HOME &gt; 설정
      </Typography>
    </Box>
  );
};

export default Breadcrumb;
