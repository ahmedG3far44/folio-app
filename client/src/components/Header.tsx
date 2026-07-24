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
    const handleScroll = () => setScroll(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSharePortfolio = () => {
    if (isLogged) {
      setCopy(true);
      const { host, protocol } = window.location;
      const url = `${protocol}//${host}`;
      navigator.clipboard.writeText(`${url}/${user.id}`);
      setTimeout(() => setCopy(false), 2000);
    }
  };

  return (
    <header
      className={`w-full flex justify-between items-center px-0 py-5 md:py-7 sticky top-0 z-50 transition-all duration-200 ${
        isScroll ? "border-b" : "border-b-0"
      }`}
      style={{
        backgroundColor: isScroll ? `${activeTheme.backgroundColor}dd` : activeTheme.backgroundColor,
        borderColor: activeTheme.borderColor,
        backdropFilter: isScroll ? "blur(8px)" : "none",
        color: activeTheme.primaryText,
      }}
    >
      <Logo />
      <div>
        {isLogged ? (
          <div className="flex items-center gap-3">
            <User dashboard={false} />
            <button
              style={{
                color: activeTheme.primaryText,
                borderColor: activeTheme.borderColor,
              }}
              className="flex items-center justify-center border p-2 rounded-lg cursor-pointer hover:opacity-70 transition-opacity"
              onClick={handleSharePortfolio}
              aria-label="Copy portfolio link"
            >
              {isCopied ? (
                <CopyCheck size={16} />
              ) : (
                <Share2 size={16} />
              )}
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <PrimaryBtn path="login">Login</PrimaryBtn>
            <SecondaryBtn path="signup">Sign Up</SecondaryBtn>
          </div>
        )}
      </div>
    </header>
  );
}

export default Header;
