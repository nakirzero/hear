import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Main from './Main';
import Join from './Join';

function App() {
  return(
    <Router>
    <Routes>
      <Route path="/" element={<Main />} />
      <Route path="/join" element={<Join />} />
    </Routes>
  </Router>
  );
}

export default App;