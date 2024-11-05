import React from "react";
import { Typography, Box, Avatar } from "@mui/material";
import { useAuth } from "../context/AuthContext";
import './ProfileSection.css';


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
    <Box className="profile-section">
       <Avatar className="profile-avatar" alt="Profile" />
       <Box className="profile-info">
        <Typography variant="body3" className="profile-nickname">{nickName}</Typography> 
        <Box component="span" variant="body2" className="profile-suffix">
  님
</Box>
        <Typography variant="body2" className="profile-status">인증 완료</Typography> {/* 인증 상태 */}
        <Typography variant="body2" className="profile-date">
          {formattedDate}부터 {dayDifference}일간 함께 듣는 중
        </Typography>
      </Box>
    </Box>
  );
};

export default ProfileSection;
