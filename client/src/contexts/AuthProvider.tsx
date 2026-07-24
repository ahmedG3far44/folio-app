/* eslint-disable react-refresh/only-export-components */
import { IAuthContextType, IUserType } from "@/lib/types";
import { createContext, ReactNode, useCallback, useContext, useEffect, useRef, useState } from "react";

import { useNavigate } from "react-router-dom";

const DEFAULT_USER: IUserType = {
  id: "",
  name: "",
  email: "",
  picture: "",
  role: "USER",
  resume: "",
  activeTheme: {
    id: "1",
    themeName: "Midnight",
    backgroundColor: "#0a0a0a",
    cardColor: "#171717",
    primaryText: "#fafafa",
    secondaryText: "#a3a3a3",
    borderColor: "#262626",
  },
};

function getStoredUser(): IUserType {
  try {
    const raw = window.localStorage.getItem("user");
    if (!raw) return DEFAULT_USER;
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object" || !parsed.id) return DEFAULT_USER;
    return { ...DEFAULT_USER, ...parsed };
  } catch {
    return DEFAULT_USER;
  }
}

function getStoredToken(): string {
  try {
    return window.localStorage.getItem("token") || "";
  } catch {
    return "";
  }
}

const AuthContext = createContext<IAuthContextType>({
  user: DEFAULT_USER,
  token: "",
  isAdmin: false,
  isLogged: false,
  login: () => {},
  logout: () => {},
});

const API_URL = import.meta.env.VITE_API_URL as string;

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState<IUserType>(getStoredUser);
  const [token, setToken] = useState<string>(getStoredToken);
  const [isLogged, setIsLogged] = useState<boolean>(() => !!getStoredToken());
  const validatedRef = useRef(false);

  const isAdmin: boolean = user?.role === "ADMIN";

  useEffect(() => {
    if (!token || validatedRef.current) return;
    validatedRef.current = true;

    const validateToken = async () => {
      try {
        const storedUser = getStoredUser();
        if (!storedUser.id) {
          clearAuth();
          return;
        }
        const response = await fetch(`${API_URL}/user/${storedUser.id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!response.ok) {
          clearAuth();
        }
      } catch {
        clearAuth();
      }
    };
    validateToken();
  }, [token]);

  const clearAuth = useCallback(() => {
    window.localStorage.removeItem("user");
    window.localStorage.removeItem("token");
    window.localStorage.removeItem("theme");
    setToken("");
    setUser(DEFAULT_USER);
    setIsLogged(false);
  }, []);

  const login = async ({ user, token }: { user: IUserType; token: string }) => {
    setUser(user);
    setToken(token);
    localStorage.setItem("user", JSON.stringify(user));
    localStorage.setItem("theme", JSON.stringify(user.activeTheme));
    localStorage.setItem("token", token);
    setIsLogged(true);
  };

  const logout = () => {
    clearAuth();
    navigate("/");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLogged,
        isAdmin,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
