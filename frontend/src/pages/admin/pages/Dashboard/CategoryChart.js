import React, { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';
import { Card, CardContent, CardHeader, Typography } from '@mui/material';
import { fetchCategoryCounts } from '../../api/predictAPI'; // API 호출 함수 임포트
import { useNavigate } from 'react-router-dom'; // useNavigate 훅 임포트

const COLORS = ['#FF6384', '#36A2EB', '#FFCE56', '#4CAF50', '#9C27B0', '#FF9800'];

const CategoryChart = () => {
  const [data, setData] = useState([]);
  const navigate = useNavigate(); // useNavigate 훅 사용

  useEffect(() => {
    const getCategoryCounts = async () => {
      try {
        const result = await fetchCategoryCounts();
        setData(result);
      } catch (error) {
        console.error("Error fetching category data:", error);
      }
    };

    getCategoryCounts();
  }, []);

  // Pie 클릭 핸들러
  const handleClick = () => {
    navigate('/admin/predict'); // 클릭 시 /admin/predict 경로로 이동
  };

  return (
    <Card
      sx={{ boxShadow: 3, borderRadius: 2, width: '100%', height: '100%', padding: 2, cursor: 'pointer' }} // cursor 스타일 추가
      onClick={handleClick}
    >
      <CardHeader
        title={<Typography variant="h6" sx={{ marginBottom: 1 }}>공유마당 분류 현황</Typography>}
        subheader={<Typography variant="body2" sx={{ marginBottom: 1 }}>공유마당 데이터 주제 분류를 시각적으로 보여줍니다.</Typography>}
      />
      <CardContent sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', paddingTop: 0 }}>
        <PieChart width={320} height={320} >
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            outerRadius={110}
            fill="#8884d8"
            dataKey="value"
            labelLine
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </CardContent>
    </Card>
  );
};

export default CategoryChart;
