import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, Typography, Button } from '@mui/material';
import { fetchRecentUploads } from '../../api/predictAPI'; // API 호출 함수 임포트
import { useNavigate } from 'react-router-dom'; // useNavigate 훅 임포트

const RecentUploadHistory = () => {
  const [uploads, setUploads] = useState([]);
  const navigate = useNavigate(); // useNavigate 훅 사용

  useEffect(() => {
    const getUploads = async () => {
      try {
        const result = await fetchRecentUploads();
        setUploads(result); // 백엔드에서 이미 3개로 제한된 데이터를 받음
      } catch (error) {
        console.error("Error fetching recent uploads:", error);
      }
    };

    getUploads();
  }, []);

  // 버튼 클릭 핸들러
  const handleButtonClick = () => {
    navigate('/admin/uploadhistory');
  };

  return (
    <Card sx={{ boxShadow: 3, borderRadius: 2, width: '100%', height: '100%' }}>
      <CardHeader
        title={<Typography variant="h6">공유 마당 최근 업로드 이력</Typography>}
        action={
          <Button variant="outlined" size="small" onClick={handleButtonClick}>
            더보기
          </Button>
        }
      />
      <CardContent>
        {uploads.length > 0 ? (
          uploads.map((upload, index) => (
            <Typography key={index} variant="body2">
              - {upload.PRO_NAME} ({new Date(upload.JSON_CrtDt).toLocaleDateString('ko-KR')}){' '}
              <Typography component="span" variant="caption">
                (건수: {upload.upload_count})
              </Typography>
            </Typography>
          ))
        ) : (
          <Typography variant="body2">업로드된 이력이 없습니다.</Typography>
        )}
      </CardContent>
    </Card>
  );
};

export default RecentUploadHistory;
