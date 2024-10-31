import React, { useEffect, useState } from 'react';
import { Box, Typography, Button } from '@mui/material';
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
import TimelineDot from '@mui/lab/TimelineDot';

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}.${String(date.getDate()).padStart(2, '0')}`;
};

const History = () => {
  const navigate = useNavigate();
  const { userObject } = useAuth();
  const [history, setHistory] = useState([]);
  const [displayedItems, setDisplayedItems] = useState(5); // 처음에 보여줄 항목 수
  const itemsPerPage = 5; // 한 번에 더 보여줄 항목 수
  useEffect(() => {
    const getHistory = async () => {
      try {
        const fetchedHistory = await fetchHistory(userObject?.USER_SEQ || null);  // userObject.USER_SEQ를 안전하게 전달
        console.log("Fetched History555:", fetchedHistory);  // 디버깅용 콘솔 출력

        if (userObject?.USER_SEQ) {  // userObject.USER_SEQ가 존재하는지 확인
          const userHistory = fetchedHistory.filter(item => item.USER_SEQ === userObject.USER_SEQ);
          const sortedHistory = userHistory.sort((a, b) => new Date(b.HIST_VwDt) - new Date(a.HIST_VwDt));
          setHistory(sortedHistory);
        }
      } catch (error) {
        console.error("Failed to fetch history666:", error);
      }
    };
    if (userObject?.USER_SEQ) {  // userObject.USER_SEQ가 존재할 때만 호출
      getHistory();
    }
  }, [userObject]);

 // 더보기 버튼 클릭 시 표시되는 항목 수를 증가
 const handleLoadMore = () => {
  setDisplayedItems((prevItems) => prevItems + itemsPerPage);
};

const handleShowLess = () => {
  setDisplayedItems(itemsPerPage); // 기본 항목 수로 초기화
};

  const handleNavigate = (bookSeq) => {
    navigate(`/book/${bookSeq}`);
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
        
        <Timeline position="alternate">
        {history.slice(0, displayedItems).map((row, index) => (  // 표시할 항목 제한
            <TimelineItem key={index}>
              <TimelineSeparator>
                <TimelineDot variant="outlined" />
                {index !== displayedItems - 1 && <TimelineConnector />}
              </TimelineSeparator>
              <TimelineContent>
                <Typography variant="subtitle1">{row.BOOK_NAME}</Typography>
                <Typography variant="body2" color="textSecondary">{row.AUTHOR}</Typography>
                <Typography variant="body2">{`${row.HIST_EdPt} / ${row.RUN_TIME}`}</Typography>
                <Typography variant="body2" color="textSecondary">{formatDate(row.HIST_VwDt)}</Typography>
                <Button 
                  onClick={() => handleNavigate(row.BOOK_SEQ)}  // BOOK_SEQ로 경로 지정
                  variant="outlined" 
                  sx={{ mt: 1 }}
                >
                  이동하기
                </Button>
              </TimelineContent>
            </TimelineItem>
          ))}
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
      </Box>

      <Footer />
    </div>
  );
};

export default History;
