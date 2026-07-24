import { useState } from "react";
import { useAuth } from "@/contexts/AuthProvider";
import { Navigate, Outlet, useLocation } from "react-router-dom";

import { ChevronRight, Menu, X } from "lucide-react";

import Sidebar from "@/components/Sidebar";
import { useTheme } from "@/contexts/ThemeProvider";

function ProtectedUserRoute() {
  const { isLogged, isAdmin } = useAuth();
  const { activeTheme } = useTheme();
  const { pathname } = useLocation();
  const activePathName = pathname.split("/").pop();
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(true);

  if (!isLogged) return <Navigate to={"/login"} />;
  if (isAdmin) return <Navigate to={"/dashboard/insights"} />;

  const pageTitle = activePathName
    ? activePathName.charAt(0).toUpperCase() + activePathName.slice(1)
    : "Dashboard";

  return (
    <div
      style={{ backgroundColor: activeTheme.backgroundColor }}
      className="flex min-h-screen"
    >
      <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />

      <main className="flex-1 flex flex-col min-w-0">
        <header
          style={{
            backgroundColor: activeTheme.backgroundColor,
            borderBottom: `1px solid ${activeTheme.borderColor}`,
          }}
          className="sticky top-0 z-40 flex items-center gap-3 px-4 lg:px-6 py-3"
        >
          <button
            className="lg:hidden p-1.5 rounded-md hover:opacity-70 cursor-pointer"
            style={{ color: activeTheme.primaryText }}
            onClick={() => setSidebarOpen(!sidebarOpen)}
            aria-label="Toggle sidebar"
          >
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>

          <div className="flex items-center gap-2 text-sm">
            <span
              className="font-medium"
              style={{ color: activeTheme.secondaryText }}
            >
              Profile
            </span>
            <ChevronRight
              size={14}
              style={{ color: activeTheme.secondaryText }}
            />
            <span
              className="font-semibold capitalize"
              style={{ color: activeTheme.primaryText }}
            >
              {activePathName || "Dashboard"}
            </span>
          </div>
        </header>

        <div
          className="flex-1 p-4 lg:p-6 overflow-auto"
          style={{
            backgroundColor: activeTheme.cardColor,
            color: activeTheme.primaryText,
          }}
        >
          <h1 className="text-xl lg:text-2xl font-bold mb-6">{pageTitle}</h1>
          <Outlet />
        </div>
      </main>
    </div>
  );
}

export default ProtectedUserRoute;
