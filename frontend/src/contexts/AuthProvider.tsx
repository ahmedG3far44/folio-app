/* eslint-disable @typescript-eslint/no-explicit-any */
import { IAuthContextType, IUserType } from "@/lib/types";
import { createContext, ReactNode, useContext, useState } from "react";

import { useNavigate } from "react-router-dom";

const AuthContext = createContext<IAuthContextType>({
  user: {
    id: "",
    name: "",
    email: "",
    picture: "",
    role: "USER",
    resume: "",
  },
  token: "",
  isAdmin: false,
  isLogged: false,
  login: () => {},
  logout: () => {},
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const navigate = useNavigate();
  const storedUser = JSON.parse(window.localStorage.getItem("user")!);
  const [user, setUser] = useState<IUserType>(storedUser);
  const [token, setToken] = useState<string>(
    localStorage.getItem("token") as string
  );
  const [isLogged, setIsLogged] = useState<boolean>(!token ? false : true);

  const isAdmin: boolean = user?.role === "ADMIN";

  const login = async ({ user, token }: { user: IUserType; token: string }) => {
    setUser(user);
    setToken(token);
    localStorage.setItem("user", JSON.stringify(user));
    localStorage.setItem("token", token);
    setIsLogged(true);
  };

  const logout = () => {
    window.localStorage.clear();
    setIsLogged(false);
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
