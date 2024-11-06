import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [userObject, setUserObject] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedUserInfo = sessionStorage.getItem('userInfo') || localStorage.getItem('userInfo');
    if (storedUserInfo) {
      const parsedUserInfo = JSON.parse(storedUserInfo).userInfo;
      setUserObject(parsedUserInfo);
    }
    setIsLoading(false); // 로딩 상태 해제
  }, []);

  useEffect(() => {
    if (userObject) {
      sessionStorage.setItem('userInfo', JSON.stringify({ userInfo: userObject }));
      localStorage.setItem('userInfo', JSON.stringify({ userInfo: userObject }));
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
