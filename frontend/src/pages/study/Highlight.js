import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { Accordion, AccordionSummary, AccordionDetails, Box, Card, CardContent, IconButton, Typography, Button } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { PlayArrow as PlayArrowIcon, Pause as PauseIcon } from "@mui/icons-material";
import Header from "../../components/Header";
import Breadcrumb from "../../components/BreadCrumb";
import ProfileSection from "../../components/ProfileSection";
import { fetchHighlight, fetchHighlightAudio } from "../../api/studyAPI";
import { useNavigate } from "react-router-dom";

const Highlight = () => {
  const { userObject } = useAuth();
  const [groupedHighlights, setGroupedHighlights] = useState({});
  const [audioStates, setAudioStates] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    if (userObject && userObject.USER_SEQ) {
      const userSeq = userObject.USER_SEQ;
      fetchHighlight(userSeq).then((data) => {
        const grouped = data.reduce((acc, highlight) => {
          const bookName = highlight.BOOK_NAME || "Unknown Title";
          if (!acc[bookName]) acc[bookName] = { cover: highlight.HL_IMGPATH, author: highlight.AUTHOR, highlights: [] };
          acc[bookName].highlights.push(highlight);
          return acc;
        }, {});

        setGroupedHighlights(grouped);
      });
    }
  }, [userObject]);

  const handlePlayPause = async (highlightId) => {
    try {
      const audioUrl = await fetchHighlightAudio(highlightId);

      if (!audioStates[highlightId]?.audioRef) {
        const audioRef = new Audio(audioUrl);

        setAudioStates((prevState) => ({
          ...prevState,
          [highlightId]: {
            audioRef,
            isPlaying: true,
          },
        }));

        audioRef.play();

        audioRef.onended = () => {
          setAudioStates((prevState) => ({
            ...prevState,
            [highlightId]: {
              ...prevState[highlightId],
              isPlaying: false,
            },
          }));
        };
      } else {
        const currentAudioState = audioStates[highlightId];
        if (currentAudioState.isPlaying) {
          currentAudioState.audioRef.pause();
        } else {
          currentAudioState.audioRef.play();
        }

        setAudioStates((prevState) => ({
          ...prevState,
          [highlightId]: {
            ...currentAudioState,
            isPlaying: !currentAudioState.isPlaying,
          },
        }));
      }
    } catch (error) {
      console.error("Failed to play audio:", error);
    }
  };

  const handleLibrary = () => {
    navigate("/library");
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <Header />
      <Breadcrumb />
      <ProfileSection />

      {Object.keys(groupedHighlights).length > 0 ? (
        <Box
          sx={{
            p: 2,
            maxWidth: 1000,
            margin: "0 auto",
            display: "flex",
            flexWrap: "wrap",
            gap: 2,
          }}
        >
          {Object.keys(groupedHighlights).map((bookName, index, arr) => {
            const { cover, author, highlights } = groupedHighlights[bookName];
            const isSingleItem = arr.length === 1;
            return (
              <Box key={bookName} sx={{ width: isSingleItem ? "100%" : "calc(50% - 8px)" }}>
                <Accordion>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls={`${bookName}-content`} id={`${bookName}-header`}>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <Box sx={{ mr: 2 }}>
                        <img
                          src={`/static/bookcover/${cover}`}
                          alt={bookName}
                          style={{ width: 50, height: 50, objectFit: "cover" }}
                        />
                      </Box>
                      <Box>
                        <Typography variant="h6">{bookName}</Typography>
                        <Typography variant="subtitle2" color="text.secondary">{author || "Unknown Author"}</Typography>
                      </Box>
                    </Box>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Box sx={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 2 }}>
                      {highlights.map((highlight) => (
                        <Card key={highlight.HL_SEQ} sx={{ display: "flex", maxWidth: 500 }}>
                          <Box sx={{ display: "flex", flexDirection: "column", flex: "1 0 auto" }}>
                            <CardContent>
                              <Typography component="div" variant="body1">
                                {highlight.HL_COMMENT || "No Comment"}
                              </Typography>
                              <Typography variant="body2" color="text.secondary" component="div">
                                {highlight.HL_Duration || "Duration not available"}
                              </Typography>
                            </CardContent>
                            <Box sx={{ display: "flex", alignItems: "center", pl: 1, pb: 1 }}>
                              <IconButton aria-label="play/pause" onClick={() => handlePlayPause(highlight.HL_SEQ)}>
                                {audioStates[highlight.HL_SEQ]?.isPlaying ? <PauseIcon sx={{ height: 38, width: 38 }} /> : <PlayArrowIcon sx={{ height: 38, width: 38 }} />}
                              </IconButton>
                            </Box>
                          </Box>
                        </Card>
                      ))}
                    </Box>
                  </AccordionDetails>
                </Accordion>
              </Box>
            );
          })}
        </Box>
      ) : (
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 4 }}>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
            아직 남겨 놓은 하이라이트가 없습니다. 하이라이트를 남기러 가보시겠어요?
          </Typography>
          <Button onClick={handleLibrary} variant="contained" color="primary">
            도서마당으로 이동
          </Button>
        </Box>
      )}
    </div>
  );
};

export default Highlight;
