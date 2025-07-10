/* eslint-disable react-refresh/only-export-components */
import { IThemeType } from "@/lib/types";
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
  themesList: IThemeType[] | [];
  switchTheme: ({
    newActiveTheme,
  }: {
    newActiveTheme: IThemeType;
  }) =>void;
  setThemesList: Dispatch<SetStateAction<IThemeType[] | []>>;
  setActiveTheme: Dispatch<SetStateAction<IThemeType>>;
  loading: boolean;
}

const ThemeContext = createContext<ThemeContextType>({
  activeTheme: {
    id: "84899843984",
    themeName: "Default",
    backgroundColor: "#1A2F23",
    cardColor: "#2D3B33",
    primaryText: "#7CC68D",
    secondaryText: "#B8C4B9",
    borderColor: "#4E7D53",
  },
  themesList: [],
  switchTheme: () => {},
  setThemesList: () => {},
  setActiveTheme: () => {},
  loading: false,
});
const ThemeProvider: FC<PropsWithChildren> = ({ children }) => {
  const { user, token } = useAuth();
  const defaultTheme = JSON.parse(localStorage.getItem("theme") as string);

  const [userTheme, setActiveTheme] = useState<IThemeType>(defaultTheme || {
    id: "84899843984",
    themeName: "Default",
    backgroundColor: "#1A2F23",
    cardColor: "#2D3B33",
    primaryText: "#7CC68D",
    secondaryText: "#B8C4B9",
    borderColor: "#4E7D53"});

  const [themesList, setThemesList] = useState<IThemeType[] | []>([]);
  const [loading, setLoading] = useState<boolean>(false);
  useEffect(() => {
    async function getThemesList() {
      try {
        if (!user) return;
        const response = await fetch(`${URL_SERVER}/theme`);
        if (!response.ok) {
          throw new Error(
            "can't get themes list, please check your connection!!"
          );
        }
        const themes = await response.json();
        const { data }: { data: IThemeType[] } = themes;
        setThemesList([...data]);
        return data;
      } catch (err) {
        toast.error((err as Error).message);
        return;
      }
    }
    getThemesList();    
  }, [user, userTheme]);

  const switchTheme = async ({
    newActiveTheme,
  }: {
    newActiveTheme: IThemeType;
  }) => {
    try {
      setLoading(true);
      if (!user || !token) {
        throw new Error("you must be logged in to change theme");
      }
      // const response = await fetch(`${URL_SERVER}/theme`, {
      //   method: "PUT",
      //   headers: {
      //     "Content-Type": "application/json",
      //     Authorization: `Bearer ${token}`,
      //   },
      //   body: JSON.stringify(newActiveTheme),
      // });

      // if (!response.ok) {
      //   throw new Error("updating theme failed, check your connection!!");
      // }
      // const data = await response.json();
      
      // const { theme } = data.data;
      // if (!theme) {
      //   throw new Error("theme not found");
      // }
      localStorage.removeItem("theme");
      localStorage.setItem("theme", JSON.stringify(newActiveTheme));
      setActiveTheme(JSON.parse(localStorage.getItem("theme") as string));
      toast.success("theme changed successfully");
      return newActiveTheme;
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
