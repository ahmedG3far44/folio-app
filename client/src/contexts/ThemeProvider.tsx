/* eslint-disable react-refresh/only-export-components */
import { IThemeType, IUserType } from "@/lib/types";
import { Dispatch, SetStateAction } from "react";
import {
  createContext,
  FC,
  PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from "react";
import { useLocation } from "react-router-dom";

import { useAuth } from "./AuthProvider";

import toast from "react-hot-toast";

const URL_SERVER = import.meta.env.VITE_API_URL as string;

interface ThemeContextType {
  activeTheme: IThemeType;
  defaultTheme: IThemeType;
  themesList: IThemeType[] | [];
  switchTheme: ({ newActiveThemeId }: { newActiveThemeId: string }) => void;
  setThemesList: Dispatch<SetStateAction<IThemeType[] | []>>;
  setActiveTheme: Dispatch<SetStateAction<IThemeType>>;
  loading: boolean;
}

const DEFAULT_THEME = {
  id: "1",
  themeName: "Midnight",
  backgroundColor: "#0a0a0a",
  cardColor: "#171717",
  primaryText: "#fafafa",
  secondaryText: "#a3a3a3",
  borderColor: "#262626",
};

const ThemeContext = createContext<ThemeContextType>({
  activeTheme: DEFAULT_THEME,
  defaultTheme: DEFAULT_THEME,
  themesList: [],
  switchTheme: () => {},
  setThemesList: () => {},
  setActiveTheme: () => {},
  loading: false,
});
const ThemeProvider: FC<PropsWithChildren> = ({ children }) => {
  const { user, token } = useAuth();
  const [userTheme, setActiveTheme] = useState<IThemeType>({ ...DEFAULT_THEME });
  const defaultTheme: IThemeType = { ...DEFAULT_THEME, id: "2" };

  const [themesList, setThemesList] = useState<IThemeType[] | []>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const { pathname } = useLocation();

  const shouldFetch = pathname.startsWith("/profile") || pathname.startsWith("/dashboard");

  useEffect(() => {
    if (!shouldFetch || !user) return;
    const fetchThemes = async () => {
      try {
        setLoading(true);
        const listThemes = await getThemesList(token, user);
        const activeTheme = await getUserActiveTheme({ token, user });
        if (activeTheme) {
          setActiveTheme(activeTheme as IThemeType);
        }

        if (listThemes && Array.isArray(listThemes.data)) {
          setThemesList(listThemes.data);
        }
      } catch (error) {
        toast.error("Can't load themes, please check your connection!!");
      } finally {
        setLoading(false);
      }
    };
    fetchThemes();
  }, [user, token, shouldFetch]);

  const switchTheme = async ({
    newActiveThemeId,
  }: {
    newActiveThemeId: string;
  }) => {
    try {
      setLoading(true);
      if (!user || !token) {
        throw new Error("you must be logged in to change theme");
      }
      const newActiveTheme = themesList.find(
        (theme) => theme.id === newActiveThemeId
      );
      if (!newActiveTheme) {
        throw new Error("theme not found");
      }
      const response = await fetch(`${URL_SERVER}/theme`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ themeId: newActiveThemeId }),
      });

      if (!response.ok) {
        throw new Error("updating theme failed, check your connection!!");
      }
      const data = await response.json();

      const theme = data.data;

      if (!theme) {
        throw new Error("theme not found");
      }
      setActiveTheme({ ...theme });
      toast.success("theme changed successfully");
      return theme;
    } catch (err) {
      return toast.error((err as Error).message);
    } finally {
      setLoading(false);
    }
  };
  return (
    <ThemeContext.Provider
      value={{
        activeTheme: userTheme,
        defaultTheme,
        themesList,
        switchTheme,
        setThemesList,
        setActiveTheme,
        loading,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeProvider;

export const useTheme = () => useContext(ThemeContext);

export const getThemesList = async (token: string, user: IUserType) => {
  try {
    if (!user) return;
    const response = await fetch(`${URL_SERVER}/themes`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      throw new Error("can't get themes list, please check your connection!!");
    }
    const data = await response.json();
    console.log(data);

    const themesList: { data: IThemeType[] } = data;

    return themesList;
  } catch (err) {
    toast.error((err as Error).message);
    return;
  }
};

export const getUserActiveTheme = async ({
  token,
  user,
}: {
  token?: string;
  user: IUserType;
}) => {
  try {
    if (!user) return;
    const response = await fetch(`${URL_SERVER}/theme/${user.id}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      throw new Error(
        "can't get user active theme, please check your connection!!"
      );
    }
    const data = await response.json();
    const theme: IThemeType = data.data;
    return theme;
  } catch (err) {
    return null;
  }
};
