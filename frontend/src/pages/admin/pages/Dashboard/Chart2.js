import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { Card, CardContent, CardHeader, Typography } from '@mui/material';

const data = [
  { name: 'January', value: 400 },
  { name: 'February', value: 300 },
  { name: 'March', value: 200 },
  { name: 'April', value: 278 },
  { name: 'May', value: 189 },
];

const Chart2 = () => {
  return (
    <Card sx={{ boxShadow: 3, borderRadius: 2, width: '100%', height: '100%' }}>
      <CardHeader
        title={<Typography variant="h6">일별 회원가입 건수</Typography>}
        subheader={<Typography variant="body2">일별로 회원가입 회원의 건수를 시각적으로 나타냅니다.</Typography>}
      />
      <CardContent sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
        <BarChart
          width={250}
          height={250}
          data={data}
          margin={{
            top: 20, right: 30, left: 20, bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="value" fill="#8884d8" />
        </BarChart>
      </CardContent>
    </Card>
  );
};

export default Chart2;
