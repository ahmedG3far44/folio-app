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
import toast from "react-hot-toast";

const URL_SERVER = import.meta.env.VITE_URL_SERVER as string;

const ThemeContext = createContext<ThemeContextType>({
  activeTheme: {
    id: "1ssssssssa",
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
  loading: false,
});
const ThemeProvider: FC<PropsWithChildren> = ({ children }) => {
  const { user, token } = useAuth();
  const localTheme = JSON.parse(localStorage.getItem("theme")!);
  const [theme, setActiveTheme] = useState<IThemeType>(
    localTheme ? localTheme : user.theme
  );
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

        // console.log(first)

        setThemesList([...data]);
        return data;
      } catch (err) {
        console.log((err as Error).message);
        toast.error((err as Error).message);
        return;
      }
    }

    getThemesList();
  }, [user, theme]);
  const switchTheme = async ({
    newActiveTheme,
  }: {
    newActiveTheme: IThemeType;
  }) => {
    try {
      setLoading(true);
      const response = await fetch(`${URL_SERVER}/theme/${newActiveTheme.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newActiveTheme),
      });

      if (!response.ok) {
        throw new Error("updating theme failed, check your connection!!");
      }
      const data = await response.json();
      const { theme } = data.data;

      localStorage.setItem("theme", JSON.stringify(theme));
      setActiveTheme({ ...theme });
      toast.success("theme changed succesfully");
      return theme;
    } catch (err) {
      console.log((err as Error).message);
      return;
    } finally {
      setLoading(false);
    }
  };
  return (
    <ThemeContext.Provider
      value={{
        activeTheme: theme,
        themesList,
        switchTheme,
        setThemesList,
        loading,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeProvider;

export const useTheme = () => useContext(ThemeContext);
