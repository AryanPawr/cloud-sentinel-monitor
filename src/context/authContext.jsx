import { createContext, useContext, useState, useEffect, useCallback } from "react";
import axiosInstance from "../api/axiosInstance.js";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser]       = useState(null);
  const [loading, setLoading] = useState(true); // true while we verify stored token on mount

  // â”€â”€ On mount: restore session from localStorage â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  useEffect(() => {
    const token       = localStorage.getItem("cr_token");
    const storedUser  = localStorage.getItem("cr_user");

    if (token && storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch {
        // Corrupted data â€” clear it
        localStorage.removeItem("cr_token");
        localStorage.removeItem("cr_user");
      }
    }
    setLoading(false);
  }, []);

  // â”€â”€ Shared helper: persist token + user after login/register â”€â”€
  const persist = useCallback((token, userData) => {
    localStorage.setItem("cr_token", token);
    localStorage.setItem("cr_user", JSON.stringify(userData));
    setUser(userData);
  }, []);

  // â”€â”€ Register â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  const register = useCallback(async ({ name, email, password }) => {
    const res = await axiosInstance.post("/auth/register", { name, email, password });
    persist(res.data.token, res.data.data.user);
  }, [persist]);

  // â”€â”€ Login â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  const login = useCallback(async ({ email, password }) => {
    const res = await axiosInstance.post("/auth/login", { email, password });
    persist(res.data.token, res.data.data.user);
  }, [persist]);

  // â”€â”€ Logout â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  const logout = useCallback(() => {
    localStorage.removeItem("cr_token");
    localStorage.removeItem("cr_user");
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
};

