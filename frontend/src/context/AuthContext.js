import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [userObject, setUserObject] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // 세션과 로컬 저장소 구분하여 불러오기
    const storedSessionUserInfo = sessionStorage.getItem('userInfo');
    const storedLocalUserInfo = localStorage.getItem('userInfo');

    if (storedSessionUserInfo) {
      setUserObject(JSON.parse(storedSessionUserInfo).userInfo);
    } else if (storedLocalUserInfo) {
      setUserObject(JSON.parse(storedLocalUserInfo).userInfo);
    }

    setIsLoading(false); // 로딩 상태 해제
  }, []);

  // 저장 시 세션과 로컬 구분하여 저장
  useEffect(() => {
    if (userObject) {
      const storageType = userObject.persist === 'session' ? sessionStorage : localStorage;
      storageType.setItem('userInfo', JSON.stringify({ userInfo: userObject }));
    }
  }, [userObject]);

  const isAdmin = userObject?.is_admin ?? false;

  return (
    <AuthContext.Provider value={{ userObject, setUserObject, isAdmin, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
