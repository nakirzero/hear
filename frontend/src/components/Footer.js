import React from 'react';
import { Box, Typography } from '@mui/material';

const Footer = () => {
  return (
    <Box py={2} textAlign="right">
      <Typography variant="body2">
        주소: 61740 광주 남구 송암로 60 광주CGI센터 2층
      </Typography>
      <Typography variant="body2">
        TEL: 062-655-3506 / FAX: 062-987-6543
      </Typography>
      <Typography variant="body2">
        © Copyright 2024 Hear. All rights reserved.
      </Typography>
    </Box>
  );
};

export default Footer;
