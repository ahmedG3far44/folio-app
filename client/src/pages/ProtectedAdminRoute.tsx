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
    if (isOpen) {
      setIsOpen(false);
    }
  };

  return (
    <div
      style={{
        backgroundColor: activeTheme.backgroundColor,
        color: activeTheme.primaryText,
      }}
      className="w-full max-w-full h-screen overflow-hidden grid grid-cols-1 lg:grid-cols-[280px_1fr]"
    >
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      <aside
        style={{
          backgroundColor: activeTheme.backgroundColor,
        }}
        className={`
          fixed inset-y-0 left-0 z-50 w-64 
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0 lg:static lg:w-full
          h-screen p-4 lg:p-6
          flex flex-col items-center justify-start gap-4
          shadow-2xl lg:shadow-none
          overflow-y-auto
        `}
      >
        <div
          style={{ borderColor: activeTheme.borderColor }}
          className="w-full flex border-b items-start justify-start gap-3 pb-4"
        >
          <div className="w-12 h-12 overflow-hidden rounded-full flex-shrink-0">
            <Image
              className="w-full h-full object-cover"
              src={user?.picture as string}
              alt={user.email as string}
            />
          </div>
          <div className="text-sm flex flex-col items-start justify-start flex-1 min-w-0">
            <h3 className="font-bold truncate w-full">{user.name}</h3>
            <h4 className="text-xs opacity-70 truncate w-full">{user.email}</h4>
            <span
              style={{
                borderColor: activeTheme.borderColor,
                backgroundColor: activeTheme.cardColor,
              }}
              className="inline-block px-3 py-1 rounded-full border mt-2 text-xs font-medium"
            >
              {isAdmin ? "Admin" : "User"}
            </span>
          </div>
        </div>
        <nav className="w-full flex-1">
          <ul className="flex flex-col items-center justify-start gap-2 w-full">
            {adminDashboardRoutes.map((route) => {
              const isActive = active === route.path;
              return (
                <li key={route.id} className="w-full">
                  <Link
                    className="w-full inline-block"
                    to={
                      route.name === "Home" ? "/" : `/dashboard/${route.path}`
                    }
                    onClick={handleNavClick}
                  >
                    <div
                      style={{
                        color: isActive
                          ? activeTheme.secondaryText
                          : activeTheme.primaryText,
                        backgroundColor: isActive
                          ? activeTheme.cardColor
                          : "transparent",
                      }}
                      className={`
                        w-full flex items-center py-3 px-4 gap-3 rounded-lg
                        transition-all duration-200
                        hover:opacity-80 hover:scale-[0.98]
                        ${isActive ? "shadow-sm" : ""}
                      `}
                    >
                      <span className="flex-shrink-0">{route.icon}</span>
                      <span className="font-medium">{route.name}</span>
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="w-full mt-auto pt-4">
          <Button
            className="w-full"
            variant="outline"
            onClick={() => {
              logout();
              setIsOpen(false);
            }}
          >
            <LogOut size={20} />
            Logout
          </Button>
        </div>
      </aside>

      <main
        className="w-full h-screen flex flex-col overflow-hidden"
        style={{ backgroundColor: activeTheme.cardColor }}
      >
        <div
          className="w-full p-4 lg:p-6 flex-shrink-0"
          style={{ backgroundColor: activeTheme.cardColor }}
        >
          <h1 className="text-2xl lg:text-3xl font-black mb-4">
            Admin Dashboard
          </h1>

          <div
            style={{
              backgroundColor: activeTheme.backgroundColor,
              borderColor: activeTheme.borderColor,
            }}
            className="w-full p-3 lg:p-4 border flex items-center justify-between rounded-lg"
          >
            <div className="flex items-center gap-2 text-sm lg:text-base overflow-x-auto">
              <span>Admin</span>
              <ChevronRight size={16} className="flex-shrink-0" />
              <span>Dashboard</span>
              <ChevronRight size={16} className="flex-shrink-0" />
              <span className="capitalize font-medium">{active || "Home"}</span>
            </div>

            <Button
              className="lg:hidden ml-2 flex-shrink-0"
              onClick={() => setIsOpen(!isOpen)}
              type="button"
              variant="outline"
              size="sm"
            >
              <Menu size={20} />
            </Button>
          </div>
        </div>

        <div className="flex-1 w-full p-4 lg:p-6 overflow-y-auto">
          <div
            className="p-4 lg:p-6 w-full border rounded-lg"
            style={{
              backgroundColor: activeTheme.backgroundColor,
              borderColor: activeTheme.borderColor,
            }}
          >
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  );
}

export default ProtectedAdminRoute;
