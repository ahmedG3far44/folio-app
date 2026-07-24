import { useAuth } from "@/contexts/AuthProvider";
import {
  FileUser,
  FolderKanban,
  Home,
  Info,
  LayoutPanelLeft,
  MessageCircleMore,
  SunMoon,
  LogOut,
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "./ui/button";
import { useTheme } from "@/contexts/ThemeProvider";
import Image from "./ui/image";

function Sidebar({ isOpen }: { isOpen: boolean; setIsOpen?: (menuState: boolean) => void }) {
  const { user, isLogged, logout } = useAuth();
  const { activeTheme } = useTheme();
  const { pathname } = useLocation();
  const activeLink = pathname.split("/").pop();
  const profileLinks = [
    { id: 1, name: "Home", path: "/", icon: <Home size={18} /> },
    { id: 2, name: "Bio", path: "bio", icon: <Info size={18} /> },
    { id: 3, name: "Experiences", path: "experiences", icon: <FileUser size={18} /> },
    { id: 4, name: "Projects", path: "projects", icon: <FolderKanban size={18} /> },
    { id: 5, name: "Skills", path: "skills", icon: <LayoutPanelLeft size={18} /> },
    { id: 6, name: "Testimonials", path: "testimonials", icon: <MessageCircleMore size={18} /> },
    { id: 7, name: "Themes", path: "themes", icon: <SunMoon size={18} /> },
  ];

  return (
    <aside
      style={{
        backgroundColor: activeTheme.backgroundColor,
        color: activeTheme.primaryText,
        borderRight: `1px solid ${activeTheme.borderColor}`,
      }}
      className={`flex flex-col h-screen w-60 fixed lg:sticky top-0 left-0 z-50 transition-transform duration-200 ${
        isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      }`}
    >
      <div
        style={{ borderColor: activeTheme.borderColor }}
        className="flex items-center gap-3 px-5 py-4 border-b shrink-0"
      >
        <div className="w-9 h-9 rounded-full overflow-hidden shrink-0">
          <Image
            className="w-full h-full object-cover"
            src={user?.picture as string}
            alt={user.email as string}
          />
        </div>
        <div className="min-w-0">
          <h3 className="text-sm font-semibold truncate">{user.name}</h3>
          <p className="text-xs truncate opacity-60">{user.email}</p>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-4">
        <ul className="flex flex-col gap-1">
          {profileLinks.map((url) => {
            const isActive = url.path === activeLink;
            return (
              <li key={url.id}>
                <Link
                  style={{
                    backgroundColor: isActive ? activeTheme.cardColor : "transparent",
                    color: isActive ? activeTheme.primaryText : activeTheme.secondaryText,
                    borderColor: isActive ? activeTheme.borderColor : "transparent",
                  }}
                  to={url.path === "/" ? `/${user.id}` : `/profile/${url.path}`}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 ${
                    isActive ? "" : "hover:opacity-80"
                  }`}
                >
                  <span className="shrink-0">{url.icon}</span>
                  {url.name}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="px-3 pb-4 shrink-0">
        {isLogged && (
          <Button
            className="w-full cursor-pointer"
            type="button"
            variant="outline"
            size="sm"
            onClick={logout}
          >
            <LogOut size={14} />
            Logout
          </Button>
        )}
      </div>
    </aside>
  );
}

export default Sidebar;
