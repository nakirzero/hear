import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import { AuthProvider } from "./context/AuthContext"; // AuthProvider 임포트

import Main from "./pages/Main";
import Join from "./pages/Join";
import Login from "./pages/Login";
import Menu from "./pages/Menu";

import Setting from "./pages/setting/Setting";
import SettingAudio from "./pages/setting/SettingAudio";
import SettingUser from "./pages/setting/SettingUser";
import SettingVoice from "./pages/setting/SettingVoice";

import Board from "./pages/board/Board";
import Notice from "./pages/board/Notice";
import PredictPage from "./pages/PredictPage";

import MyStudy from "./pages/study/MyStudy";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Main />} />
          <Route path="/join" element={<Join />} />
          <Route path="/login" element={<Login />} />
          <Route path="/menu" element={<Menu />} />

          <Route path="/mystudy" element={<MyStudy />} />

          <Route path="/setting" element={<Setting />} />
          <Route path="/setting/audio" element={<SettingAudio />} />
          <Route path="/setting/user" element={<SettingUser />} />
          <Route path="/setting/voice" element={<SettingVoice />} />

          <Route path="/board" element={<Board />} />
          <Route path="/board/notice" element={<Notice />} />

          <Route path="/predict" element={<PredictPage />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
