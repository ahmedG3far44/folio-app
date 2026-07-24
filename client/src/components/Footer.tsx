import { useAuth } from "@/contexts/AuthProvider";
import { useTheme } from "@/contexts/ThemeProvider";

import SecondaryBtn from "./buttons/SecondaryBtn";
import PrimaryBtn from "./buttons/PrimaryBtn";

import Logo from "./Logo";
import Image from "./ui/image";

function Footer() {
  const { activeTheme } = useTheme();
  const { isLogged, user } = useAuth();
  return (
    <footer
      className="w-full mt-16 md:mt-24"
      style={{
        backgroundColor: activeTheme.cardColor,
        color: activeTheme.primaryText,
        borderTop: `1px solid ${activeTheme.borderColor}`,
      }}
    >
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 md:gap-0">
          <div className="max-w-sm">
            <Logo />
            <p className="text-sm mt-3 leading-relaxed opacity-70">
              Showcase your creative work with a professional portfolio. Build, share, and grow your online presence.
            </p>
          </div>

          <div className="flex flex-col items-start md:items-end gap-3">
            {isLogged ? (
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full overflow-hidden shrink-0">
                  <Image
                    className="object-cover w-full h-full"
                    width={40}
                    height={40}
                    src={user?.picture as string}
                    alt={user.name as string}
                  />
                </div>
                <div className="text-sm">
                  <p className="font-semibold">{user.name}</p>
                  <p className="opacity-60">{user.email}</p>
                </div>
              </div>
            ) : (
              <div className="flex flex-col sm:flex-row gap-3">
                <PrimaryBtn path="login">Login</PrimaryBtn>
                <SecondaryBtn path="signup">Create Account</SecondaryBtn>
              </div>
            )}
          </div>
        </div>
        <div className="mt-8 pt-6 border-t text-sm opacity-50 text-center md:text-left"
          style={{ borderColor: activeTheme.borderColor }}
        >
          &copy; {new Date().getFullYear()} Folio. All rights reserved.
        </div>
      </div>
    </footer>
  );
}

export default Footer;
