import { useCallback, useState } from "react";
import { useAuth } from "../context/AuthContext";

const useUserValidation = () => {
  const { userObject } = useAuth();
  const [alertMessage, setAlertMessage] = useState("");
  const [alertSeverity, setAlertSeverity] = useState("success");

  const validateUser = useCallback(() => {
    if (!userObject || !userObject.USER_SEQ) {
      setAlertMessage("사용자 정보가 없습니다.");
      setAlertSeverity("error");
      return false;
    }
    return true;
  }, [userObject]);

  return { validateUser, alertMessage, setAlertMessage, alertSeverity, setAlertSeverity };
};

export default useUserValidation;
