import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Main from './pages/Main';
import Join from './pages/Join';
import Login from './pages/Login';
import Menu from './pages/menu';

function App() {
  return(
    <Router>
    <Routes>
      <Route path="/" element={<Main />} />
      <Route path="/join" element={<Join />} />
      <Route path="/login" element={<Login />} />
      <Route path="/menu" element={<Menu />} />
    </Routes>
  </Router>
  );
}

export default App;