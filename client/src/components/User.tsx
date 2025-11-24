import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Link } from "react-router-dom";
import { IUserType } from "@/lib/types";
import { useAuth } from "@/contexts/AuthProvider";
import { useTheme } from "@/contexts/ThemeProvider";
import { useState, useRef, useEffect } from "react";
import { easeInOut, motion, AnimatePresence } from "motion/react";

import { User as UserIcon, LogOut, LayoutDashboard } from "lucide-react";

import Image from "./ui/image";

function User({ dashboard = false }: { dashboard?: boolean }) {
  const { user, isLogged, isAdmin, logout } = useAuth();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const [imgError, setImgError] = useState<boolean>(false);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!isLogged) {
    return (
      <div className="flex items-center gap-4">
        <Button variant="outline" asChild>
          <Link to="/login">Sign In</Link>
        </Button>
        <Button asChild>
          <Link to="/register">Get Started</Link>
        </Button>
      </div>
    );
  }

  return (
    <div ref={menuRef} className="relative">
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 cursor-pointer group"
      >
        <div
          className={`flex items-center gap-3 ${
            dashboard ? "flex-row-reverse" : ""
          }`}
        >
          <div className="relative">
            {user.picture && !imgError && (
              <Image
                className="rounded-full w-10 h-10 object-cover border-2 border-transparent group-hover:border-primary transition-all duration-200 cursor-pointer shadow-sm"
                src={user.picture}
                alt={`${user.name ?? "User"}'s profile`}
                onError={() => setImgError(true)}
              />
            )}
          </div>

          {dashboard && (
            <div className="flex flex-col items-end">
              <span className="hidden lg:block md:block text-sm ">
                {user.email}
              </span>
            </div>
          )}
        </div>
      </div>

      <AnimatePresence>
        {isOpen && !dashboard && (
          <UserMenu
            user={user}
            isAdmin={isAdmin}
            logout={logout}
            onClose={() => setIsOpen(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function UserProfileFallback({ name }: { name: string }) {
  const { activeTheme, defaultTheme } = useTheme();
  const theme = activeTheme || defaultTheme;

  return (
    <div
      className="w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold text-sm"
      style={{
        backgroundColor: theme.borderColor || "#3B82F6",
      }}
    >
      {name.charAt(0).toUpperCase()}
    </div>
  );
}

function UserMenu({
  user,
  isAdmin,
  logout,
  onClose,
  className = "",
}: {
  user: IUserType;
  isAdmin: boolean;
  logout: () => void;
  onClose: () => void;
  className?: string;
}) {
  const { activeTheme, defaultTheme } = useTheme();
  const theme = activeTheme || defaultTheme;

  const menuItems = [
    {
      icon: isAdmin ? <LayoutDashboard size={18} /> : <UserIcon size={18} />,
      label: isAdmin ? "Dashboard" : "Profile",
      href: isAdmin ? "/dashboard/insights" : "/profile/bio",
    },
  ];

  const handleLogout = () => {
    logout();
    onClose();
  };

  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0, y: -10 }}
      animate={{ scale: 1, opacity: 1, y: 0 }}
      exit={{ scale: 0.8, opacity: 0, y: -10 }}
      transition={{ duration: 0.2, ease: easeInOut }}
      className="absolute top-12 right-0 z-50 min-w-64"
    >
      <Card
        style={{
          backgroundColor: theme.cardColor,
          borderColor: theme.borderColor,
        }}
        className={`${className} p-2 shadow-lg border`}
      >
        {" "}
        <div
          className="p-3 border-b"
          style={{ borderColor: theme.borderColor }}
        >
          <div className="flex items-center gap-3">
            {user.picture ? (
              <Image
                className="rounded-full w-12 h-12 object-cover"
                src={user.picture}
                alt={user.name ?? "User"}
              />
            ) : (
              <UserProfileFallback name={user.name ?? "User"} />
            )}
            <div className="flex-1 min-w-0">
              <p
                className="font-semibold truncate"
                style={{ color: theme.primaryText }}
              >
                {user.name}
              </p>
              <p
                className="text-sm truncate"
                style={{ color: theme.secondaryText }}
              >
                {user.email}
              </p>
              <span
                className="inline-block px-2 py-1 text-xs rounded-full mt-1"
                style={{
                  backgroundColor: theme.borderColor,
                  color: theme.primaryText,
                }}
              >
                {isAdmin ? "Administrator" : "User"}
              </span>
            </div>
          </div>
        </div>
        <ul className="p-2 space-y-1">
          {menuItems.map((item) => (
            <motion.li
              key={item.label}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Link
                to={item.href}
                onClick={onClose}
                className="flex items-center gap-3 p-2 rounded-md transition-colors cursor-pointer"
                style={{
                  color: theme.secondaryText,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = theme.backgroundColor;
                  e.currentTarget.style.color = theme.primaryText;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "transparent";
                  e.currentTarget.style.color = theme.secondaryText;
                }}
              >
                {item.icon}
                <span className="font-medium">{item.label}</span>
              </Link>
            </motion.li>
          ))}
        </ul>
        <div
          className="p-2 border-t"
          style={{ borderColor: theme.borderColor }}
        >
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button
              onClick={handleLogout}
              variant="outline"
              className="w-full flex items-center gap-3 cursor-pointer border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
            >
              <LogOut size={18} />
              <span>Sign Out</span>
            </Button>
          </motion.div>
        </div>
      </Card>
    </motion.div>
  );
}

export default User;
