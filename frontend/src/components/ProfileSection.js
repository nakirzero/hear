import React from "react";
import { Typography, Box, Avatar } from "@mui/material";
import { useAuth } from "../context/AuthContext"; // AuthContext 사용

const ProfileSection = () => {
  const { userObject } = useAuth(); // 전역 사용자 정보 가져오기

  if (!userObject) {
    return null; // 사용자 정보가 없으면 아무것도 렌더링하지 않음
  }

  const { NICKNAME: nickName, USER_CrtDt: userCrtDt } = userObject;
  const userDate = new Date(userCrtDt);

  const formattedDate = `${userDate.getUTCFullYear()}.${String(userDate.getUTCMonth() + 1).padStart(2, '0')}.${String(userDate.getUTCDate()).padStart(2, '0')}`;

  const today = new Date();
  const todayUTC = Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate());
  const userDateUTC = Date.UTC(userDate.getUTCFullYear(), userDate.getUTCMonth(), userDate.getUTCDate());
  const dayDifference = Math.ceil((todayUTC - userDateUTC) / (1000 * 60 * 60 * 24)) + 1;

  return (
    <Box bgcolor="#FFC700" py={4} display="flex" flexDirection="column" alignItems="center">
      <Avatar
        sx={{ width: 100, height: 100, bgcolor: '#555555', mb: 2 }} // 다크 그레이
        alt="Profile"
      />
      <Typography variant="h6" color="#000000">{nickName}</Typography>  {/* 검정색 텍스트 */}
      <Typography variant="body2" color="#000000">인증 완료</Typography>
      <Typography variant="body2" color="#000000">
        {formattedDate}부터 {dayDifference}일간 함께 듣는 중
      </Typography>
    </Box>
  );
};

export default ProfileSection;
