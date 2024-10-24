import React, { useState, useEffect } from "react";
import { Typography, Container, Box, Button, TextField } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext"; // AuthContext 추가
import { userModify, checkNickName } from "../../api/userAPI";

import Header from "../../components/Header";
import Breadcrumb from "../../components/BreadCrumb";
import ProfileSection from "../../components/ProfileSection";
import Footer from "../../components/Footer";

const SettingUser = () => {
  const navigate = useNavigate();
  const { userObject, setUserObject } = useAuth(); // AuthContext에서 전역 사용자 정보 가져오기

  const [message, setMessage] = useState("");
  const [pwMessage, setPwMessage] = useState("");
  const [formData, setFormData] = useState({
    id: userObject?.USER_ID || "", // userObject가 있을 때만 USER_ID 사용
    pw: "",
    pwok: "",
    nickName: userObject?.NICKNAME || "", // userObject가 있을 때만 NICKNAME 사용
  });

  const handleCheckNickName = async () => {
    try {
      if (!formData.nickName) {
        setMessage("닉네임을 입력해주세요");
        return;
      }
      const isNicknameTaken = await checkNickName(formData.nickName);
      setMessage(
        isNicknameTaken ? "이미 사용 중인 닉네임입니다." : "사용 가능한 닉네임입니다."
      );
    } catch {
      setMessage("닉네임 확인 중 오류가 발생했습니다.");
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  useEffect(() => {
    if (formData.pw && formData.pwok) {
      setPwMessage(
        formData.pw === formData.pwok ? "패스워드가 일치합니다." : "패스워드가 일치하지 않습니다."
      );
    } else {
      setPwMessage("");
    }
  }, [formData.pw, formData.pwok]);

  const handleUserModify = async () => {
    try {
      if (formData.pw !== formData.pwok) {
        setMessage("비밀번호가 일치하지 않습니다.");
        return;
      }

      const response = await userModify(formData);
      if (response.success) {
        // 수정된 정보를 전역 상태에 반영
        const updatedUserInfo = {
          ...userObject,
          USER_PW: formData.pw,
          NICKNAME: formData.nickName,
        };
        setUserObject(updatedUserInfo); // 전역 상태 업데이트

        // 메시지 설정 및 페이지 새로고침 제거
        setMessage("사용자 정보가 성공적으로 수정되었습니다.");
      } else {
        setMessage(response.message || "수정에 실패하였습니다.");
      }
    } catch (error) {
      setMessage("사용자 정보 수정 중 오류가 발생했습니다.");
    }
  };

  return (
    <div>
      <Header />
      <Breadcrumb />
      <ProfileSection />

      {/* Main Content */}
      <Container maxWidth="sm" sx={{ mt: 4 }}>
        {/* Pitch Adjustment */}
        <Typography variant="subtitle1" sx={{ mt: 3 }} align="center">
          회원정보수정
        </Typography>
        <Box sx={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", gap: 2, mt: 4 }}>
          <TextField label="아이디" variant="outlined" value={formData.id} disabled />
          <TextField label="비밀번호" variant="outlined" name="pw" onChange={handleChange} />
          <TextField label="비밀번호 확인" variant="outlined" name="pwok" onChange={handleChange} />

          {/* 비밀번호 일치 확인 */}
          {pwMessage && (
            <Typography sx={{ color: pwMessage.includes("일치합니다") ? "green" : "red", mt: 1, textAlign: "center" }}>
              {pwMessage}
            </Typography>
          )}

          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <TextField label="닉네임" variant="outlined" name="nickName" value={formData.nickName} onChange={handleChange} />
            <Button onClick={handleCheckNickName} variant="contained" size="small">중복확인</Button>
          </Box>
          <Typography sx={{ color: message.includes("가능") ? "green" : "red", mt: 1, textAlign: "center" }}>
            {message}
          </Typography>
        </Box>

        {/* Buttons */}
        <Box sx={{ display: "flex", justifyContent: "center", gap: 5, mt: 4 }}>
          <Button variant="contained" onClick={handleUserModify}>저장하기</Button>
          <Button variant="outlined" onClick={() => navigate("/setting")}>취소</Button>
        </Box>
      </Container>

      <Footer />
    </div>
  );
};

export default SettingUser;
