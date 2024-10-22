import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Main from '../src/pages/Main';
import Join from '../src/pages/Join';
import Login from './pages/Login';

function App() {
  return(
    <Router>
    <Routes>
      <Route path="/" element={<Main />} />
      <Route path="/join" element={<Join />} />
      <Route path="/login" element={<Login />} />
    </Routes>
  </Router>
  );
}

export default App;