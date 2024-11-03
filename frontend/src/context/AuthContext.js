import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [userObject, setUserObject] = useState(null);

  useEffect(() => {
    const storedUserInfo = sessionStorage.getItem('userInfo') || localStorage.getItem('userInfo');
    
    if (storedUserInfo) {
      const parsedUserInfo = JSON.parse(storedUserInfo).userInfo;
      setUserObject(parsedUserInfo);
    }
  }, []);

  useEffect(() => {
    // userObject가 변경될 때마다 세션 및 로컬 스토리지 업데이트
    if (userObject) {
      sessionStorage.setItem('userInfo', JSON.stringify({ userInfo: userObject }));
      localStorage.setItem('userInfo', JSON.stringify({ userInfo: userObject }));
    }
  }, [userObject]);

  // 관리자 여부 확인
  const isAdmin = userObject?.is_admin || false;
  console.log('isAdmin', isAdmin);

  return (
    <AuthContext.Provider value={{ userObject, setUserObject, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
