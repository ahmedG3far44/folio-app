// app/contexts/AuthProvider.jsx
"use client"; // This is crucial for context providers in Next.js 13+

import { createContext, useState, useEffect, useContext } from "react";

export const AuthContext = createContext(undefined);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isLogged, setIsLogged] = useState(false);

  useEffect(() => {
    // This code only runs on the client side
    if (typeof window !== "undefined") {
      const storedUser = localStorage.getItem("user");
      const storedToken = localStorage.getItem("token");

      setUser(storedUser ? JSON.parse(storedUser) : null);
      setToken(storedToken || null);
      setIsLogged(!!storedToken);
    }
  }, []);

  const login = ({ user, token }) => {
    setUser(user);
    setToken(token);
    setIsLogged(true);
    if (typeof window !== "undefined") {
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("token", token);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    setIsLogged(false);
    if (typeof window !== "undefined") {
      localStorage.removeItem("user");
      localStorage.removeItem("token");
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, isLogged, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
