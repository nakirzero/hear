import React, { useState, useEffect } from 'react';

function App() {
  const [message, setMessage] = useState('');
  const [dbVersion, setDbVersion] = useState('');

  useEffect(() => {
    // 기본 hello API 호출
    fetch('/api/hello')
      .then(response => response.json())
      .then(data => setMessage(data.message))
      .catch(error => console.error('Error fetching /api/hello:', error));

    // DB 버전 확인 API 호출
    fetch('/api/db_version')
      .then(response => response.json())
      .then(data => setDbVersion(data.version))
      .catch(error => console.error('Error fetching /api/db_version:', error));
  }, []);

  return (
    <div className="App">
      <h1>{message}</h1>
      <h2>Database Version: {dbVersion}</h2>
    </div>
  );
}

export default App;