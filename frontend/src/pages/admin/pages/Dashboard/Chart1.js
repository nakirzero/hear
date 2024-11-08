import React from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';
import { Card, CardContent, CardHeader, Typography } from '@mui/material';

const data = [
  { name: 'Red', value: 300 },
  { name: 'Blue', value: 50 },
  { name: 'Yellow', value: 100 },
  { name: 'Green', value: 150 },
  { name: 'Purple', value: 80 },
  { name: 'Orange', value: 120 },
];

const COLORS = ['#FF6384', '#36A2EB', '#FFCE56', '#4CAF50', '#9C27B0', '#FF9800'];

const Chart1 = () => {
  return (
    <Card sx={{ boxShadow: 3, borderRadius: 2, width: '100%', height: '100%' }}>
      <CardHeader
        title={<Typography variant="h6">공유마당 분류 현황</Typography>}
        subheader={<Typography variant="body2">공유마당 데이터 주제 분류를 시각적으로 보여줍니다.</Typography>}
      />
      <CardContent sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
        <PieChart width={350} height={350}>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            outerRadius={120}
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

export default Chart1;
