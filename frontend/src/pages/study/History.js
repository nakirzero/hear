import React, { useEffect, useState } from 'react';
import { Box, Button, Typography, CircularProgress } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from "../../context/AuthContext";
import Header from '../../components/Header';
import Breadcrumb from '../../components/BreadCrumb';
import ProfileSection from '../../components/ProfileSection';
import Footer from '../../components/Footer';
import { fetchHistory } from '../../api/studyAPI';

import Timeline from '@mui/lab/Timeline';
import TimelineItem from '@mui/lab/TimelineItem';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineContent from '@mui/lab/TimelineContent';

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}.${String(date.getDate()).padStart(2, '0')}`;
};

// 시간 문자열 ("HH:MM:SS")을 초 단위로 변환하는 함수
const timeToSeconds = (timeString) => {
  const [hours, minutes, seconds] = timeString.split(':').map(Number);
  return (hours * 3600) + (minutes * 60) + seconds;
};

const History = () => {
  const navigate = useNavigate();
  const { userObject } = useAuth();
  const [history, setHistory] = useState([]);
  const [displayedItems, setDisplayedItems] = useState(5); // 처음에 보여줄 항목 수
  const itemsPerPage = 5; // 한 번에 더 보여줄 항목 수
  const defaultImage = 'frontend/src/assets/defult-image.jpg'; // 기본 이미지 경로

  useEffect(() => {
    const getHistory = async () => {
      try {
        const fetchedHistory = await fetchHistory(userObject?.USER_SEQ || null);
        if (userObject?.USER_SEQ) {
          const userHistory = fetchedHistory.filter(item => item.USER_SEQ === userObject.USER_SEQ);
          const sortedHistory = userHistory.sort((a, b) => new Date(b.HIST_VwDt) - new Date(a.HIST_VwDt));
          setHistory(sortedHistory);
        }
      } catch (error) {
        console.error("Failed to fetch history:", error);
      }
    };
    if (userObject?.USER_SEQ) {
      getHistory();
    }
  }, [userObject]);

  const handleLoadMore = () => {
    setDisplayedItems((prevItems) => prevItems + itemsPerPage);
  };

  const handleShowLess = () => {
    setDisplayedItems(itemsPerPage); // 기본 항목 수로 초기화
  };

  const handleNavigate = (bookSeq) => {
    navigate(`/book/${bookSeq}`);
  };

  const handleLibrary = () => {
    navigate('/library'); // 데이터를 추가하는 페이지로 이동
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header />
      <Breadcrumb />
      <ProfileSection />

      <Box sx={{ flexGrow: 1, p: 3 }}>
        <Typography variant="h6" gutterBottom>
          History Timeline
        </Typography>
         
        {history.length > 0 ? (
          <>
            <Timeline position="alternate">
              {history.slice(0, displayedItems).map((row, index) => {
                // 진행률 계산 (RUN_TIME이 0이 아니고, 두 값이 유효한 시간 형식일 경우만 계산)
                let progressValue = 0;
                if (row.HIST_EdPt && row.RUN_TIME) {
                  const elapsedSeconds = timeToSeconds(row.HIST_EdPt);
                  const totalSeconds = timeToSeconds(row.RUN_TIME);
                  progressValue = totalSeconds > 0 ? Math.min((elapsedSeconds / totalSeconds) * 100, 100) : 0;
                }

                return (
                  <TimelineItem key={index}>
                    <TimelineSeparator>
                      <Box 
                        onClick={() => handleNavigate(row.BOOK_SEQ)}
                        sx={{ position: 'relative', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                      >
                        <CircularProgress variant="determinate" value={progressValue} size={40} />
                        <Box
                          sx={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            bottom: 0,
                            right: 0,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          <Typography variant="caption" component="div" color="text.secondary">
                            {`${Math.round(progressValue)}%`}
                          </Typography>
                        </Box>
                      </Box>
                      {index !== displayedItems - 1 && <TimelineConnector />}
                    </TimelineSeparator>
                    <TimelineContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', p: 2, gap: 2 }}>
                      <Box
                        component="img"
                        src={row.IMAGE_URL || defaultImage} // 이미지가 없으면 기본 이미지 사용
                        alt={row.BOOK_NAME}
                        sx={{
                          width: 60,
                          height: 60,
                          objectFit: 'cover',
                          borderRadius: 1,
                          cursor: 'pointer',
                          mb: 1,
                        }}
                        onClick={() => handleNavigate(row.BOOK_SEQ)}
                      />
                      <Typography 
                        variant="subtitle1" 
                        onClick={() => handleNavigate(row.BOOK_SEQ)}
                        sx={{ cursor: 'pointer', textAlign: 'center' }}
                      >
                        {row.BOOK_NAME}
                      </Typography>
                      <Typography variant="body2" color="textSecondary" sx={{ textAlign: 'center' }}>{row.AUTHOR}</Typography>
                      <Typography variant="body2" color="textSecondary" sx={{ textAlign: 'center' }}>{`${row.HIST_EdPt} / ${row.RUN_TIME}`}</Typography>
                      <Typography variant="body2" color="textSecondary" sx={{ textAlign: 'center' }}>{formatDate(row.HIST_VwDt)}</Typography>
                    </TimelineContent>
                  </TimelineItem>
                );
              })}
            </Timeline>

            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
              {displayedItems < history.length ? (
                <Button onClick={handleLoadMore} variant="contained" sx={{ mr: 1 }}>
                  더보기
                </Button>
              ) : (
                <Button onClick={handleShowLess} variant="contained" sx={{ mr: 1 }}>
                  줄이기
                </Button>
              )}
            </Box>
          </>
        ) : (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
            <Typography variant="body1" color="textSecondary" sx={{ mb: 2 }}>
              아직 책을 읽은 적이 없습니다. 새로운 책을 만나러 가보시겠어요?
            </Typography>
            <Button onClick={handleLibrary} variant="contained" color="primary">
              도서마당으로 이동
            </Button>
          </Box>
        )}
      </Box>
      <Footer />
    </div>
  );
};

export default History;
