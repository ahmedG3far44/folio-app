import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthProvider";
import { useTheme } from "@/contexts/ThemeProvider";

import { CopyCheck, Share2 } from "lucide-react";

import User from "./User";
import Logo from "./Logo";
import PrimaryBtn from "./buttons/PrimaryBtn";
import SecondaryBtn from "./buttons/SecondaryBtn";

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
      const { host, protocol } = window.location;
      const url = `${protocol}//${host}`;
      navigator.clipboard.writeText(`${url}/${user.id}`);
      setTimeout(() => {
        setCopy(false);
      }, 2000);
    }
  };
  return (
    <div
      style={{ backgroundColor: activeTheme.backgroundColor }}
      className={`${
        isScroll && " border-b z-[999] "
      } w-full border-b-0 flex justify-between items-center px-4 py-8 sticky top-0 z-[999]`}
    >
      <Logo />
      <div>
        {isLogged ? (
          <div className="flex items-center space-x-4">
            <User dashboard={false} />
            <button
              style={{
                color: activeTheme.primaryText,
                borderColor: activeTheme.borderColor,
              }}
              className="flex items-center justify-center border p-2 rounded-md cursor-pointer hover:opacity-70 duration-150"
              onClick={handleSharePortfolio}
            >
              {isCopied ? (
                <CopyCheck size={15} />
              ) : (
                <Share2 color={activeTheme.secondaryText} size={15} />
              )}
            </button>
          </div>
        ) : (
          <div className="space-x-4">
            <div className="space-x-4">
              <PrimaryBtn path="login">login</PrimaryBtn>
              <SecondaryBtn path="signup">signup</SecondaryBtn>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Header;
