import React, { useState, useEffect } from "react";
import {
  Typography,
  Container,
  Box,
  Button,
  Radio,
  RadioGroup,
  FormControlLabel,
  Select,
  MenuItem,
} from "@mui/material";

import Header from "../../components/Header";
import Breadcrumb from "../../components/BreadCrumb";
import ProfileSection from "../../components/ProfileSection";
import { fetchVoiceList } from "../../api/voiceAPI";

const SettingAudio = () => {
  const [voiceList, setVoiceList] = useState([]);
  const [selectedVoice, setSelectedVoice] = useState("");
  const [speed, setSpeed] = useState(1.0); // 배속 조절 값

  const [audioElement, setAudioElement] = useState(null);

  useEffect(() => {
    const getVoices = async () => {
      try {
        const voices = await fetchVoiceList();
        setVoiceList(voices);

        if (voices.length > 0) {
          setSelectedVoice(voices[0].id);
        }
      } catch (error) {
        console.error("Error fetching voice list:", error);
      }
    };
    getVoices();
  }, []);

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
            <MenuItem key={voice.id} value={voice.id}>
              {voice.name}
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

        {/* Buttons */}
        <Box sx={{ display: "flex", justifyContent: "center", gap: 2, mt: 4 }}>
          <Button variant="contained">저장하기</Button>
          <Button variant="outlined" onClick={handlePreview}>
            미리듣기
          </Button>
          <Button variant="outlined" color="error" onClick={handleStopPreview}>
            미리듣기 중지
          </Button>
        </Box>
      </Container>
    </div>
  );
};

export default SettingAudio;
