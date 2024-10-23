import React from "react";
import { Typography, Box, Avatar } from "@mui/material";

const ProfileSection = () => {
  return (
    <Box bgcolor="#FFD700" py={4} display="flex" flexDirection="column" alignItems="center">
        <Avatar
          sx={{ width: 100, height: 100, bgcolor: 'gray', mb: 2 }}
          alt="Profile"
        />
        <Typography variant="h6">누구누구</Typography>
        <Typography variant="body2">인증 완료</Typography>
        <Typography variant="body2">24. 11.14 부터 1일간 함께 듣는 중</Typography>
      </Box>
  );
};

export default ProfileSection;
