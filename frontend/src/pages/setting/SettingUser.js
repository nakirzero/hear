import React, { useState, useEffect } from "react";
import { Typography, Container, Box, Button, TextField } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { userModify, checkNickName } from "../../api/userAPI";

import Header from "../../components/Header";
import Breadcrumb from "../../components/BreadCrumb";
import ProfileSection from "../../components/ProfileSection";
import Footer from "../../components/Footer";

const SettingUser = () => {
  const navigate = useNavigate();
  const { userObject, setUserObject } = useAuth();

  const [message, setMessage] = useState("");
  const [pwMessage, setPwMessage] = useState("");
  const [formData, setFormData] = useState({
    id: userObject?.USER_ID || "",
    pw: "",
    pwok: "",
    nickName: userObject?.NICKNAME || "",
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
        const updatedUserInfo = {
          ...userObject,
          USER_PW: formData.pw,
          NICKNAME: formData.nickName,
        };
        setUserObject(updatedUserInfo);
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

      <Container maxWidth="xs" sx={{ mt: 4 }}>
        <Typography variant="h4" sx={{ mb: 3, fontWeight: "bold", textAlign: "center" }}>
          회원정보 수정
        </Typography>
        
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <TextField label="아이디" variant="outlined" value={formData.id} disabled />
          <TextField label="비밀번호" variant="outlined" type="password" name="pw" onChange={handleChange} />
          <TextField label="비밀번호 확인" variant="outlined" type="password" name="pwok" onChange={handleChange} />

          {pwMessage && (
            <Typography
              sx={{ color: pwMessage.includes("일치합니다") ? "green" : "red", mt: 1, textAlign: "center" }}
            >
              {pwMessage}
            </Typography>
          )}

          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <TextField label="닉네임" variant="outlined" name="nickName" value={formData.nickName} onChange={handleChange} fullWidth />
            <Button onClick={handleCheckNickName} variant="contained" size="small" sx={{ minWidth: 100 }}>
              중복확인
            </Button>
          </Box>

          {message && (
            <Typography sx={{ color: message.includes("가능") ? "green" : "red", mt: 1, textAlign: "center" }}>
              {message}
            </Typography>
          )}
        </Box>

        <Box sx={{ display: "flex", justifyContent: "center", gap: 2, mt: 4 }}>
          <Button variant="contained" onClick={handleUserModify} sx={{ minWidth: 120 }}>
            저장하기
          </Button>
          <Button variant="outlined" onClick={() => navigate("/setting")} sx={{ minWidth: 120 }}>
            취소
          </Button>
        </Box>
      </Container>

      <Footer />
    </div>
  );
};

export default SettingUser;
