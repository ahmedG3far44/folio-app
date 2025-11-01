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

import { useAuth } from "./AuthProvider";

import toast from "react-hot-toast";

const URL_SERVER = import.meta.env.VITE_URL_SERVER as string;

interface ThemeContextType {
  activeTheme: IThemeType;
  defaultTheme: IThemeType;
  themesList: IThemeType[] | [];
  switchTheme: ({ newActiveThemeId }: { newActiveThemeId: string }) => void;
  setThemesList: Dispatch<SetStateAction<IThemeType[] | []>>;
  setActiveTheme: Dispatch<SetStateAction<IThemeType>>;
  loading: boolean;
}

const ThemeContext = createContext<ThemeContextType>({
  activeTheme: {
    id: "1",
    themeName: "Zinc",
    backgroundColor: "#ffffff",
    cardColor: "#fafafa",
    primaryText: "#18181b",
    secondaryText: "#71717a",
    borderColor: "#e4e4e7",
  },
  defaultTheme: {
    id: "2",
    themeName: "Zinc Dark",
    backgroundColor: "#09090b",
    cardColor: "#18181b",
    primaryText: "#fafafa",
    secondaryText: "#a1a1aa",
    borderColor: "#27272a",
  },
  themesList: [],
  switchTheme: () => {},
  setThemesList: () => {},
  setActiveTheme: () => {},
  loading: false,
});
const ThemeProvider: FC<PropsWithChildren> = ({ children }) => {
  const { user, token } = useAuth();
  const [userTheme, setActiveTheme] = useState<IThemeType>({
    id: "1",
    themeName: "Zinc Light",
    backgroundColor: "#ffffff",
    cardColor: "#fafafa",
    primaryText: "#18181b",
    secondaryText: "#71717a",
    borderColor: "#e4e4e7",
  });
  console.log(userTheme);
  const defaultTheme: IThemeType = {
    id: "2",
    themeName: "Zinc Dark",
    backgroundColor: "#09090b",
    cardColor: "#18181b",
    primaryText: "#fafafa",
    secondaryText: "#a1a1aa",
    borderColor: "#27272a",
  };

  const [themesList, setThemesList] = useState<IThemeType[] | []>([]);
  const [loading, setLoading] = useState<boolean>(false);
  
  useEffect(() => {
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
        if (error instanceof Error) {
          console.log(error.message);
        } else {
          console.log(error);
        }
        return;
      } finally {
        setLoading(false);
      }
    };
    fetchThemes();
  }, [user, token]);

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
    // toast.error((err as Error).message);
    return err;
  }
};
