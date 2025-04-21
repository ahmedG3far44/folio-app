import { useAuth } from "@/contexts/AuthProvider";
import { Button } from "./ui/button";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import User from "./User";
import { useTheme } from "@/contexts/ThemeProvider";

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
      } w-full border-b-0 flex justify-between items-center p-2 sticky top-0`}
    >
      <h1 className="text-3xl font-black">
        <Link
          className="cursor-pointer hover:text-zinc-600 transition-all flex items-center gap-2"
          to={"/"}
        >
          <img
            width={40}
            height={40}
            src="../../public/icon(2).svg"
            alt="logo app"
          />
          Folio
        </Link>
      </h1>
      <div>
        {isLogged ? (
          <User dashboard={false} />
        ) : (
          <div className="space-x-4">
            <Button
              style={{
                backgroundColor: activeTheme.backgroundColor,
                color: activeTheme.primaryText,
                border:activeTheme.borderColor
              }}
              className="cursor-pointer border hover:opacity-75 duration-150 shadow-md"
            >
              <Link to={"/login"}>Login</Link>
            </Button>

            <Button
              style={{
                backgroundColor: activeTheme.primaryText,
                color: activeTheme.backgroundColor,
                borderColor:activeTheme.borderColor
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
