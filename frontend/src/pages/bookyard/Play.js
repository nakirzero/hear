import React, { useEffect, useState, useRef, useMemo } from "react";
import Breadcrumb from "../../components/BreadCrumb";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import {
  Box,
  Button,
  Grid,
  Typography,
  IconButton,
  Slider,
  Alert
} from "@mui/material";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import PauseIcon from "@mui/icons-material/Pause";
import VolumeUpIcon from "@mui/icons-material/VolumeUp";
import { useNavigate, useLocation } from "react-router-dom";
import { fetchLibrary, fetchLibrarySave, highlight } from "../../api/libraryAPI";
import { useAuth } from "../../context/AuthContext";
import useMenuShortcut from "../../hooks/useMenuShortcut";
import usePlayShortcut from "../../hooks/usePlayShortcut";

const Play = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [book, setBook] = useState([]);
  const [test, setTest] = useState("");
  const [isPlaying, setIsPlaying] = useState(true);
  const [volume, setVolume] = useState(0.5);
  const [clickCount, setClickCount] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const { userObject } = useAuth();
  const [startPoint, setStartPoint] = useState();
  const [alertMessage,setAlertMessage]=useState();
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

  const menuItems = useMemo(() => [
    {  label: "1 시", path: "/library?category=200" },
    {  label: "2 소설", path: "/library?category=100" },
    {  label: "3 수필", path: "/library?category=300" },
    {  label: "4 공유세상", path: "/board" }
  ], []);

  // 단축키 설정, 각 숫자에 대응하는 메뉴의 인덱스에 따라 이동
  useMenuShortcut({
    '1': () => navigate(menuItems[0].path),
    '2': () => navigate(menuItems[1].path),
    '3': () => navigate(menuItems[2].path),
    '4': () => navigate(menuItems[3].path)
  });



  usePlayShortcut({
  'ArrowLeft':()=> ArrowLeft(),
  'ArrowRight':()=> ArrowRight(),
  'ArrowUp':()=> handleClick(),
  'ArrowDown':()=> handleTime(),
  ' ':()=>togglePlayPause()
  })

  const ArrowLeft = ()=>{
    audioRef.current.currentTime = Math.max(
        0,
        audioRef.current.currentTime - 5
      );
      setCurrentTime(audioRef.current.currentTime)
}

  const ArrowRight = () => {
    audioRef.current.currentTime = Math.max(
      0,
      audioRef.current.currentTime + 5
    );
    setCurrentTime(audioRef.current.currentTime)
  }



  useEffect(() => {
    let intervalId;
    const audioElement = audioRef.current; // audioRef.current를 내부 변수에 저장
    let isAudioPlaying = false; // 재생 상태 확인 변수

    const handlePlayPause = () => {
      if (audioElement) {
        if (audioElement.currentTime !== audioElement.duration) {
          if (!isAudioPlaying) {
            // 오디오 재생 중일 때만 저장을 진행
            intervalId = setInterval(async () => {
              console.log(
                audioElement.currentTime,
                "현재시간 : duration",
                audioElement.duration
              );

              const params = new URLSearchParams(location.search);
              const bookSeq = params.get("BOOK_SEQ");
              const userSeq = userObject?.USER_SEQ;
              const time = audioElement ? audioElement.currentTime : 0;

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
            }, 5000);
            isAudioPlaying = true; // 재생 중 상태로 설정
          }
        } 
      }
    };

    if (audioElement) {
      audioElement.addEventListener("playing", handlePlayPause);
      audioElement.addEventListener("pause", () => {
        clearInterval(intervalId);
        isAudioPlaying = false; // 일시정지 시 상태 변경
      });
    }

    return () => {
      if (audioElement) {
        audioElement.removeEventListener("playing", handlePlayPause);
        audioElement.removeEventListener("pause", handlePlayPause);
      }
      clearInterval(intervalId); // 클린업 시 interval 정리
    };
  }, [location.search, userObject?.USER_SEQ]);

  useEffect(() => {
    // 책 정보 불러오기
    const fetchBookData = async () => {
      const params = new URLSearchParams(location.search);
      const bookSeq = params.get("BOOK_SEQ");
      const elId = userObject?.EL_ID; // userObject에서 EL_ID를 가져옴
      const isSummary = false; // 요약 요청 여부 설정 (true로 설정 시 요약 요청)

      if (bookSeq) {
        try {
          const response = await fetchLibrary(bookSeq, elId, isSummary);
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
  }, [location.search, userObject?.EL_ID]);

  useEffect(() => {
    const audioElement = audioRef.current;

    if (test && audioElement) {
      audioElement.src = test;
      console.log(test, "오디오 경로가 설정되었습니다.");

      const handleAudioLoaded = () => {
        audioElement.play().catch((error) => {
          console.error("오디오 자동 재생 실패:", error);
        });
      };

      const handleLoadedMetadata = () => {
        if (audioElement) {
          setDuration(audioElement.duration || 0);
        }
      };

      const handleTimeUpdate = () => {
        if (audioElement) {
          setCurrentTime(audioElement.currentTime);
        }
      };

      audioElement.addEventListener("loadedmetadata", handleLoadedMetadata);
      audioElement.addEventListener("timeupdate", handleTimeUpdate);
      audioElement.addEventListener("loadeddata", handleAudioLoaded);

      return () => {
        if (audioElement) {
          audioElement.removeEventListener(
            "loadedmetadata",
            handleLoadedMetadata
          );
          audioElement.removeEventListener("timeupdate", handleTimeUpdate);
          audioElement.removeEventListener("loadeddata", handleAudioLoaded);
        }
      };
    }
  }, [test]);

  useEffect(() => {
    const audio = audioRef.current;
  
    const handleTimeUpdate = () => {
      if (audio.currentTime === audio.duration) {
        // 오디오가 끝난 경우
        setCurrentTime(formatTime(0));
        setIsPlaying(false);
        console.log("멈춤");
      }
    };
  
    // 'timeupdate' 이벤트 리스너 추가
    audio.addEventListener('timeupdate', handleTimeUpdate);
  
    // 컴포넌트 언마운트 시 이벤트 리스너 제거
    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
    };
  }, [currentTime]);
  

  const handleTime = () => {
    if (audioRef.current) {
      const time = audioRef.current.currentTime;
      const percentage = Math.floor((time / duration) * 100);
      console.log(`전체 내용의 ${percentage}퍼센트를 들으셨습니다.`);
    }
  };

  const handleVolumeChange = (newValue) => {
    if (audioRef.current) {
      setVolume(newValue);
      audioRef.current.volume = newValue;
    }
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

    if (isNaN(seconds) || seconds < 0) {
      return "00:00:00";
    }
    
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);

    return `${hrs.toString().padStart(2, "0")}:${mins
      .toString()
      .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  }

  const handleClick = async () => {


    if (clickCount) {
      setStartPoint(currentTime); // 홀수일 경우 startPoint 설정
      setClickCount(false);
      console.log(clickCount,"시작");
      
    } else {
      setClickCount(true);
      console.log(clickCount,"끝");
      
      const bookSeq = book.BOOK_SEQ;
      const userSeq = userObject.USER_SEQ;
 

      try {
        const response = await highlight(
          startPoint,
          currentTime,
          userSeq,
          bookSeq,
          test
        );
        setAlertMessage("하이라이트 저장을 완료하였습니다.");
        setTimeout(() => {
          setAlertMessage(null);
        }, 1000);
        console.log(response);
      } catch (error) {
        console.error("입력 중 오류가 발생했습니다.", error);
      }
    }
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
              일시정지 <br /> [ SPACE + . ]
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
              5초 뒤로 <br /> [ 방향키 왼쪽 + . ]
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
              5초 앞으로 <br /> [ 방향키 오른쪽 + . ]
            </Button>
          </Grid>
          <Grid item xs={2.4} sx={{ padding: 1 }}>
            <Button
              fullWidth
              variant="outlined"
              sx={buttonStyles}
              onClick={handleClick}
            >
              하이라이트 <br /> [ 방향키 위쪽  + . ]
            </Button>
          </Grid>
          <Grid item xs={2.4} sx={{ padding: 1 }}>
            <Button
              fullWidth
              variant="outlined"
              sx={buttonStyles}
              onClick={handleTime}
            >
              현재 재생시간 <br /> [ 방향키 아래쪽 + . ]
            </Button>
          </Grid>
        </Grid>
      </Box>
            <Box sx={{ margin: "0 auto", width: "30%", padding: 2 }}>
          {alertMessage && (
           <Alert variant="filled" severity="success" sx={{ mb: 4 }}>
            {alertMessage}
          </Alert>
           )} 
          </Box>
      <Footer />
    </div>
  );
};

export default Play;
