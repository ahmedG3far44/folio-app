import { useAuth } from "@/contexts/AuthProvider";
import { IUserType } from "@/lib/types";
import { Card } from "./ui/card";
import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import { useState } from "react";
import { useTheme } from "@/contexts/ThemeProvider";

function User({ dashboard }: { dashboard: boolean }) {
  const { user, isLogged, isAdmin, logout } = useAuth();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  return (
    <div>
      {isLogged ? (
        <div onClick={() => setIsOpen(!isOpen)} className="relative ">
          <div className="flex flex-row-reverse items-center justify-center gap-4 ">
            <img
              role="button"
              className="rounded-full w-10 h-10 object-cover object-center hover:scale-110 transition-all duration-150 cursor-pointer"
              src={user.picture as string}
              alt={user.role}
            />
            <>
              {dashboard ? (
                <div className="flex flex-col items-end">
                  <h1 className="text-xl font-semibold  duration-150 transition-all">
                    <span>{user.name}</span>
                  </h1>
                  <span className="text-sm">{user.email}</span>
                </div>
              ) : (
                <Link
                  className="text-xl font-semibold  duration-150 transition-all hover:opacity-75 "
                  to={`/${user.id}`}
                >
                  {user.name}
                </Link>
              )}
            </>
          </div>

          {isOpen && !dashboard && (
            <UserMenu user={user} isAdmin={isAdmin} logout={logout} />
          )}
        </div>
      ) : (
        <></>
      )}
    </div>
  );
}

function UserMenu({
  user,
  className,
  isAdmin,
  logout,
}: {
  user: IUserType;
  className?: string;
  isAdmin: boolean;
  logout: () => void;
}) {
  const { activeTheme } = useTheme();
  return (
    <Card
      style={{
        backgroundColor: activeTheme.cardColor,
        color: activeTheme.secondaryText,
        borderColor: activeTheme.borderColor,
      }}
      className={`${className} animate-scale p-2 flex-col justify-start items-start gap-1 rounded-md border absolute top-12 right-0 z-50 `}
    >
      <ul className={`text-sm font-semibold`}>
        <li className="w-full p-2 cursor-pointer hover:opacity-75 duration-150">
          {isAdmin ? (
            <Link to={`/dashboard/insights`}>Dashboard</Link>
          ) : (
            <Link to={`/profile/bio`}>Profile</Link>
          )}
        </li>
        <li className="w-full p-2 cursor-pointer hover:opacity-75 duration-150">
          {user.email}
        </li>
        <li className=" w-full p-2 cursor-pointer hover:opacity-75 duration-150">
          <Button onClick={logout} className="w-full cursor-pointer">
            Logout
          </Button>
        </li>
      </ul>
    </Card>
  );
}

export default User;
