import axios from 'axios';

// 관리자용 알림 데이터를 DB에서 가져오는 함수
export const fetchNotifications = async () => {
  try {
    const response = await axios.get('/api/notification/notifications');
    return response.data; // 알림 데이터를 반환
  } catch (error) {
    console.error('Failed to fetch notifications:', error);
    return [];
  }
};
