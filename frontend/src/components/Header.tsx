import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthProvider";
import { useTheme } from "@/contexts/ThemeProvider";

import { Button } from "./ui/button";
import { Link } from "react-router-dom";

import { CopyCheck, Share2 } from "lucide-react";

import User from "./User";
import Logo from "./Logo";

const LOCAL_DOMAIN = import.meta.env.VITE_LOCAL_DOMAIN as string;
const PRODUCTION_DOMAIN = import.meta.env.VITE_LOCAL_DOMAIN as string;
const ENV = import.meta.env.VITE_ENV as string;


function Header() {
  const { isLogged, user } = useAuth();
  const { activeTheme } = useTheme();

  const [isScroll, setScroll] = useState(false);
  const [isCopied, setCopy] = useState(false);
  useEffect(() => {
    window.addEventListener("scroll", () => {
      if (window.scrollY > 20) setScroll(window.scrollY > 20 ? true : false);
    });
    // return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSharePortfolio = () => {
    if (isLogged) {
      setCopy(true);
      navigator.clipboard.writeText(
        `${ENV === "development" ? LOCAL_DOMAIN : PRODUCTION_DOMAIN}/${user.id}`
      );
      setTimeout(() => {
        setCopy(false);
      }, 2000);
    }
  };
  return (
    <div
      className={`${
        isScroll && " border-b z-[999]"
      } w-full border-b-0 flex justify-between items-center px-4 py-8 sticky top-0 z-[999]`}
    >
      <Logo />
      <div>
        {isLogged ? (
          <div className="flex items-center space-x-4">
            <User dashboard={false} />
            <Button className="flex items-center justify-center" onClick={handleSharePortfolio}>
              {isCopied ? <CopyCheck size={20} /> : <Share2 size={20} />}
            </Button>
          </div>
        ) : (
          <div className="space-x-4">
            <div className="space-x-4">
              <Button
                style={{
                  backgroundColor: activeTheme.backgroundColor,
                  color: activeTheme.primaryText,
                  borderColor: activeTheme.borderColor,
                }}
                className="cursor-pointer border hover:opacity-75 duration-150 shadow-xl"
              >
                <Link to={"/login"}>Login</Link>
              </Button>

              <Button
                style={{
                  backgroundColor: activeTheme.primaryText,
                  color: activeTheme.backgroundColor,
                  borderColor: activeTheme.borderColor,
                }}
                className="cursor-pointer border hover:opacity-75 duration-150 shadow-xl"
                variant={"outline"}
              >
                <Link to={"/signup"}>Signup</Link>
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Header;
