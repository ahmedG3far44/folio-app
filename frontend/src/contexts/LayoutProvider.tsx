import { ILayoutType } from "@/lib/types";
import {
  createContext,
  FC,
  PropsWithChildren,
  useContext,
  useState,
} from "react";
import { useUser } from "./UserProvider";

interface LayoutContextType {
  layout: ILayoutType;
  setLayout: (newLayout: ILayoutType) => void;
}
export const LayoutContext = createContext<LayoutContextType>({
  layout: {
    id: "1",
    heroLayout: "1",
    expLayout: "1",
    projectsLayout: "1",
    skillsLayout: "1",
  },
  setLayout: () => {},
});

export const LayoutProvider: FC<PropsWithChildren> = ({ children }) => {
  const { layouts } = useUser();

  console.log(layouts);
  const [layout, setLayout] = useState<ILayoutType>({
    id: "1",
    heroLayout: "1",
    expLayout: "1",
    projectsLayout: "1",
    skillsLayout: "1",
  });
  return (
    <LayoutContext.Provider value={{ layout, setLayout }}>
      {children}
    </LayoutContext.Provider>
  );
};

export const useLayout = () => useContext(LayoutContext);

export default LayoutProvider;
