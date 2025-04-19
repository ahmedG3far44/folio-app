import { useAuth } from "@/contexts/AuthProvider";
import { Navigate, Outlet, useLocation } from "react-router-dom";
// import { Button } from "@/components/ui/button";
import Sidebar from "@/components/Sidebar";
import { useState } from "react";

import { ArrowBigRightIcon } from "lucide-react";

function ProtectedUserRoute() {
  const { isLogged } = useAuth();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const { pathname } = useLocation();
  const activePathName = pathname.split("/").pop();

  if (!isLogged) return <Navigate to={"/login"} />;
  return (
    <div className="w-full max-w-full h-screen flex justify-center items-center lg:grid lg:gap-4  lg:grid-cols-[20%_1fr]">
      <Sidebar isOpen={isOpen} />
      <main className="w-full min-h-screen lg:w-full bg-zinc-300 p-4 space-y-2">
        <h1 className="text-2xl font-black my-4">User Dashboard</h1>
        <span
          role="button"
          onClick={() => {
            console.log("hello ");
            setIsOpen(!isOpen);
          }}
          className="lg:hidden block cursor-pointer"
        >
          {isOpen ? "Menu" : "Close"}
        </span>
        <div className="p-4 w-full rounded-md flex items-center justify-start gap-4 text-sm bg-white text-zinc-700">
          <span>Profile</span>
          <span>
            <ArrowBigRightIcon size={20} />
          </span>
          <span>{activePathName}</span>
        </div>
        <div className="p-4 bg-white rounded-md min-h-full">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

export default ProtectedUserRoute;
