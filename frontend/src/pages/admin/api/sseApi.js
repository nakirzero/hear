export const initializeSSE = (setNotifications) => {
  const baseURL = process.env.NODE_ENV === 'development' 
    ? 'http://localhost:5000/api/notification/stream'
    : '/api/notification/stream';
    
  const eventSource = new EventSource(baseURL);
  eventSource.onmessage = (event) => {
    console.log('New SSE event:', event.data);
    setNotifications((prevNotifications) => [
      ...prevNotifications,
      event.data,
    ]);
  };

  return eventSource;
};