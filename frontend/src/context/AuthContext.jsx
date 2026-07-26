import React, { createContext, useState, useEffect, useContext } from "react";
import API from "../services/api";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Auto-restore login session on mount
  useEffect(() => {
    const checkLoggedIn = async () => {
      const token = localStorage.getItem("medivision_token");
      if (token) {
        try {
          const res = await API.get("/api/auth/me");
          setUser(res.data);
        } catch (err) {
          console.error("Session restore failed, cleaning token:", err);
          localStorage.removeItem("medivision_token");
        }
      }
      setLoading(false);
    };

    checkLoggedIn();
  }, []);

  const login = async (email, password) => {
    try {
      const response = await API.post("/api/auth/login", { email, password });
      const { access_token } = response.data;
      localStorage.setItem("medivision_token", access_token);
      
      // Fetch user profile
      const userRes = await API.get("/api/auth/me");
      setUser(userRes.data);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.detail || "Invalid credentials. Please try again."
      };
    }
  };

  const register = async (email, password, full_name) => {
    try {
      await API.post("/api/auth/register", { email, password, full_name });
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.detail || "Registration failed. Email may already be in use."
      };
    }
  };

  const logout = () => {
    localStorage.removeItem("medivision_token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
export default AuthContext;
