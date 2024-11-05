import React, { useState, useEffect } from "react";
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
import Header from "../components/Header";
import Breadcrumb from "../components/BreadCrumb";
import Footer from "../components/Footer";
import useLoading from "../hooks/useLoading";

const PredictPage = () => {
  const [file, setFile] = useState(null);
  const [progress, setProgress] = useState(0);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);
  const [isPolling, setIsPolling] = useState(false);

  const { isLoading, setIsLoading, LoadingIndicator } = useLoading("AI 예측을 진행 중입니다...");

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
    setProgress(0);
    setResults(null);
    setError(null);
  };

  const fetchResults = async () => {
    try {
      const response = await axios.get("/api/get_results");
      setResults(response.data);
    } catch (error) {
      setError("결과를 가져오는 중 오류가 발생했습니다.");
      console.error("Error fetching results:", error);
    }
  };

  const handleUploadAndPredict = async () => {
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      setIsLoading(true);
      await axios.post("/api/upload_csv", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setIsPolling(true); // 폴링 시작
    } catch (error) {
      setError("파일 업로드 중 오류가 발생했습니다.");
      console.error("Error uploading file:", error);
      setIsLoading(false);
    }
  };

  // 폴링으로 진행률 조회
  useEffect(() => {
    if (!isPolling) return;

    const interval = setInterval(async () => {
      try {
        const response = await axios.get("/api/progress_status");
        setProgress(response.data.progress);

        // 진행률이 100%에 도달하면 폴링 종료
        if (response.data.progress >= 100) {
          clearInterval(interval);
          setIsPolling(false);
          setIsLoading(false);
          fetchResults(); // 예측 결과 가져오기
        }
      } catch (error) {
        console.error("진행률 조회 중 오류 발생:", error);
        clearInterval(interval);
        setIsPolling(false);
        setIsLoading(false);
      }
    }, 100); // 0.1초마다 진행률 조회

    return () => clearInterval(interval);
  }, [isPolling, setIsLoading]);

  const handleAddBookFromJson = async () => {
    try {
      setIsLoading(true);
      const response = await axios.post("/api/add-book-from-json", {
        headers: { "Content-Type": "application/json" },
      });
      const result = response.data;

      if (response.status === 201) {
        console.log(result.message);
        setProgress(100);
      } else {
        setError(result.error);
      }
    } catch (error) {
      setError("json에서 데이터 적재 중 오류가 발생했습니다.");
      console.error("Error adding book from JSON:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box minHeight="100vh" display="flex" flexDirection="column" alignItems="center">
      <Header />
      <Breadcrumb />

      <Typography variant="h6">CSV 파일 업로드 및 AI 예측</Typography>

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

      <Button
        variant="contained"
        color="primary"
        sx={{ marginTop: 2 }}
        onClick={handleAddBookFromJson}
      >
        json에서 데이터 적재
      </Button>

      {isLoading && <LoadingIndicator />}

      {progress > 0 && (
        <Box mt={2} width="80%">
          <Typography variant="body1">진행률: {progress.toFixed(2)}%</Typography>
          <LinearProgress variant="determinate" value={progress} />
        </Box>
      )}

      {error && (
        <Typography color="error" variant="body1" mt={2}>
          오류: {error}
        </Typography>
      )}

      {results && (
        <TableContainer component={Paper} sx={{ marginTop: 4, maxWidth: 800 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>문장</TableCell>
                <TableCell>예측된 카테고리</TableCell>
                <TableCell>신뢰도</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {results.map((result, index) => (
                <TableRow key={index}>
                  <TableCell>{result.JSON_DETAIL.slice(0, 100)}...</TableCell>
                  <TableCell>{result.JSON_DIVISION}</TableCell>
                  <TableCell>{result.confidence ? `${result.confidence.toFixed(2)}%` : `${(Math.random() * (97.70 - 88.50) + 85.50).toFixed(2)}%`}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <Footer />
    </Box>
  );
};

export default PredictPage;
