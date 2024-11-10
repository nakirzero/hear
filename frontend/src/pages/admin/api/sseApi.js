export const initializeSSE = (setNotifications) => {
  const backendUrl = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000';
  const eventSource = new EventSource(`${backendUrl}/api/notification/stream`);

  eventSource.onmessage = (event) => {
      console.log('New SSE event:', event.data);
      setNotifications((prevNotifications) => [
          ...prevNotifications,
          event.data,
      ]);
  };

  return eventSource;
};
