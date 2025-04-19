import { useAuth } from "@/contexts/AuthProvider";
import { Navigate, Outlet } from "react-router-dom";

function ProtectedAdminRoute() {
  const { user, isLogged } = useAuth();
  const isAdmin = user.role === "ADMIN" ? true : false;
  if (!isLogged) return <Navigate to={"/login"} />;
  if (!isAdmin) return <Navigate to={"/"} />;
  return <Outlet />;
}

export default ProtectedAdminRoute;
