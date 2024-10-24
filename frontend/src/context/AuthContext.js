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

  return (
    <AuthContext.Provider value={{ userObject, setUserObject }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
