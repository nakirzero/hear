import React from 'react';
import { Box, Typography } from '@mui/material';

const Footer = () => {
  return (
    <Box py={2} textAlign="right">
      <Typography variant="body2">
        주소: 61740 광주광역시 남구 양림로 60 광주여고 25 6층실
      </Typography>
      <Typography variant="body2">
        TEL: 062-123-4567 / FAX: 062-987-6543
      </Typography>
      <Typography variant="body2">
        © Copyright 2024 Hear. All rights reserved.
      </Typography>
    </Box>
  );
};

export default Footer;
