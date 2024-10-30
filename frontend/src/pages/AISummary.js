import React, { useEffect, useState, useRef } from "react";
import Breadcrumb from "../components/BreadCrumb";
import Header from "../components/Header";
import Footer from "../components/Footer";
import {
  Box,
  Button,
  Grid,
  Typography,
  IconButton,
  Slider,
} from "@mui/material";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import PauseIcon from "@mui/icons-material/Pause";
import VolumeUpIcon from "@mui/icons-material/VolumeUp";
import { useNavigate, useLocation } from "react-router-dom";
import { fetchLibrary, fetchLibrarySave } from "../api/libraryAPI";
import { useAuth } from "../context/AuthContext";


const AISummary = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [book, setBook] = useState([]);
  const [test, setTest] = useState("");
  const [isPlaying, setIsPlaying] = useState(true);
  const [volume, setVolume] = useState(0.5);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const { userObject } = useAuth();

  const audioRef = useRef(null);
  const histDiv = 2;

  const buttonStyle = {
    width: 300,
    height: 160,
    borderRadius: 10,
    fontSize: "1.5rem",
  };

  const handlePoem = () => {
    navigate("/library?category=200");
  };

  const handleNovel = () => {
    navigate("/library?category=100");
  };

  const handleEssay = () => {
    navigate("/library?category=300");
  };

  useEffect(() => {
    let intervalId;

    const handlePlayPause = () => {
      if (audioRef.current && !audioRef.current.paused) {
        intervalId = setInterval(() => {
          if (audioRef.current) {
            const saveUserProgress = async () => {
              const params = new URLSearchParams(location.search);
              const bookSeq = params.get("BOOK_SEQ");
              const userSeq = userObject?.USER_SEQ;
              const time = audioRef.current ? audioRef.current.currentTime : 0; // 유효성 검사 추가

              if (userSeq && bookSeq) {
                try {
                  const response = await fetchLibrarySave(
                    userSeq,
                    bookSeq,
                    histDiv,
                    time
                  );
                  if (response) {
                    console.log(response);
                  }
                } catch (error) {
                  console.error(
                    "사용자 책 데이터를 불러오는 중 오류가 발생했습니다.",
                    error
                  );
                }
              }
            };
            saveUserProgress();

            if (currentTime === duration) {
              setIsPlaying(false);
              return;
            }
          }
        }, 5000);
      } else {
        clearInterval(intervalId);
      }
    };

    if (audioRef.current) {
      audioRef.current.addEventListener("play", handlePlayPause);
      audioRef.current.addEventListener("pause", handlePlayPause);
    }

    return () => {
      clearInterval(intervalId);
      if (audioRef.current) {
        audioRef.current.removeEventListener("play", handlePlayPause);
        audioRef.current.removeEventListener("pause", handlePlayPause);
      }
    };
  }, [location.search, userObject?.USER_SEQ, currentTime, duration]);

  useEffect(() => {
    // 책 정보 불러오기
    const fetchBookData = async () => {
      const params = new URLSearchParams(location.search);
      const bookSeq = params.get("BOOK_SEQ");

      if (bookSeq) {
        try {
          const response = await fetchLibrary();
          const bookData = response.find((b) => b.BOOK_SEQ === Number(bookSeq));

          if (bookData) {
            setBook(bookData);
            setTest(bookData.test);
            
          } else {
            console.error("해당 책을 찾을 수 없습니다.");
          }
        } catch (error) {
          console.error("책 데이터를 불러오는 중 오류가 발생했습니다.", error);
        }
      }
    };
    fetchBookData();
  }, [location.search]);

  useEffect(() => {
    if (test && audioRef.current) {
      audioRef.current.src = test;
      console.log(test, "오디오 경로가 설정되었습니다.");

      const handleAudioLoaded = () => {
        audioRef.current.play().catch((error) => {
          console.error("오디오 자동 재생 실패:", error);
        });
      };

      const handleLoadedMetadata = () => {
        setDuration(audioRef.current.duration);
      };

      const handleTimeUpdate = () => {
        if (audioRef.current) {
          setCurrentTime(audioRef.current.currentTime);
        }
      };

      audioRef.current.addEventListener("loadedmetadata", handleLoadedMetadata);
      audioRef.current.addEventListener("timeupdate", handleTimeUpdate);
      audioRef.current.addEventListener("loadeddata", handleAudioLoaded);

      return () => {
        if (audioRef.current) {
          audioRef.current.removeEventListener(
            "loadedmetadata",
            handleLoadedMetadata
          );
          audioRef.current.removeEventListener("timeupdate", handleTimeUpdate);
          audioRef.current.removeEventListener("loadeddata", handleAudioLoaded);
        }
      };
    }
  }, [test]);

  window.addEventListener("beforeunload", () => {
    // 경고 메시지를 표시하도록 설정
  });

  const handleTime = () => {
    const time = audioRef.current.currentTime;
    const percentage = Math.floor((time / duration) * 100);
    console.log(`전체 내용의 ${percentage}퍼센트를 들으셨습니다.`);
  };

  const handleVolumeChange = (newValue) => {
    setVolume(newValue);
    audioRef.current.volume = newValue;
  };

  const handleSliderChange = (newValue) => {
    if (audioRef.current) {
      audioRef.current.currentTime = newValue;
      setCurrentTime(newValue);
    }
  };

  const togglePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        audioRef.current.play();
        setIsPlaying(true);
      }
    }
  };

  const buttonStyles = {
    padding: "16px",
    fontSize: 20,
    borderWidth: 2,
    height: "200px",
  };

  function formatTime(seconds) {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);

    return `${hrs.toString().padStart(2, "0")}:${mins
      .toString()
      .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };


 

  return (
    <div>
      <Header />
      <Breadcrumb />
      {/* 시, 소설, 수필 */}
      <Box
        bgcolor="#FFD700"
        py={4}
        display="flex"
        flexDirection="column"
        alignItems="center"
      >
        <Box sx={{ display: "flex", gap: 4 }}>
          <Button
            variant="contained"
            sx={buttonStyle}
            onClick={handlePoem}
            aria-label="카테고리 시로 이동"
          >
            1. 시
          </Button>
          <Button
            variant="contained"
            sx={buttonStyle}
            onClick={handleNovel}
            aria-label="카테고리 소설로 이동"
          >
            2. 소설
          </Button>
          <Button
            variant="contained"
            sx={buttonStyle}
            onClick={handleEssay}
            aria-label="카테고리 수필로 이동"
          >
            3. 수필
          </Button>
          <Button
            variant="contained"
            sx={buttonStyle}
            aria-label="카테고리 혜리언니로 이동"
          >
            4. 혜리언니
          </Button>
        </Box>
      </Box>

      <Box sx={{ margin: "0 auto", width: "70%", padding: 2 }}>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          요약재생
        </Typography>
        {/* Upper Section */}
        <Box sx={{ display: "flex", alignItems: "center", marginBottom: 4 }}>
          <Box
            sx={{
              width: 100,
              height: 100,
              bgcolor: "grey.300",
              marginRight: 2,
            }}
          >
            {/* Placeholder for the image */}
          </Box>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            {book.BOOK_NAME}
          </Typography>
          <Box sx={{ width: "100%" }}>
            <audio
              ref={audioRef}
              controls
              style={{ width: "100%", display: "none" }}
            />
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 2,
                marginY: 2,
              }}
            >
              <IconButton onClick={togglePlayPause} color="primary">
                {isPlaying ? <PauseIcon /> : <PlayArrowIcon />}
              </IconButton>
              <Slider
                value={currentTime}
                min={0}
                max={duration}
                step={1}
                onChange={handleSliderChange}
                sx={{ flexGrow: 1 }}
              />
              <Typography variant="h6">
                {formatTime(currentTime)} / {formatTime(duration)}
                {""}
              </Typography>
            </Box>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 1,
              }}
            >
              <VolumeUpIcon />
              <Slider
                value={volume}
                min={0}
                max={1}
                step={0.01}
                onChange={handleVolumeChange}
                sx={{ width: 100 }}
              />
            </Box>
          </Box>
        </Box>

        {/* Lower Section */}
        <Grid container spacing={1} sx={{ justifyContent: "space-between" }}>
          <Grid item xs={2.4} sx={{ padding: 1 }}>
            <Button
              fullWidth
              variant="outlined"
              sx={buttonStyles}
              onClick={togglePlayPause}
            >
              일시정지 <br /> [ SPACE ]
            </Button>
          </Grid>
          <Grid item xs={2.4} sx={{ padding: 1 }}>
            <Button
              fullWidth
              variant="outlined"
              sx={buttonStyles}
              onClick={() => {
                audioRef.current.currentTime = Math.max(
                  0,
                  audioRef.current.currentTime - 5
                );
                setCurrentTime(audioRef.current.currentTime);
              }}
            >
              5초 뒤로 <br /> [ 방향키 왼쪽]
            </Button>
          </Grid>
          <Grid item xs={2.4} sx={{ padding: 1 }}>
            <Button
              fullWidth
              variant="outlined"
              sx={buttonStyles}
              onClick={() => {
                audioRef.current.currentTime = Math.max(
                  0,
                  audioRef.current.currentTime + 5
                );
                setCurrentTime(audioRef.current.currentTime);
              }}
            >
              5초 앞으로 <br /> [ 방향키 오른쪽 ]
            </Button>
          </Grid>
          <Grid item xs={2.4} sx={{ padding: 1 }}>
            <Button fullWidth variant="outlined" sx={buttonStyles}>
              하이라이트 <br /> [ ALT + H]
            </Button>
          </Grid>
          <Grid item xs={2.4} sx={{ padding: 1 }}>
            <Button
              fullWidth
              variant="outlined"
              sx={buttonStyles}
              onClick={handleTime}
            >
              현재 재생시간 <br /> [ 즐거운 코딩 ]
            </Button>
          </Grid>
        </Grid>
      </Box>

      <Footer />
    </div>
  );
};

export default AISummary;
