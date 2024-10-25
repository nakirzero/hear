import React, { useState } from "react";
import {
  Typography,
  Box,
  Grid,
  IconButton,
  TextField,
  Button,
} from "@mui/material";
import SettingsIcon from "@mui/icons-material/Settings";

import Header from "../components/Header"; // 기존 Header 컴포넌트
import Breadcrumb from "../components/BreadCrumb";
import Footer from "../components/Footer"; // 기존 Footer 컴포넌트

const PredictPage = () => {
  const [inputText, setInputText] = useState(""); // 입력 텍스트 상태
  const [results, setResults] = useState(null); // 예측 결과 상태
  const [error, setError] = useState(null); // 에러 상태
  const [loading, setLoading] = useState(false); // 로딩 상태
  const [jsonIndex, setJsonIndex] = useState(0); // JSON 데이터를 순차적으로 불러오기 위한 인덱스

  // AI 예측 요청 함수
  const handlePredict = async () => {
    setLoading(true); // 로딩 시작
    setError(null); // 에러 초기화
    setResults(null); // 기존 결과 초기화

    try {
      const response = await fetch("/api/predict", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ sentence: inputText }), // 입력 텍스트 전송
      });

      if (!response.ok) {
        throw new Error("예측 요청에 실패했습니다.");
      }

      const data = await response.json();
      setResults(data); // 결과 상태 업데이트
    } catch (error) {
      setError(error.message); // 에러 상태 업데이트
    } finally {
      setLoading(false); // 로딩 종료
    }
  };

  // JSON_DETAIL 불러오는 함수
  const fetchNextJsonDetail = async () => {
    try {
      const response = await fetch(`/api/get_json_detail/${jsonIndex}`); // JSON_DETAIL을 순차적으로 불러오기
      if (!response.ok) {
        throw new Error("JSON_DETAIL을 불러오는 중 오류가 발생했습니다.");
      }

      const data = await response.json();
      setInputText(data.json_detail); // 불러온 JSON_DETAIL을 입력 필드에 설정
      setJsonIndex(jsonIndex + 1); // 인덱스 증가
    } catch (error) {
      setError("JSON_DETAIL을 불러오는 중 오류가 발생했습니다.");
    }
  };

  return (
    <Box minHeight="100vh" display="flex" flexDirection="column">
      <Header /> {/* Header 컴포넌트 */}
      <Breadcrumb />
      {/* Main Content */}
      <Box
        flexGrow={1}
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <Grid container spacing={4} justifyContent="center" alignItems="center">
          <Grid item xs={12} sm={6} md={4}>
            <Box textAlign="center">
              <IconButton sx={{ fontSize: 100 }} color="primary">
                <SettingsIcon fontSize="inherit" />
              </IconButton>

              <Typography variant="h6">AI 카테고리 예측</Typography>

              {/* 입력 필드 */}
              <TextField
                label="텍스트 입력"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                variant="outlined"
                fullWidth
                margin="normal"
              />

              <Button
                variant="contained"
                color="primary"
                onClick={handlePredict}
                disabled={loading}
                sx={{ marginTop: 2 , mr : 2}}
              >
                {loading ? "예측 중..." : "예측 실행"}
              </Button>

              {/* JSON_DETAIL 불러오기 버튼 */}
              <Button
                variant="contained"
                color="secondary"
                onClick={fetchNextJsonDetail}
                sx={{ marginTop: 2 }}
              >
                다음 JSON_DETAIL 불러오기
              </Button>

              {/* 오류 메시지 */}
              {error && (
                <Typography color="error" variant="body1" mt={2}>
                  오류: {error}
                </Typography>
              )}

              {/* 예측 결과 */}
              {results && (
                <Box mt={4}>
                  <Typography variant="h6">예측 결과</Typography>
                  <Typography>
                    <strong>입력 텍스트:</strong> {results.sentence}
                  </Typography>
                  <Typography>
                    <strong>예측된 카테고리:</strong>{" "}
                    {results.predicted_category}
                  </Typography>
                  <Typography>
                    <strong>신뢰도:</strong> {results.confidence}
                  </Typography>
                </Box>
              )}
            </Box>
          </Grid>
        </Grid>
      </Box>
      <Footer />
    </Box>
  );
};

export default PredictPage;
