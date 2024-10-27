import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext"; // AuthContext에서 useAuth 가져오기
import useSnackbar from "../../hooks/useSnackbar";
import useLoading from "../../hooks/useLoading";
import {Typography, Container, Box, Button, Radio, RadioGroup, FormControlLabel, Select, MenuItem } from "@mui/material";

import Header from "../../components/Header";
import Breadcrumb from "../../components/BreadCrumb";
import ProfileSection from "../../components/ProfileSection";
import { fetchVoiceList, saveUserSettings, deleteVoice } from "../../api/voiceAPI";

const SettingAudio = () => {
  const { userObject } = useAuth(); // 전역 사용자 정보 가져오기
  const { openSnackbar, SnackbarComponent } = useSnackbar();
  const { isLoading, setIsLoading, LoadingIndicator } = useLoading("삭제 중...");

  const [voiceList, setVoiceList] = useState([]);
  const [selectedVoice, setSelectedVoice] = useState("");
  const [speed, setSpeed] = useState(1.0); // 배속 조절 값
  const [audioElement, setAudioElement] = useState(null);

  const defaultVoice = ["XOjX7HuCs6jtaR1NqWIW", "CmvK4l3jURa7bBhVQAgX"]; // 남성(기본), 여성(기본)

  useEffect(() => {
    if (!userObject) return;

    const getVoices = async () => {
      try {
        const voices = await fetchVoiceList(userObject.USER_SEQ);
        console.log(voices);
        
        setVoiceList(voices);

        if (voices.length > 0) {
          setSelectedVoice(voices[0].EL_ID);
        }
      } catch (error) {
        console.error("Error fetching voice list:", error);
      }
    };
    getVoices();
  }, [userObject]);

  const handlePreview = () => {
    const audioUrl = `/static/audio/${selectedVoice}.mp3`;

    // 이전에 재생 중이던 오디오가 있으면 정지
    if (audioElement) {
      audioElement.pause();
      audioElement.currentTime = 0;
    }

    // 새로운 <audio> 요소 생성
    const newAudio = new Audio(audioUrl);
    newAudio.playbackRate = speed; // 배속 조절만 설정

    // 새 오디오 재생
    newAudio.play();

    // 새로운 오디오 요소를 상태에 저장
    setAudioElement(newAudio);
  };

  const handleStopPreview = () => {
    if (audioElement) {
      audioElement.pause();
      audioElement.currentTime = 0; // 재생 위치를 처음으로
    }
  };

  const handleSaveSettings = async () => {
    try {
      if (!userObject) return;

      await saveUserSettings({
        user_seq: userObject.USER_SEQ, // 전역 userObject에서 USER_SEQ 사용
        selectedVoice,
        speed,
      });

      openSnackbar("설정이 저장되었습니다.", "success");
    } catch (error) {
      console.error("Error saving settings:", error);
      openSnackbar("설정 저장에 실패했습니다.", "error");
    }
  };

  const handleDeleteVoice = async () => {
    if (defaultVoice.includes(selectedVoice)) {
      openSnackbar("기본 목소리는 삭제할 수 없습니다.", "warning");
      return;
    }

    setIsLoading(true);
    try {
      await deleteVoice(selectedVoice);

      const updatedVoiceList = voiceList.filter(
        (voice) => voice.EL_ID !== selectedVoice
      );

      setVoiceList(updatedVoiceList);

      if (updatedVoiceList.length > 0) {
        setSelectedVoice(updatedVoiceList[0].EL_ID);
      } else {
        setSelectedVoice("");
      }

      openSnackbar("목소리가 성공적으로 삭제되었습니다.", "success");
    } catch (error) {
      console.error("Error deleting voice:", error);
      openSnackbar("목소리 삭제에 실패했습니다.", "error");
    } finally {
      setIsLoading(false); // 삭제 완료 후 로딩 상태 비활성화
    }
  };

  return (
    <div>
      <Header />
      <Breadcrumb />
      <ProfileSection />

      <Container maxWidth="sm" sx={{ mt: 4 }}>
        <Typography variant="h6" align="center">
          오디오북 설정
        </Typography>
        <Typography align="center">듣기 편한 소리로 조절해보세요.</Typography>

        {/* Voice Setting */}
        <Typography variant="subtitle1" sx={{ mt: 3 }} align="center">
          목소리 설정
        </Typography>
        <Select
          value={selectedVoice}
          onChange={(e) => setSelectedVoice(e.target.value)}
          fullWidth
        >
          {voiceList.map((voice) => (
            <MenuItem key={voice.EL_ID} value={voice.EL_ID} disabled={voice.EL_ID === defaultVoice} >
              {voice.VL_NAME}
            </MenuItem>
          ))}
        </Select>

        {/* Speed Adjustment */}
        <Typography variant="subtitle1" sx={{ mt: 3 }} align="center">
          목소리 배속 조절
        </Typography>
        <RadioGroup
          row
          value={speed}
          onChange={(e) => setSpeed(parseFloat(e.target.value))}
        >
          <FormControlLabel value={0.75} control={<Radio />} label="x 0.75" />
          <FormControlLabel value={1.0} control={<Radio />} label="x 1.0" />
          <FormControlLabel value={1.25} control={<Radio />} label="x 1.25" />
          <FormControlLabel value={1.5} control={<Radio />} label="x 1.5" />
          <FormControlLabel value={2.0} control={<Radio />} label="x 2.0" />
        </RadioGroup>

        <Box sx={{ display: "flex", justifyContent: "center", gap: 2, mt: 4 }}>
          {isLoading ? (
            <LoadingIndicator />
          ) : (
            <>
            <Button variant="contained" onClick={handleSaveSettings}>저장하기</Button>
            <Button variant="outlined" onClick={handleDeleteVoice} color="error">
              삭제
            </Button>
            <Button variant="outlined" onClick={handlePreview}>
              미리듣기
            </Button>
            <Button variant="outlined" color="error" onClick={handleStopPreview}>
              미리듣기 중지
            </Button>
            </>
          )}
        </Box>
        <SnackbarComponent anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }} />
      </Container>
    </div>
  );
};

export default SettingAudio;
