import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { Card, CardContent, CardHeader, Typography } from '@mui/material';
import { fetchDailySignUpCounts } from '../../api/UserAPI'; // API 호출 함수 임포트

const DailySignUpChart = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const getSignUpData = async () => {
      try {
        const result = await fetchDailySignUpCounts();
        setData(result.map(entry => ({
          name: new Date(entry.date).toLocaleDateString('ko-KR'), // 날짜 형식 변환
          value: entry.value // 회원가입 건수
        })));
      } catch (error) {
        console.error("Error fetching daily sign-up data:", error);
      }
    };

    getSignUpData();
  }, []);

  return (
    <Card sx={{ boxShadow: 3, borderRadius: 2, width: '100%', height: '100%' }}>
      <CardHeader
        title={<Typography variant="h6">일별 회원가입 건수</Typography>}
        subheader={<Typography variant="body2">일별로 회원가입 회원의 건수를 시각적으로 나타냅니다.</Typography>}
      />
      <CardContent sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
        <BarChart
          width={550}  // 공유마당 차트의 너비와 높이에 맞게 조정
          height={250} // 공유마당 차트의 높이와 동일하게 설정
          data={data}
          margin={{
            top: 20, right: 30, left: 20, bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis tickFormatter={(value) => value.toFixed(0)} // 소수점 제거
                 allowDecimals={false} // 소수 허용 안 함
          />
          <Tooltip />
          <Legend />
          <Bar dataKey="value" fill="#8884d8" name="가입자수" /> {/* 여기에 name 속성 추가 */}
        </BarChart>
      </CardContent>
    </Card>
  );
};

export default DailySignUpChart;
