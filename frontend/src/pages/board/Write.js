import React, { useState } from 'react';
import { Box, Button, TextField, Typography, Paper } from '@mui/material';
import { useAuth } from '../../context/AuthContext'; // AuthContext 경로에 맞게 수정
import { writeSubmit } from '../../api/boardAPI'; // writeSubmit 함수가 정의된 파일 경로
import { useNavigate } from 'react-router-dom';

const Write = () => {
  const navigate = useNavigate();
  const { userObject } = useAuth(); // AuthContext에서 사용자 정보 가져오기
  const [title, setTitle] = useState('');          // 제목 상태
  const [detail, setDetail] = useState('');        // 내용 상태

  const handlewriteSubmit = async (event) => {
    event.preventDefault();

    const postData = {
      userseq: userObject?.USER_SEQ,
      nickname: userObject?.NICKNAME,
      title,
      detail,
    };

    try {
      // writeSubmit 함수를 호출하여 서버에 데이터 전송
      console.log('postData', postData);
      
      const message = await writeSubmit(postData);
      console.log("서버 응답:", message);

      // 작성 후 입력 필드 초기화
      setTitle('');
      setDetail('');
      navigate('/board/suggest');
    } catch (error) {
      console.error("게시글 작성 실패:", error);
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <Paper elevation={3} sx={{ width: 600, p: 4 }}>
        <Typography variant="h4" gutterBottom>
          건의사항 작성
        </Typography>

        {/* 사용자 정보 표시 */}
        <Typography variant="subtitle1" gutterBottom>
          작성자: {userObject?.NICKNAME}
        </Typography>

        <form onSubmit={handlewriteSubmit}>
          {/* 제목 입력 */}
          <TextField
            label="제목"
            variant="outlined"
            fullWidth
            required
            margin="normal"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          {/* 내용 입력 */}
          <TextField
            label="내용"
            variant="outlined"
            fullWidth
            required
            multiline
            rows={8}
            margin="normal"
            value={detail}
            onChange={(e) => setDetail(e.target.value)}
          />

          {/* 작성 완료 버튼 */}
          <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 3 }}>
            작성 완료
          </Button>
        </form>
      </Paper>
    </Box>
  );
};

export default Write;
