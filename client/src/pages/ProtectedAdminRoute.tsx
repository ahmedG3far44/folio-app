import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthProvider";
import { useTheme } from "@/contexts/ThemeProvider";
import {
  ChevronRight,
  Home,
  ScatterChart,
  LogOut,
  SunMoon,
  Users,
  Menu,
} from "lucide-react";

import { useState } from "react";
import { Link, Navigate, Outlet, useLocation } from "react-router-dom";

import Image from "@/components/ui/image";

function ProtectedAdminRoute() {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const { activeTheme } = useTheme();
  const { user, isLogged, logout } = useAuth();
  const location = useLocation();
  const active = location.pathname.split("/").pop();

  const isAdmin = user.role === "ADMIN" ? true : false;
  if (!isLogged) return <Navigate to={"/login"} />;
  if (!isAdmin) return <Navigate to={"/"} />;

  const adminDashboardRoutes = [
    {
      id: 1,
      name: "Home",
      path: "/",
      icon: <Home size={20} />,
    },
    {
      id: 2,
      name: "Insights",
      path: "insights",
      icon: <ScatterChart size={20} />,
    },
    {
      id: 3,
      name: "Users",
      path: "users",
      icon: <Users size={20} />,
    },
    {
      id: 4,
      name: "Themes",
      path: "themes",
      icon: <SunMoon size={20} />,
    },
  ];

  const handleNavClick = () => {
    if (isOpen) setIsOpen(false);
  };

  return (
    <div
      style={{
        backgroundColor: activeTheme.backgroundColor,
        color: activeTheme.primaryText,
      }}
      className="w-full h-screen overflow-hidden grid grid-cols-1 lg:grid-cols-[240px_1fr]"
    >
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      <aside
        style={{ backgroundColor: activeTheme.backgroundColor }}
        className={`
          fixed inset-y-0 left-0 z-50 w-60
          transform transition-transform duration-200
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0 lg:static lg:w-full
          h-screen p-4
          flex flex-col gap-3
          shadow-lg lg:shadow-none
          overflow-y-auto
        `}
      >
        <div
          style={{ borderColor: activeTheme.borderColor }}
          className="flex items-center gap-3 pb-3 border-b shrink-0"
        >
          <div className="w-10 h-10 rounded-full overflow-hidden shrink-0">
            <Image
              className="w-full h-full object-cover"
              src={user?.picture as string}
              alt={user.email as string}
            />
          </div>
          <div className="min-w-0 text-sm">
            <h3 className="font-semibold truncate">{user.name}</h3>
            <p className="text-xs opacity-60 truncate">{user.email}</p>
            <span
              style={{
                borderColor: activeTheme.borderColor,
                backgroundColor: activeTheme.cardColor,
              }}
              className="inline-block px-2 py-0.5 rounded-full border mt-1 text-[11px] font-medium"
            >
              Admin
            </span>
          </div>
        </div>

        <nav className="flex-1">
          <ul className="flex flex-col gap-1">
            {adminDashboardRoutes.map((route) => {
              const isActive = active === route.path;
              return (
                <li key={route.id}>
                  <Link
                    to={
                      route.name === "Home" ? "/" : `/dashboard/${route.path}`
                    }
                    onClick={handleNavClick}
                    style={{
                      color: isActive
                        ? activeTheme.primaryText
                        : activeTheme.secondaryText,
                      backgroundColor: isActive
                        ? activeTheme.cardColor
                        : "transparent",
                    }}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors duration-150 ${
                      isActive ? "" : "hover:opacity-80"
                    }`}
                  >
                    <span className="shrink-0">{route.icon}</span>
                    {route.name}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="shrink-0">
          <Button
            className="w-full cursor-pointer"
            variant="outline"
            size="sm"
            onClick={() => {
              logout();
              setIsOpen(false);
            }}
          >
            <LogOut size={14} />
            Logout
          </Button>
        </div>
      </aside>

      <main
        className="flex flex-col h-screen overflow-hidden"
        style={{ backgroundColor: activeTheme.cardColor }}
      >
        <div
          className="shrink-0 px-4 lg:px-6 py-3 flex items-center justify-between gap-3"
          style={{ backgroundColor: activeTheme.cardColor }}
        >
          <div
            className="flex items-center gap-2 text-sm min-w-0"
            style={{ color: activeTheme.secondaryText }}
          >
            <span>Admin</span>
            <ChevronRight size={14} className="shrink-0" />
            <span>Dashboard</span>
            <ChevronRight size={14} className="shrink-0" />
            <span
              className="capitalize font-medium truncate"
              style={{ color: activeTheme.primaryText }}
            >
              {active || "Home"}
            </span>
          </div>

          <Button
            className="lg:hidden shrink-0"
            onClick={() => setIsOpen(!isOpen)}
            type="button"
            variant="outline"
            size="sm"
          >
            <Menu size={18} />
          </Button>
        </div>

        <div className="flex-1 w-full px-4 lg:px-6 pb-6 overflow-y-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

export default ProtectedAdminRoute;
