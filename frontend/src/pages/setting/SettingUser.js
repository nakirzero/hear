import React, { useState, useEffect } from "react";
import { Typography, Container, Box, Button, TextField, Grid } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { userModify, checkNickName } from "../../api/userAPI";

import Header from "../../components/Header";
import Breadcrumb from "../../components/BreadCrumb";
import ProfileSection from "../../components/ProfileSection";
import Footer from "../../components/Footer";

const SettingUser = () => {
  const navigate = useNavigate();
  
  const data = sessionStorage.getItem('userInfo');
  const userinfo =JSON.parse(data);
  const userInfo = userinfo.userInfo;
  const user_id = userInfo.USER_ID;
  const [ message, setMessage ] = useState("");
  const [ pwMessage, setPwMessage ] = useState("");
  const [formData, setFormData] = useState({
    id: userInfo.USER_ID,
    pw: "",
    pwok: "",
    nickName: userInfo.NICKNAME,
    speed : userInfo.speed
  });



  const handleCheckNickName = async () => {
    try {
      if (!formData.nickName ) {
        setMessage("닉네임을 입력해주세요");
        return;
      }
      const nickNameConfirm = await checkNickName(formData.nickName);
      setMessage(
        nickNameConfirm ? "이미 사용 중인 닉네임입니다." : "사용 가능한 닉네임입니다."
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
    if (!formData.pw && !formData.pwok) {
      setPwMessage("");
      return;
    }
    if (!formData.pw || !formData.pwok) {
      setPwMessage("비밀번호와 비밀번호 확인을 모두 입력해주세요.");
      return;
    }
    if (formData.pw === formData.pwok) {
      setPwMessage("패스워드가 일치합니다.");
    } else {
      setPwMessage("패스워드가 일치하지 않습니다.");
    }
  }, [formData.pw, formData.pwok]); // pw나 pwok가 변경될 때마다 실행


  const handleUserModify = async () => {
    try {
      if (formData.pw !== formData.pwok ) {
        setMessage("비밀번호가 일치하지 않습니다..");
        return;
      } else if (!formData.pw || !formData.pwok){
        setMessage("비밀번호와 비밀번호 확인을 입력해주세요..")
        return;
      } 
      const response = await userModify(formData);
      if (response.success) {
        // 수정된 정보를 userInfo에 반영
        const updatedUserInfo = {
          ...userInfo,
          USER_PW: formData.pw, // 비밀번호가 변경되었으므로 반영
          NICKNAME: formData.nickName, // 닉네임 변경 반영
          speed: formData.speed // speed 변경 반영
        };
  
        // sessionStorage에 업데이트된 userInfo 저장
        if (!localStorage.getItem){
        sessionStorage.setItem("userInfo", JSON.stringify({ userInfo: updatedUserInfo }));}
        else {
          sessionStorage.setItem("userInfo", JSON.stringify({ userInfo: updatedUserInfo }));
          localStorage.setItem("userInfo", JSON.stringify({ userInfo: updatedUserInfo }));
        }
        setMessage("사용자 정보가 성공적으로 수정되었습니다.");
        window.location.reload()
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
        <Box sx={{ display: "flex", justifyContent: "center", gap: 2, mt: 4 }}>
          <TextField id="outlined-basic" label="아이디" variant="outlined" name="user_id" value={user_id} disabled/>
          <TextField id="outlined-basic" label="비밀번호" variant="outlined" name="pw" onChange={handleChange}/>
          <TextField id="outlined-basic" label="비밀번호 확인" variant="outlined" name="pwok"  onChange={handleChange}/>
           {/* 비밀번호 일치 확인 */}
           {pwMessage && (
              <Grid item xs={12}>
                <Typography
                  sx={{
                    color: pwMessage.includes("일치합니다") ? "green" : "red",
                    mt: 1,
                    textAlign: "center",
                  }}
                >
                  {pwMessage}
                </Typography>
              </Grid>
            )}

          <TextField id="outlined-basic" label="닉네임" variant="outlined" name="nickName" value={formData.nickName} onChange={handleChange} />
          <Button
                onClick={handleCheckNickName}
                variant="contained"
                size="small"
              >
                중복확인
              </Button>
          <Typography
              sx={{
                color: ["이미", "않습니다"].some((word) => message.includes(word))? "red" : "green" ,
                mt: 1,
                textAlign: "center",
              }}
            >
              {message}
          </Typography>
        </Box>

        {/* Buttons */}
        <Box sx={{ display: "flex", justifyContent: "center", gap: 5, mt: 4 }}>
          <Button variant="contained" onClick={handleUserModify}>저장하기</Button>
          <Button variant="outlined" onClick={() => navigate("/setting")}>취소</Button>
        </Box>
      </Container>

      <Box
        onClick={() => navigate("/menu")}
        sx={{
          backgroundColor: "#e0e0e0",
          py: 3,
          mt: 1,
          textAlign: "center",
        }}
      >
        <Typography>홈으로</Typography>
      </Box>
      <Footer />
    </div>
  );
};

export default SettingUser;
