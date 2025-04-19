import { useAuth } from "@/contexts/AuthProvider";
import { Button } from "./ui/button";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import User from "./User";

function Header() {
  const { isLogged } = useAuth();

  const [isScroll, setScroll] = useState(false);
  useEffect(() => {
    window.addEventListener("scroll", () => {
      if (window.scrollY > 20) setScroll(window.scrollY > 20 ? true : false);
    });
    // return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  return (
    <div
      className={`${
        isScroll && "bg-white border-b border-b-zinc-100 z-[999]"
      } w-full border-b-0 flex justify-between items-center p-2 sticky top-0`}
    >
      <h1 className="text-3xl font-black">
        <Link
          className="cursor-pointer hover:text-zinc-600 transition-all"
          to={"/"}
        >
          Folio
        </Link>
      </h1>
      <div>
        {isLogged ? (
          <User dashboard={false} />
        ) : (
          <div className="space-x-4">
            <Button className="cursor-pointer">
              <Link to={"/login"}>Login</Link>
            </Button>

            <Button className="cursor-pointer" variant={"outline"}>
              <Link to={"/signup"}>Signup</Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Header;
