import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import theme from "./theme";

import { AuthProvider } from "./context/AuthContext";
import RequireAdmin from "./context/RequireAdmin";

import Main from "./pages/Main";
import Join from "./pages/Join";
import Menu from "./pages/Menu";

import Library from "./pages/bookyard/Library";
import Book from "./pages/bookyard/Book";
import AISummary from "./pages/bookyard/AISummary";
import Play from "./pages/bookyard/Play";

import MyStudy from "./pages/study/MyStudy";
import MyBookReport from "./pages/study/MyBookReport";
import MyWishBook from "./pages/study/MyWishBook";
import WriteReport from "./pages/study/WriteReport";
import BookReportDetail from "./pages/study/BookReportDetail";
import History from "./pages/study/History";
import Highlight from "./pages/study/Highlight";

import Setting from "./pages/setting/Setting";
import SettingAudio from "./pages/setting/SettingAudio";
import SettingUser from "./pages/setting/SettingUser";
import SettingVoice from "./pages/setting/SettingVoice";

import Board from "./pages/board/Board";
import Notice from "./pages/board/Notice";
import Suggest from "./pages/board/Suggest";
import SuggestDetail from "./pages/board/SuggestDetail";
import Write from "./pages/board/Write";
import Wishbook from "./pages/board/Wishbook";

// 관리자 페이지 컴포넌트 추가
import AdminDashboard from "./pages/admin/Dashboard";
import PredictPage from "./pages/admin/pages/PredictPage";
import BookApprovalPage from "./pages/admin/pages/BookApprovalPage";

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Main />} />
            <Route path="/join" element={<Join />} />
            <Route path="/menu" element={<Menu />} />

            <Route path="/library" element={<Library />} />
            <Route path="/library/book" element={<Book />} />
            <Route path="/library/book/aisummary" element={<AISummary />} />
            <Route path="/library/book/play" element={<Play />} />

            <Route path="/mystudy" element={<MyStudy />} />
            <Route path="/mystudy/mywishbook" element={<MyWishBook />} />
            <Route path="/mystudy/mybookreport" element={<MyBookReport />} />
            <Route path="/mystudy/writereport" element={<WriteReport />} />
            <Route path="/mystudy/mybookreport/:reportId" element={<BookReportDetail />} />
            <Route path="/mystudy/history" element={<History />} />
            <Route path="/mystudy/highlight" element={<Highlight />} />

            <Route path="/setting" element={<Setting />} />
            <Route path="/setting/audio" element={<SettingAudio />} />
            <Route path="/setting/user" element={<SettingUser />} />
            <Route path="/setting/voice" element={<SettingVoice />} />

            <Route path="/board" element={<Board />} />
            <Route path="/board/notice" element={<Notice />} />
            <Route path="/board/suggest" element={<Suggest />} />
            <Route path="/board/suggest/suggestDetail" element={<SuggestDetail />} />
            <Route path="/board/suggest/suggestWrite" element={<Write />} />
            <Route path="/board/wishbook" element={<Wishbook />} />

            {/* 관리자 전용 라우트 설정 */}
            <Route element={<RequireAdmin />}>
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/admin/predict" element={<PredictPage />} />
              <Route path="/admin/approval" element={<BookApprovalPage />} />
            </Route>
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
