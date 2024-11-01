import Link from "next/link";
import credentials from "../../../credentials/credentials";
import ShareBtn from "../cards/ShareBtn";
import { LogoutLink } from "@kinde-oss/kinde-auth-nextjs/components";
import Image from "next/image";
import { ModeToggle } from "../../../../components/dark-mode-toggle";
import { HiOutlineLogout } from "react-icons/hi";
import { LuSettings } from "react-icons/lu";

async function Header({ picture, username, userId }) {
  const { isLogged, isAdmin } = await credentials();

  return (
    <header className="w-3/4 m-auto p-4 flex justify-center items-center   max-sm:w-full ">
      <div className="mr-auto">
        <div className="flex justify-start items-center gap-4">
          <Image
            priority
            src={
              picture
                ? picture
                : "https://superstarsculture.com/wp-content/uploads/2023/10/unknown-1-3.jpg"
            }
            width={40}
            height={40}
            alt="profile user image"
            className="w-10 h-10 rounded-full object-cover border-2 "
          />
          <h1 className="text-muted-foreground">{username}</h1>
        </div>
      </div>

      <nav
        className={`flex  items-center gap-4 mr-10 max-sm:hidden max-md:hidden ${
          isLogged ? "justify-end" : "justify-center"
        }`}
      >
        <Link href={`/${userId}/#about`}>About</Link>
        <Link href={`/${userId}/#experiences`}>Experiences</Link>
        <Link href={`/${userId}/#projects`}>Projects</Link>
        <Link href={`/${userId}/#skills`}>Skills</Link>
      </nav>

      <div className="ml-auto ">
        {isLogged ? (
          <div className="flex-1 flex justify-center items-center gap-2 max-md:gap-0">
            <ModeToggle theme={"none"} />
            {isAdmin && isLogged ? (
              <Link
                className="hover:bg-secondary p-2 rounded-md duration-150"
                href={`/${userId}/dashboard/users`}
              >
                Dashboard
              </Link>
            ) : (
              <>
                <Link
                  className="hover:bg-secondary p-2 rounded-md duration-150"
                  href={`/${userId}/profile/bio`}
                >
                  <LuSettings size={20} />
                </Link>
              </>
            )}
            <LogoutLink className="hover:bg-secondary p-2 rounded-md duration-150">
              <HiOutlineLogout aria-label="logout button" size={20} />
            </LogoutLink>
            <ShareBtn />
          </div>
        ) : (
          <div className="flex justify-center items-center gap-4">
            <ModeToggle theme={"none"} />
            <ShareBtn />
          </div>
        )}
      </div>
    </header>
  );
}

export default Header;
