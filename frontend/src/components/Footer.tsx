import { useTheme } from "@/contexts/ThemeProvider";

import Logo from "./Logo";
import User from "./User";
import { useAuth } from "@/contexts/AuthProvider";
import { Link } from "react-router-dom";
import { Button } from "./ui/button";

function Footer() {
  const { activeTheme } = useTheme();
  const { isLogged } = useAuth();
  return (
    <footer
      className="w-full flex items-center justify-center mt-auto"
      style={{
        backgroundColor: activeTheme.cardColor,
        color: activeTheme.primaryText,
      }}
    >
      <div className="lg:w-3/4 w-[90%] mx-auto  py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-1">
            <Logo />
            <p className=" text-sm mb-6 mt-4">
              Showcase your creative work with a professional portfolio. Build,
              share, and grow your online presence with our easy-to-use
              platform.
            </p>
          </div>

          <div>
            <h3
              style={{ color: activeTheme.primaryText }}
              className="font-semibold  mb-4"
            >
              Resources
            </h3>
            <ul className="space-y-3">
              <li>
                <a href="#" className=" text-sm hover:opacity-75 duration-150">
                  Documentation
                </a>
              </li>
              <li>
                <a href="#" className=" text-sm hover:opacity-75 duration-150">
                  Templates
                </a>
              </li>
              <li>
                <a href="#" className=" text-sm hover:opacity-75 duration-150">
                  Tutorials
                </a>
              </li>
              <li>
                <a href="#" className=" text-sm hover:opacity-75 duration-150">
                  API Reference
                </a>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3
              style={{ color: activeTheme.primaryText }}
              className="font-semiboldmb-4"
            >
              Company
            </h3>
            <ul className="space-y-3">
              <li>
                <a href="#" className=" text-sm hover:opacity-75 duration-150">
                  About Us
                </a>
              </li>
              <li>
                <a href="#" className="text-sm hover:opacity-75 duration-150">
                  Careers
                </a>
              </li>
              <li>
                <a href="#" className="text-sm hover:opacity-75 duration-150">
                  Blog
                </a>
              </li>
              <li>
                <a href="#" className="text-sm hover:opacity-75 duration-150">
                  Contact
                </a>
              </li>
            </ul>
          </div>

          <div className="flex items-end flex-col justify-center gap-4">
            {isLogged ? (
              <User dashboard={true} />
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

        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="text-sm mb-4 md:mb-0">
            © {new Date().getFullYear()} Folio. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
