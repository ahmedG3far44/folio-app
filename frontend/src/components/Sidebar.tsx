import { useAuth } from "@/contexts/AuthProvider";
import {
  FileUser,
  FolderKanban,
  Home,
  Info,
  LayoutPanelLeft,
  MessageCircleMore,
  SunMoon,
  XIcon,
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "./ui/button";
import { useTheme } from "@/contexts/ThemeProvider";

function Sidebar({
  isOpen,
  setIsOpen,
}: {
  isOpen: boolean;
  setIsOpen?: (menuState: boolean) => void;
}) {
  const { user, isLogged, logout } = useAuth();
  const { activeTheme } = useTheme();
  const { pathname } = useLocation();
  const activeLink = pathname.split("/").pop();
  const profileLinks = [
    {
      id: 1,
      name: "Home",
      path: "/",
      icon: <Home size={20} />,
    },
    {
      id: 2,
      name: "Bio",
      path: "bio",
      icon: <Info size={20} />,
    },
    {
      id: 3,
      name: "Experiences",
      path: "experiences",
      icon: <FileUser size={20} />,
    },
    {
      id: 4,
      name: "Projects",
      path: "projects",
      icon: <FolderKanban size={20} />,
    },
    {
      id: 5,
      name: "Skills",
      path: "skills",
      icon: <LayoutPanelLeft size={20} />,
    },
    {
      id: 6,
      name: "Testimonials",
      path: "testimonials",
      icon: <MessageCircleMore size={20} />,
    },
    {
      id: 7,
      name: "Themes",
      path: "themes",
      icon: <SunMoon size={20} />,
    },
  ];

  const handleCloseMenu = () => {
    setIsOpen?.(!isOpen);
  };
  return (
    <aside
      style={{
        backgroundColor: activeTheme.backgroundColor,
        color: activeTheme.primaryText,
      }}
      className={` ${
        isOpen && "hidden shadow-sm "
      } w-[25%] min-w-[200px] shadow-md fixed top-0 left-0 flex-col justify-start items-center lg:flex min-h-screen z-[999]`}
    >
      <div
        style={{ borderColor: activeTheme.borderColor }}
        className="flex border-b items-start justify-start gap-2 p-4 flex-wrap"
      >
        <button
          className="lg:hidden absolute right-4 top-4 border cursor-pointer rounded-2xl p-1 hover:opacity-75 duration-150"
          onClick={handleCloseMenu}
        >
          <XIcon size={20} />
        </button>
        <div className="w-10 h-10 overflow-hidden rounded-full">
          <img
            className="w-full h-full object-cover"
            src={user?.picture as string}
            alt={user.email as string}
          />
        </div>
        <div className="text-sm  ">
          <h3 className="font-bold">{user.name}</h3>
          <h4>{user.email}</h4>
        </div>
      </div>

      <div className="flex flex-col justify-between min-h-full items-center w-full h-full p-4 mt-10">
        <ul className=" flex justify-center items-center flex-col">
          {profileLinks.map((url) => {
            return (
              <Link
                style={{
                  backgroundColor:
                    url.path === activeLink
                      ? activeTheme.cardColor
                      : activeTheme.backgroundColor,
                  color:
                    url.path === activeLink
                      ? activeTheme.secondaryText
                      : activeTheme.primaryText,
                }}
                to={`${
                  url.path === "/" ? `/${user.id}` : `/profile/${url.path}`
                }`}
                className={`rounded-md p-4 w-full  transition-all duration-150 cursor-pointer flex items-center gap-4 font-bold `}
                key={url.id}
              >
                <span>{url.icon}</span>
                {url.name}
              </Link>
            );
          })}
        </ul>
        <div className="justify-end w-1/2 mt-32">
          {isLogged && (
            <Button
              className="w-full cursor-pointer mt-auto mb-8"
              type="button"
              onClick={logout}
            >
              Logout
            </Button>
          )}
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;
