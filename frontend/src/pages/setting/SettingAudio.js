import React from 'react';
import { Typography, Container, Box, Button, Radio, RadioGroup, FormControlLabel, Select, MenuItem} from '@mui/material';
import { useNavigate } from 'react-router-dom';

import Header from '../../components/Header';
import Breadcrumb from '../../components/BreadCrumb';
import ProfileSection from '../../components/ProfileSection';
import Footer from '../../components/Footer';

const SettingAudio = () => {
  const navigate = useNavigate();

  return (
    <div>
      <Header />
      <Breadcrumb />
      <ProfileSection />

      {/* Main Content */}
      <Container maxWidth="sm" sx={{ mt: 4 }}>

        {/* AudioBook Settings */}
        <Typography variant="h6" align="center">
          오디오북 설정
        </Typography>
        <Typography align="center">듣기 편한 소리로 조절해보세요.</Typography>

        {/* Voice Setting */}
        <Typography variant="subtitle1" sx={{ mt: 3 }} align="center">
          목소리 설정
        </Typography>
        <Select defaultValue="default" fullWidth>
          <MenuItem value="default">기본 목소리(여성)</MenuItem>
          <MenuItem value="default">기본 목소리(남성)</MenuItem>
        </Select>

        {/* Pitch Adjustment */}
        <Typography variant="subtitle1" sx={{ mt: 3 }} align="center">
          목소리 피치 조절
        </Typography>
        <RadioGroup row defaultValue="0" >
          <FormControlLabel value="-2" control={<Radio />} label="-2" />
          <FormControlLabel value="-1" control={<Radio />} label="-1" />
          <FormControlLabel value="0" control={<Radio />} label="0" />
          <FormControlLabel value="1" control={<Radio />} label="1" />
          <FormControlLabel value="2" control={<Radio />} label="2" />
        </RadioGroup>

        {/* Speed Adjustment */}
        <Typography variant="subtitle1" sx={{ mt: 3 }} align="center">
          목소리 배속 조절
        </Typography>
        <RadioGroup row defaultValue="1.0" >
          <FormControlLabel value="0.75" control={<Radio />} label="x 0.75" />
          <FormControlLabel value="1.0" control={<Radio />} label="x 1.0" />
          <FormControlLabel value="1.25" control={<Radio />} label="x 1.25" />
          <FormControlLabel value="1.5" control={<Radio />} label="x 1.5" />
          <FormControlLabel value="2.0" control={<Radio />} label="x 2.0" />
        </RadioGroup>

        {/* Buttons */}
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 4 }}>
          <Button variant="contained">저장하기</Button>
          <Button variant="outlined">미리듣기</Button>
        </Box>
      </Container>

      <Box onClick={() => navigate('/menu')}
      sx={{
          backgroundColor: '#e0e0e0',
          py: 3,
          mt: 1,
          textAlign: 'center',
        }}
        >
        <Typography>홈으로</Typography>
        </Box>

     <Footer />
    </div>
  );
};

export default SettingAudio;