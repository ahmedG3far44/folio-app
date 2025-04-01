"use client";

import { LogoutLink } from "@kinde-oss/kinde-auth-nextjs/components";
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
import { useParams, usePathname } from "next/navigation";
import Link from "next/link";
import { ModeToggle } from "@themes/dark-mode-toggle";
import AsideProfile from "@components/ui/nav/AsideProfile";
import MobileMenuBar from "@components/ui/nav/MobileMenuBar";
import User from "@cards/User";
import {
  LucideLogOut,
  Box,
  ChartColumnBig,
  Atom,
  BrainCircuit,
  ClipboardList,
  MessageSquareText,
  House,
} from "lucide-react";
function layout({ children }) {
  const { getUser, getPermission, isLoading } = useKindeBrowserClient();
  const user = getUser();
  const isAdmin = getPermission("admin:access").isGranted;

  const pathName = usePathname();
  const { userId } = useParams();
  const profileRoutes = [
    {
      path: `/${userId}`,
      name: "Home",
      icon: <House size={20} />,
    },
    {
      path: `/${userId}/profile/bio`,
      name: "Bio",
      icon: <BrainCircuit size={20} />,
    },
    {
      path: `/${userId}/profile/experiences`,
      name: "Experiences",
      icon: <ClipboardList size={20} />,
    },
    {
      path: `/${userId}/profile/projects`,
      name: "Projects",
      icon: <Box size={20} />,
    },
    {
      path: `/${userId}/profile/skills`,
      name: "Skills",
      icon: <Atom size={20} />,
    },
    {
      path: `/${userId}/profile/testimonials`,
      name: "Testimonials",
      icon: <MessageSquareText size={20} />,
    },
  ];
  return (
    <section className="w-screen max-w-full h-auto min-h-screen flex justify-center items-start gap-10 relative max-sm:static max-sm:flex-col max-sm:items-center max-md:flex-col max-md:items-center">
      <AsideProfile
        className={
          "fixed left-0 top-0 min-h-screen flex flex-col lg:flex max-sm:hidden max-md:hidden"
        }
      >
        <div className="w-full flex flex-col justify-center items-center gap-20">
          <div className="w-full m-auto">
            <User
              name={`${user?.given_name} ${user?.family_name}`}
              picture={user?.picture}
              isAdmin={isAdmin}
              isLoading={isLoading}
            />
          </div>

          <ul className="w-full flex flex-col  m-auto">
            {profileRoutes.map((route, index) => {
              const activeRoute = pathName?.split("/")[3];
              return (
                <li
                  key={index}
                  className="w-full flex justify-start items-center gap-10 p-2 hover:text-muted-foreground duration-150"
                >
                  {activeRoute === route.name.toLocaleLowerCase() ? (
                    <Link href={route.path}>
                      <h1
                        className={`w-full flex gap-2 rounded-md text-purple-400  justify-center items-center`}
                      >
                        <span className="  font-semibold text-md">
                          {route.icon}
                        </span>
                        <span className="font-semibold text-md">
                          {route.name}
                        </span>
                      </h1>
                    </Link>
                  ) : (
                    <Link
                      className={`w-full flex justify-start items-center gap-2 rounded-md`}
                      href={route.path}
                    >
                      <span className="  font-semibold text-md">
                        {route.icon}
                      </span>
                      <span className="font-semibold text-md">
                        {route.name}
                      </span>
                    </Link>
                  )}
                </li>
              );
            })}
          </ul>
        </div>

        <div className="flex flex-col justify-start items-start gap-2  mt-12">
          <ModeToggle theme={"show"} />
          <LogoutLink className="w-full flex gap-2 hover:text-purple-500 duration-150 p-2">
            <span>
              <LucideLogOut size={20} />
            </span>
            logout
          </LogoutLink>
        </div>
      </AsideProfile>

      <MobileMenuBar className={"hidden max-sm:flex max-md:flex "}>
        <User
          name={`${user?.given_name} ${user?.family_name}`}
          picture={user?.picture}
          isAdmin={isAdmin}
        />
        <ul className="w-full flex flex-col items-center justify-center self-center gap-2 mt-16">
          {profileRoutes.map((route, index) => {
            const activeRoute = pathName.split("/")[3];
            return (
              <li
                key={index}
                className="w-full flex justify-center items-center self-center gap-10 p-2 hover:text-muted-foreground duration-150"
              >
                {activeRoute === route.name.toLocaleLowerCase() ? (
                  <Link
                    href={route.path}
                    className={`w-full flex justify-center items-center gap-2 rounded-md`}
                  >
                    <h1
                      className={`w-full flex gap-2 rounded-md text-purple-400  justify-center items-center`}
                    >
                      <span className="font-semibold text-md">
                        {route.name}
                      </span>
                    </h1>
                  </Link>
                ) : (
                  <Link
                    className={`w-full flex justify-center items-center gap-2 rounded-md`}
                    href={route.path}
                  >
                    <span className="font-semibold text-md">{route.name}</span>
                  </Link>
                )}
              </li>
            );
          })}
          <li className="flex justify-center items-center  ">
            <ModeToggle theme={"show"} />
          </li>
          <li className="w-full flex flex-col justify-center items-center  gap-8 p-2  mt-16">
            <LogoutLink className="w-full flex justify-center items-center gap-2 hover:text-muted-foreground duration-150 p-2">
              <span>
                <LucideLogOut size={20} />
              </span>
              logout
            </LogoutLink>
          </li>
        </ul>
      </MobileMenuBar>
      <main className="w-4/5 mt-4 max-sm:w-full max-md:w-full  max-w-full ml-auto  absolute top-0 right-0 max-sm:static max-md:static">
        {children}
      </main>
    </section>
  );
}

export default layout;
