import React from 'react';
import { Card, CardContent, CardHeader, Typography, Button } from '@mui/material';

const Table3 = () => {
  return (
    <Card sx={{ boxShadow: 3, borderRadius: 2, width: '100%', height: '100%' }}>
      <CardHeader
        title={<Typography variant="h6">독서량 순위</Typography>}
        action={
          <Button variant="outlined" size="small">
            더보기
          </Button>
        }
      />
      <CardContent>
        <Typography variant="body2">- 활동 1: 문서 작성 완료</Typography>
        <Typography variant="body2">- 활동 2: 코드 업데이트</Typography>
        <Typography variant="body2">- 활동 3: 미팅 기록 정리</Typography>
      </CardContent>
    </Card>
  );
};

export default Table3;
