import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "./AuthContext";

const RequireAdmin = () => {
  const { isAdmin } = useAuth();
  console.log("RequireAdmin - isAdmin:", isAdmin); // 확인용 로그

  if (!isAdmin) {
    // 관리자가 아닐 경우, 홈 페이지나 로그인 페이지로 리디렉션
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default RequireAdmin;
