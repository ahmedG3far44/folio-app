import {
  Box,
  Boxes,
  LucideSettings,
  LucideHome,
  ActivitySquare,
  LucideLogOut,
} from "lucide-react";
import { Link } from "react-router-dom";
import User from "./User";
import { Card } from "./ui/card";
import { useAuth } from "@/contexts/AuthProvider";
function NavigationMenu() {
  const navList = [
    {
      id: 1,
      name: "Home",
      path: "/",
      icon: <LucideHome size={20} />,
    },
    {
      id: 2,
      name: "Experiences",
      path: "profile/skills",
      icon: <ActivitySquare size={20} />,
    },
    {
      id: 3,
      name: "Projects",
      path: "profile/projects",
      icon: <Box size={20} />,
    },
    {
      id: 4,
      name: "Skills",
      path: "profile/skills",
      icon: <Boxes size={20} />,
    },
    {
      id: 5,
      name: "Settings",
      path: "profile/bio",
      icon: <LucideSettings size={20} />,
    },
  ];
  const { logout } = useAuth();
  return (
    <Card className="fixed right-20 top-[30%]  py-8  px-2 border rounded-2xl z-[999px] shadow-md hover:scale-125 duration-150">
      <nav>
        <ul className="flex flex-col items-center justify-center gap-4">
          {navList.map((item) => {
            return (
              <li className="hover:text-zinc-900 text-zinc-500" key={item.id}>
                <Link to={`/${item.path}`}>
                  <span>{item.icon}</span>
                </Link>
              </li>
            );
          })}
          <User />
        </ul>
        <button className="my-4 p-1 hover:bg-zinc-400" onClick={logout}>
          <LucideLogOut size={20} />
        </button>
      </nav>
    </Card>
  );
}

export default NavigationMenu;
