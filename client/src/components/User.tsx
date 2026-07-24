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
      <div className="flex items-center gap-3">
        <Button variant="outline" asChild size="sm">
          <Link to="/login">Sign In</Link>
        </Button>
        <Button asChild size="sm">
          <Link to="/signup">Get Started</Link>
        </Button>
      </div>
    );
  }

  return (
    <div ref={menuRef} className="relative">
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 cursor-pointer group"
      >
        <div
          className={`flex items-center gap-2 ${
            dashboard ? "flex-row-reverse" : ""
          }`}
        >
          <div className="relative">
            {user.picture && !imgError ? (
              <Image
                className="rounded-full w-8 h-8 object-cover border transition-all duration-200 cursor-pointer"
                src={user.picture}
                alt={`${user.name ?? "User"}'s profile`}
                onError={() => setImgError(true)}
              />
            ) : (
              <UserProfileFallback name={user.name ?? "User"} />
            )}
          </div>

          {dashboard && (
            <div className="flex flex-col items-end">
              <span className="hidden lg:block text-xs">{user.email}</span>
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
      className="w-8 h-8 rounded-full flex items-center justify-center text-white font-semibold text-xs"
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
}: {
  user: IUserType;
  isAdmin: boolean;
  logout: () => void;
  onClose: () => void;
}) {
  const { activeTheme, defaultTheme } = useTheme();
  const theme = activeTheme || defaultTheme;

  const menuItems = [
    {
      icon: isAdmin ? <LayoutDashboard size={14} /> : <UserIcon size={14} />,
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
      initial={{ scale: 0.9, opacity: 0, y: -6 }}
      animate={{ scale: 1, opacity: 1, y: 0 }}
      exit={{ scale: 0.9, opacity: 0, y: -6 }}
      transition={{ duration: 0.15, ease: easeInOut }}
      className="absolute top-10 right-0 z-50 min-w-44"
    >
      <div
        className="rounded-lg border shadow-md overflow-hidden"
        style={{
          backgroundColor: theme.cardColor,
          borderColor: theme.borderColor,
        }}
      >
        <div
          className="px-3 py-2 border-b flex items-center gap-2"
          style={{ borderColor: theme.borderColor }}
        >
          {user.picture ? (
            <Image
              className="rounded-full w-7 h-7 object-cover shrink-0"
              src={user.picture}
              alt={user.name ?? "User"}
            />
          ) : (
            <UserProfileFallback name={user.name ?? "User"} />
          )}
          <div className="min-w-0 flex-1">
            <p className="text-xs font-medium truncate" style={{ color: theme.primaryText }}>
              {user.name}
            </p>
            <p className="text-[11px] truncate" style={{ color: theme.secondaryText }}>
              {user.email}
            </p>
          </div>
        </div>

        <ul className="py-1">
          {menuItems.map((item) => (
            <li key={item.label}>
              <Link
                to={item.href}
                onClick={onClose}
                className="flex items-center gap-2 px-3 py-1.5 text-xs transition-colors cursor-pointer"
                style={{ color: theme.secondaryText }}
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
                <span>{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>

        <div className="border-t" style={{ borderColor: theme.borderColor }}>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-3 py-1.5 text-xs transition-colors cursor-pointer"
            style={{ color: theme.secondaryText }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = theme.backgroundColor;
              e.currentTarget.style.color = theme.primaryText;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "transparent";
              e.currentTarget.style.color = theme.secondaryText;
            }}
          >
            <LogOut size={14} />
            Sign Out
          </button>
        </div>
      </div>
    </motion.div>
  );
}

export default User;
