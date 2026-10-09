import { createContext, useContext, useEffect, useState } from "react";
import {
  currentUserRequest,
  loginRequest,
  logoutRequest,
  registerRequest,
} from "../api/auth.api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [checkingSession, setCheckingSession] = useState(true);

  useEffect(() => {
    currentUserRequest()
      .then((res) => setUser(res.data.data))
      .catch(() => setUser(null))
      .finally(() => setCheckingSession(false));
  }, []);

  const login = async (identifier, password) => {
    const res = await loginRequest({ identifier, password });
    setUser(res.data.data.user);
    return res.data.data.user;
  };

  const register = async (formData) => {
    const res = await registerRequest(formData);
    return res.data.data;
  };

  const logout = async () => {
    try {
      await logoutRequest();
    } finally {
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, checkingSession, login, register, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
