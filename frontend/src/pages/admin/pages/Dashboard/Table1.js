import React from 'react';
import { Card, CardContent, CardHeader, Typography, Button } from '@mui/material';

const Table1 = () => {
  return (
    <Card sx={{ boxShadow: 3, borderRadius: 2, width: '100%', height: '100%' }}>
      <CardHeader
        title={<Typography variant="h6">최근 알림</Typography>}
        action={
          <Button variant="outlined" size="small">
            더보기
          </Button>
        }
      />
      <CardContent>
        <Typography variant="body2">- 알림 1: 시스템 점검 예정</Typography>
        <Typography variant="body2">- 알림 2: 새로운 기능 추가</Typography>
        <Typography variant="body2">- 알림 3: 업데이트 안내</Typography>
      </CardContent>
    </Card>
  );
};

export default Table1;
