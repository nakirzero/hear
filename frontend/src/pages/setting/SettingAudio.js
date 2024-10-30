import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import useSnackbar from "../../hooks/useSnackbar";
import useLoading from "../../hooks/useLoading";
import { Typography, Container, Box, Button, Radio, RadioGroup, FormControlLabel, Select, MenuItem, CardContent, Dialog, DialogActions, DialogContent, DialogContentText } from "@mui/material";

import Header from "../../components/Header";
import Breadcrumb from "../../components/BreadCrumb";
import ProfileSection from "../../components/ProfileSection";
import { fetchVoiceList, saveUserSettings, deleteVoice } from "../../api/voiceAPI";

const SettingAudio = () => {
  const navigate = useNavigate();
  const { userObject } = useAuth();
  const { openSnackbar, SnackbarComponent } = useSnackbar();
  const { isLoading, setIsLoading, LoadingIndicator } = useLoading("삭제 중...");

  const [voiceList, setVoiceList] = useState([]);
  const [selectedVoice, setSelectedVoice] = useState("");
  const [speed, setSpeed] = useState(1.0);
  const [audioElement, setAudioElement] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const defaultVoice = ["XOjX7HuCs6jtaR1NqWIW", "CmvK4l3jURa7bBhVQAgX"];

  useEffect(() => {
    if (!userObject) return;

    const getVoices = async () => {
      try {
        const voices = await fetchVoiceList(userObject.USER_SEQ);
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
    if (audioElement) {
      audioElement.pause();
      audioElement.currentTime = 0;
    }
    const newAudio = new Audio(audioUrl);
    newAudio.playbackRate = speed;
    newAudio.play();
    setAudioElement(newAudio);
  };

  const handleStopPreview = () => {
    if (audioElement) {
      audioElement.pause();
      audioElement.currentTime = 0;
    }
  };

  const handleSaveSettings = async () => {
    try {
      if (!userObject) return;

      await saveUserSettings({
        user_seq: userObject.USER_SEQ,
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
    setDialogOpen(true); // 다이얼로그 열기
  };

  const confirmDeleteVoice = async () => {
    setIsLoading(true);
    try {
      await deleteVoice(selectedVoice);

      const updatedVoiceList = voiceList.filter(
        (voice) => voice.EL_ID !== selectedVoice
      );

      setVoiceList(updatedVoiceList);
      setSelectedVoice(updatedVoiceList.length > 0 ? updatedVoiceList[0].EL_ID : "");

      openSnackbar("목소리가 성공적으로 삭제되었습니다.", "success");
    } catch (error) {
      console.error("Error deleting voice:", error);
      openSnackbar("목소리 삭제에 실패했습니다.", "error");
    } finally {
      setIsLoading(false);
      setDialogOpen(false); // 다이얼로그 닫기
    }
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
  };

  return (
    <div>
      <Header />
      <Breadcrumb />
      <ProfileSection />

      <Container maxWidth="sm" sx={{ mt: 4 }}>
          <CardContent>
            <Typography variant="h6" align="center">
              오디오북 설정
            </Typography>
            <Typography align="center">듣기 편한 소리로 조절해보세요.</Typography>

            <Box sx={{ mt: 3 }}>
              <Select
                value={selectedVoice}
                onChange={(e) => setSelectedVoice(e.target.value)}
                fullWidth
              >
                {voiceList.map((voice) => (
                  <MenuItem key={voice.EL_ID} value={voice.EL_ID} disabled={voice.EL_ID === defaultVoice}>
                    {voice.VL_NAME}
                  </MenuItem>
                ))}
              </Select>
              <Button onClick={handleDeleteVoice} variant="outlined" color="error" fullWidth sx={{ mt: 2 }}>
                삭제
              </Button>
            </Box>

            <Typography variant="subtitle1" sx={{ mt: 3 }} align="center">
              목소리 배속 조절
            </Typography>
            <RadioGroup
              row
              value={speed}
              onChange={(e) => setSpeed(parseFloat(e.target.value))}
              sx={{ justifyContent: "center" }} // 가운데 정렬
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
                  <Button variant="outlined" onClick={handlePreview}>미리듣기</Button>
                  <Button variant="outlined" color="error" onClick={handleStopPreview}>미리듣기 중지</Button>
                  <Button variant="outlined" onClick={() => navigate("/setting")}>취소</Button>
                </>
              )}
            </Box>
          </CardContent>

        {/* 삭제 확인 다이얼로그 */}
        <Dialog open={dialogOpen} onClose={handleCloseDialog}>
          <DialogContent>
            <DialogContentText>정말로 선택한 목소리를 삭제하시겠습니까?</DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={confirmDeleteVoice} color="primary">네</Button>
            <Button onClick={handleCloseDialog} color="secondary">아니오</Button>
          </DialogActions>
        </Dialog>

        <SnackbarComponent anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }} />
      </Container>
    </div>
  );
};

export default SettingAudio;
