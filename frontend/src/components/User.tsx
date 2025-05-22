import { useAuth } from "@/contexts/AuthProvider";
import { IUserType } from "@/lib/types";
import { Card } from "./ui/card";
import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import { useState } from "react";
import { useTheme } from "@/contexts/ThemeProvider";
import { easeInOut, motion } from "motion/react";

function User({ dashboard }: { dashboard?: boolean }) {
  const { user, isLogged, isAdmin, logout } = useAuth();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  return (
    <div>
      {isLogged ? (
        <div onClick={() => setIsOpen(!isOpen)} className="relative">
          <div className="flex flex-row-reverse items-center justify-center gap-4 ">
            <img
              role="button"
              className="rounded-full w-10 h-10 object-cover object-center hover:scale-110 transition-all duration-150 cursor-pointer"
              src={user.picture as string}
              alt={user.role}
            />
            <>
              {dashboard ? (
                <div className="flex flex-col items-end ">
                  <h1 className="hidden lg:block md:block text-xl font-semibold  duration-150 transition-all">
                    <span>{user.name}</span>
                  </h1>
                  <span className="text-sm">{user.email}</span>
                </div>
              ) : (
                <Link
                  className="hidden lg:block md:block text-xl font-semibold  duration-150 transition-all hover:opacity-75 "
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
    <motion.div
      initial={{
        scale: 0,
        opacity: 0,
      }}
      animate={{
        scale: 1,
        opacity: 1,
      }}
      transition={{ duration: 0.4, ease: easeInOut }}
      exit={{ scale: 0, opacity: 0 }}
      className="p-2 flex-col justify-start items-start gap-1 rounded-md  absolute top-10  mt-2 right-0 z-50 "
    >
      <Card
        style={{
          backgroundColor: activeTheme.cardColor,
          color: activeTheme.secondaryText,
          borderColor: activeTheme.borderColor,
        }}
        className={`${className} p-4`}
      >
        <ul className={`flex flex-col items-start gap-1 text-sm font-semibold`}>
          <motion.li
            whileHover={{
              backgroundColor: activeTheme.backgroundColor,
              color: activeTheme.primaryText,
            }}
            className="w-full p-2 cursor-pointer  duration-150 rounded-md"
          >
            <Link
              to={isAdmin ? "/dashboard/insights" : "/profile/bio"}
              className="w-full cursor-pointer  duration-150 rounded-md"
            >
              {isAdmin ? "Dashboard" : "Profile"}
            </Link>
          </motion.li>
          <motion.li
            whileHover={{
              backgroundColor: activeTheme.backgroundColor,
              color: activeTheme.primaryText,
            }}
            className="w-full p-2 cursor-pointer duration-150 rounded-md"
          >
            {user.email}
          </motion.li>
          <motion.li
            whileHover={{
              backgroundColor: activeTheme.backgroundColor,
              color: activeTheme.primaryText,
            }}
            className=" w-full  cursor-pointer  duration-150 rounded-md"
          >
            <Button onClick={logout} className="w-full cursor-pointer">
              Logout
            </Button>
          </motion.li>
        </ul>
      </Card>
    </motion.div>
  );
}

export default User;
