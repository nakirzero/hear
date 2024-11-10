export const formatNotificationMessage = (notification) => {
    switch (notification.NOTI_TYPE) {
      case 'wishbook':
        return `유저 ${notification.USER_SEQ} 이(가) 희망도서를 신청하였습니다.`;
      // 다른 알림 유형에 대한 메시지 형식을 추가할 수 있습니다.
      default:
        return `알림 유형 '${notification.type}'에 대한 알림이 있습니다.`;
    }
  };
  