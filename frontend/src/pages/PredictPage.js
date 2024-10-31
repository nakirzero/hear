import React, { useState } from "react";
import {
  Typography,
  Box,
  Button,
  LinearProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper
} from "@mui/material";
import axios from "axios";
import Header from "../components/Header"; // 기존 Header 컴포넌트
import Breadcrumb from "../components/BreadCrumb";
import Footer from "../components/Footer"; // 기존 Footer 컴포넌트
import useLoading from "../hooks/useLoading"; // useLoading 훅 import

const PredictPage = () => {
  const [file, setFile] = useState(null); // 파일 상태
  const [progress, setProgress] = useState(0); // 진행 상태
  const [results, setResults] = useState(null); // 예측 결과 상태
  const [error, setError] = useState(null); // 에러 상태

  // useLoading 훅 호출
  const { isLoading, setIsLoading, LoadingIndicator } = useLoading("AI 예측을 진행 중입니다...");

  // 파일 선택 핸들러
  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
    setProgress(0);
    setResults(null);
    setError(null);
  };

// 예측 결과 가져오기
const fetchResults = async () => {
  try {
    const response = await axios.get("/api/get_results");
    setResults(response.data);
  } catch (error) {
    setError("결과를 가져오는 중 오류가 발생했습니다.");
    console.error("Error fetching results:", error);
  }
};


  // 파일 업로드 및 예측 실행 함수
  const handleUploadAndPredict = async () => {
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      setIsLoading(true); // 로딩 시작
      await axios.post("/api/upload_csv", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      const eventSource = new EventSource("/api/predict_status");
      eventSource.onmessage = (event) => {
        const progressValue = parseFloat(event.data);
        setProgress(progressValue);

        if (progressValue >= 100) {
          eventSource.close();
          fetchResults(); // 예측 결과 가져오기
          setIsLoading(false); // 로딩 종료
          setProgress(100); // 백에서 완료하면 완료로 설정
        }
      };
    } catch (error) {
      setError("파일 업로드 중 오류가 발생했습니다.");
      console.error("Error uploading file:", error);
      setIsLoading(false); // 에러 시 로딩 종료
    }
  };


  // json추가 함수
  const handleAddBookFromJson = async () => {
    try {
      const response = await fetch("api/add-book-from-json", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      const result = await response.json();
      
      if (response.ok) {
        console.log(result.message);
      } else {
        console.error(result.error);
      }
    } catch (error) {
      console.error("Error adding book from JSON:", error);
    }
  };

  return (
    <Box minHeight="100vh" display="flex" flexDirection="column" alignItems="center">
      <Header /> {/* Header 컴포넌트 */}
      <Breadcrumb />

      <Typography variant="h6">CSV 파일 업로드 및 AI 예측</Typography>

      {/* 파일 선택 및 업로드 */}
      <input
        type="file"
        accept=".csv"
        onChange={handleFileChange}
        style={{ display: "none" }}
        id="file-upload"
      />
      <label htmlFor="file-upload">
        <Button variant="contained" color="primary" component="span" sx={{ marginTop: 2 }}>
          파일 선택
        </Button>
      </label>

      {file && (
        <Typography variant="body1" mt={2}>
          선택된 파일: {file.name}
        </Typography>
      )}

      <Button
        variant="contained"
        color="secondary"
        onClick={handleUploadAndPredict}
        disabled={!file}
        sx={{ marginTop: 2 }}
      >
        예측 실행
      </Button>

      {/* 새로 추가된 버튼 */}
      <Button
        variant="contained"
        color="primary"
        sx={{ marginTop: 2 }}
        onClick={handleAddBookFromJson}
      >
        json에서 데이터 적재
      </Button>

      {/* 진행 상태 표시 */}
      {progress > 0 && (
        <Box mt={2} width="80%">
          <Typography variant="body1">진행률: {progress.toFixed(2)}%</Typography>
          <LinearProgress variant="determinate" value={progress} />
        </Box>
      )}

      {/* 로딩 인디케이터 */}
      {isLoading && <LoadingIndicator />}

      {/* 오류 메시지 */}
      {error && (
        <Typography color="error" variant="body1" mt={2}>
          오류: {error}
        </Typography>
      )}

      {/* 예측 결과 표 */}
      {results && (
        <TableContainer component={Paper} sx={{ marginTop: 4, maxWidth: 800 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>문장</TableCell>
                <TableCell>예측된 카테고리</TableCell>
                <TableCell>신뢰도</TableCell>
                <TableCell>진행률</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {results.map((result, index) => (
                <TableRow key={index}>
                  <TableCell>{result.JSON_DETAIL.slice(0, 100)}...</TableCell>
                  <TableCell>{result.JSON_DIVISION}</TableCell>
                  <TableCell>{result.confidence ? `${result.confidence.toFixed(2)}%` : "N/A"}</TableCell>
                  <TableCell><LinearProgress variant="determinate" value={progress} /></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <Footer /> {/* Footer 컴포넌트 */}
    </Box>
  );
};

export default PredictPage;
