import { useState } from "react";
import { useAuth } from "@/contexts/AuthProvider";
import { Navigate, Outlet, useLocation } from "react-router-dom";

import { ChevronRight, Menu, XIcon } from "lucide-react";

import Sidebar from "@/components/Sidebar";
import { useTheme } from "@/contexts/ThemeProvider";

function ProtectedUserRoute() {
  const { isLogged } = useAuth();
  const { activeTheme } = useTheme();
  const { pathname } = useLocation();
  const activePathName = pathname.split("/").pop();
  const [isOpen, setIsOpen] = useState<boolean>(true);

  if (!isLogged) return <Navigate to={"/login"} />;
  return (
    <div
      style={{ backgroundColor: activeTheme.backgroundColor }}
      className="w-full max-w-full h-screen flex justify-center items-center lg:grid lg:gap-4  lg:grid-cols-[20%_1fr]"
    >
      <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} />
      <main
        style={{
          backgroundColor: activeTheme.cardColor,
          color: activeTheme.primaryText,
        }}
        className="w-full overflow-hidden absolute top-0 right-0 min-h-screen lg:w-[75%] p-4 space-y-2"
      >
        <div
          style={{
            backgroundColor: activeTheme.backgroundColor,
            color: activeTheme.primaryText,
            border: `1px solid ${activeTheme.borderColor}`,
          }}
          className="p-4 w-full rounded-md flex items-center justify-start gap-2  text-sm  "
        >
          <h1 className="text-xl lg:text-4xl text-nowrap font-black my-4">
            User Dashboard
          </h1>
          <span
            role="button"
            onClick={() => {
              setIsOpen(!isOpen);
            }}
            className="lg:hidden w-full  flex justify-end items-center cursor-pointer ml-auto"
          >
            {isOpen ? <Menu /> : <XIcon />}
          </span>
        </div>
        <div
          style={{
            backgroundColor: activeTheme.backgroundColor,
            color: activeTheme.primaryText,
            border: `1px solid ${activeTheme.borderColor}`,
          }}
          className="p-4 w-full rounded-md flex items-center justify-start gap-2  text-sm  "
        >
          <span>Profile</span>
          <span>
            <ChevronRight size={20} />
          </span>
          <span>{activePathName}</span>
        </div>
        <div
          style={{
            backgroundColor: activeTheme.backgroundColor,
            color: activeTheme.primaryText,
            border: `1px solid ${activeTheme.borderColor}`,
          }}
          className="p-4  rounded-md min-h-full"
        >
          <Outlet />
        </div>
      </main>
    </div>
  );
}

export default ProtectedUserRoute;
