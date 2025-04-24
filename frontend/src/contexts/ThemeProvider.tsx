import { IThemeType, ThemeContextType } from "@/lib/types";
import {
  createContext,
  FC,
  PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from "react";
import { useAuth } from "./AuthProvider";

const URL_SERVER = import.meta.env.VITE_URL_SERVER as string;

const ThemeContext = createContext<ThemeContextType>({
  activeTheme: {
    id: "1",
    backgroundColor: "#1A2F23",
    cardColor: "#2D3B33",
    primaryText: "#7CC68D",
    secondaryText: "#B8C4B9",
    borderColor: "#4E7D53",
  },
  themesList: [],
  switchTheme: () => {},
});
const ThemeProvider: FC<PropsWithChildren> = ({ children }) => {
  const { user } = useAuth();
  const theme = JSON.parse(localStorage.getItem("theme")!);
  const [activeTheme, setActiveTheme] = useState<IThemeType>(
    theme
      ? theme
      : {
          backgroundColor: "#09090B",
          cardColor: "#18181B",
          primaryText: "#E2E2E5",
          secondaryText: "#A1A1AA",
          borderColor: "#27272A",
        }
  );

  const [themesList, setThemesList] = useState<IThemeType[] | []>([]);
  useEffect(() => {
    async function getThemesList() {
      try {
        if (!user) return;
        const response = await fetch(`${URL_SERVER}/theme`);
        if (!response.ok)
          throw new Error(
            "can't get themes list, please check your connection!!"
          );
        const themes = await response.json();
        const { data } = themes;

        setThemesList([...data]);
        return data;
      } catch (err) {
        console.log((err as Error).message);
        return;
      }
    }

    getThemesList();
  }, [user]);
  const switchTheme = ({ newActiveTheme }: { newActiveTheme: IThemeType }) => {
    console.log(newActiveTheme);
    localStorage.setItem("theme", JSON.stringify(newActiveTheme));
    setActiveTheme({ ...newActiveTheme });
  };
  return (
    <ThemeContext.Provider value={{ activeTheme, themesList, switchTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeProvider;

export const useTheme = () => useContext(ThemeContext);
