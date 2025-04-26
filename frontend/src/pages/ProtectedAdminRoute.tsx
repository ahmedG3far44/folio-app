import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthProvider";
import { useTheme } from "@/contexts/ThemeProvider";
import {
  ChevronRight,
  Home,
  LucideChartScatter,
  LucideSunMoon,
  LucideUsers,
} from "lucide-react";

import { useState } from "react";
import { Link, Navigate, Outlet, useLocation } from "react-router-dom";

function ProtectedAdminRoute() {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const { activeTheme } = useTheme();
  const { user, isLogged } = useAuth();
  const location = useLocation();
  const active = location.pathname.split("/").pop();
  console.log(active);

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
      icon: <LucideChartScatter size={20} />,
    },
    {
      id: 3,
      name: "Users",
      path: "users",
      icon: <LucideUsers size={20} />,
    },
    {
      id: 4,
      name: "Themes",
      path: "themes",
      icon: <LucideSunMoon size={20} />,
    },
  ];
  return (
    <div
      style={{
        backgroundColor: activeTheme.backgroundColor,
        color: activeTheme.primaryText,
      }}
      className="w-full max-w-full min-h-screen grid gird-cols-1 lg:grid-cols-[25%_1fr]"
    >
      <aside
        style={{
          backgroundColor: activeTheme.backgroundColor,
       
        }}
        className={`hidden min-h-screen w-1/2 p-4  flex-col items-center justify-start ${
          isOpen && "inline-block fixed left-0 top-0 shadow-2xl z-[999] "
        } lg:p-8 lg:flex lg:w-full lg:items-start gap-4`}
      >
        <div
          style={{ borderColor: activeTheme.borderColor }}
          className="w-full flex border-b items-start justify-start gap-2 p-4 flex-wrap"
        >
          <div className="w-10 h-10 overflow-hidden rounded-full">
            <img
              className="w-full h-full object-cover"
              src={user?.picture as string}
              alt={user.email as string}
            />
          </div>
          <div className="text-sm flex flex-col items-start justify-start ">
            <h3 className="font-bold">{user.name}</h3>
            <h4>{user.email}</h4>
          </div>
          <span
            style={{
              borderColor: activeTheme.borderColor,
              backgroundColor: activeTheme.cardColor,
            }}
            className="ml-auto inline-block px-4 py-1 rounded-2xl border my-2 text-sm"
          >
            {isAdmin ? "Admin" : "User"}
          </span>
        </div>
        <ul className="w-full flex flex-col items-start justify-start gap-4">
          {adminDashboardRoutes.map((route) => {
            return (
              <Link
                key={route.id}
                className="w-full hover:opacity-70 duration-150"
                to={route.name === "Home" ? "/" : `/dashboard/${route.path}`}
              >
                <li
                  style={{
                    backgroundColor:
                      active === route.path
                        ? activeTheme.cardColor
                        : activeTheme.backgroundColor,
                  }}
                  className={
                    "w-full flex justify-start items-start p-2 space-x-2 rounded-md"
                  }
                >
                  <span>{route.icon}</span>
                  <span>{route.name}</span>
                </li>
              </Link>
            );
          })}
        </ul>
      </aside>

      <main
        className="w-full flex flex-col items-start justify-start space-y-4 p-4 lg:p-8"
        style={{ backgroundColor: activeTheme.cardColor }}
      >
        <h1 className="text-2xl font-black my-4">Admin Dashboard</h1>
        <div
          style={{
            backgroundColor: activeTheme.backgroundColor,
            borderColor: activeTheme.borderColor,
          }}
          className="w-full p-4 border flex items-center justify-between rounded-md"
        >
          <h1 className="flex items-center justify-start gap-4">
            Admin{" "}
            <span>
              <ChevronRight size={20} />
            </span>{" "}
            Dashboard{" "}
            <span>
              <ChevronRight size={20} />
            </span>{" "}
            {active}
          </h1>
          <Button
            className="block lg:hidden"
            onClick={() => setIsOpen(!isOpen)}
            type="button"
          >
            {isOpen ? "close" : "menu"}
          </Button>
        </div>
        <div
          className="p-4 w-full border rounded-md"
          style={{
            backgroundColor: activeTheme.backgroundColor,
            borderColor: activeTheme.borderColor,
          }}
        >
          <Outlet />
        </div>
      </main>
    </div>
  );
}

export default ProtectedAdminRoute;
