import { useTheme } from "@/contexts/ThemeProvider";

import Logo from "./Logo";

import { useAuth } from "@/contexts/AuthProvider";
import { Link } from "react-router-dom";
import { Button } from "./ui/button";

function Footer() {
  const { activeTheme } = useTheme();
  const { isLogged, user } = useAuth();
  return (
    <footer
      className="w-full flex items-center justify-center mt-auto"
      style={{
        backgroundColor: activeTheme.cardColor,
        color: activeTheme.primaryText,
      }}
    >
      <div className="lg:w-3/4 w-[90%] mx-auto  py-12">
        <div className="flex justify-between items-start lg:items-center flex-col md:flex-row lg:flex-row">
          <div className="md:col-span-1 w-full lg:w-1/2">
            <Logo />
            <p className=" text-sm mb-6 mt-4 w-full lg:w-1/2">
              Showcase your creative work with a professional portfolio. Build,
              share, and grow your online presence with our easy-to-use
              platform.
            </p>
          </div>

          <div className="flex items-end flex-col justify-center gap-2">
            {isLogged ? (
              <div className="flex items-center gap-2 py-4">
                <div className="w-10 h-10 rounded-full overflow-hidden">
                  <img
                    className="object-cover w-full h-full"
                    width={40}
                    height={40}
                    src={user?.picture as string}
                    alt={user.name as string}
                  />
                </div>
                <div>
                  <h3 className="text-sm font-bold">{user.name}</h3>
                  <h4 className="text-sm">{user.email}</h4>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-start justify-start gap-4">
                <Link className="w-full" to={"/login"}>
                  <Button className="w-full">Login</Button>
                </Link>{" "}
                <Link className="w-full" to={"/signup"}>
                  <Button className="w-full">Create Account</Button>
                </Link>
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-start lg:items-center">
          <div className="text-sm mb-4 md:mb-0">
            © {new Date().getFullYear()} Folio. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
