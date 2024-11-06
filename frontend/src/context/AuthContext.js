import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [userObject, setUserObject] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedSessionUserInfo = sessionStorage.getItem('userInfo');
    const storedLocalUserInfo = localStorage.getItem('userInfo');

    if (storedSessionUserInfo) {
      setUserObject(JSON.parse(storedSessionUserInfo));
    } else if (storedLocalUserInfo) {
      setUserObject(JSON.parse(storedLocalUserInfo));
    }

    setIsLoading(false); // 로딩 상태 해제
  }, []);

  useEffect(() => {
    if (userObject) {
      const storageType = userObject.persist === 'session' ? sessionStorage : localStorage;
      storageType.setItem('userInfo', JSON.stringify(userObject));
    }
  }, [userObject]);

  const isAdmin = userObject?.is_admin ?? false;

  return (
    <AuthContext.Provider value={{ userObject, setUserObject, isAdmin, isLoading }}>
      {!isLoading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
