import React from 'react';
import { Card, CardContent, CardHeader, Typography, Button } from '@mui/material';

const Table2 = () => {
  return (
    <Card sx={{ boxShadow: 3, borderRadius: 2, width: '100%', height: '100%' }}>
      <CardHeader
        title={<Typography variant="h6">인기 게시물</Typography>}
        action={
          <Button variant="outlined" size="small">
            더보기
          </Button>
        }
      />
      <CardContent>
        <Typography variant="body2">- 게시물 1: 프로젝트 시작 가이드</Typography>
        <Typography variant="body2">- 게시물 2: 팀 협업 팁</Typography>
        <Typography variant="body2">- 게시물 3: 코드 리뷰 모범 사례</Typography>
      </CardContent>
    </Card>
  );
};

export default Table2;
