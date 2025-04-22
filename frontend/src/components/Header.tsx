import { useAuth } from "@/contexts/AuthProvider";
import { Button } from "./ui/button";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import User from "./User";
import { useTheme } from "@/contexts/ThemeProvider";
import Logo from "./Logo";

function Header() {
  const { isLogged } = useAuth();
  const { activeTheme } = useTheme();

  const [isScroll, setScroll] = useState(false);
  useEffect(() => {
    window.addEventListener("scroll", () => {
      if (window.scrollY > 20) setScroll(window.scrollY > 20 ? true : false);
    });
    // return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  return (
    <div
      style={{
        backgroundColor: activeTheme.backgroundColor,
        // borderBottom: `1px solid ${activeTheme.borderColor}`,
      }}
      className={`${
        isScroll && " border-bz-[999]"
      } w-full border-b-0 flex justify-between items-center px-4 py-8 sticky top-0`}
    >
      <Logo />
      <div>
        {isLogged ? (
          <User dashboard={false} />
        ) : (
          <div className="space-x-4">
            <Button
              style={{
                backgroundColor: activeTheme.backgroundColor,
                color: activeTheme.primaryText,
                border: activeTheme.borderColor,
              }}
              className="cursor-pointer border hover:opacity-75 duration-150 shadow-md"
            >
              <Link to={"/login"}>Login</Link>
            </Button>

            <Button
              style={{
                backgroundColor: activeTheme.primaryText,
                color: activeTheme.backgroundColor,
                borderColor: activeTheme.borderColor,
              }}
              className="cursor-pointer border hover:opacity-75 duration-150 shadow-md"
              variant={"outline"}
            >
              <Link to={"/signup"}>Signup</Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Header;
