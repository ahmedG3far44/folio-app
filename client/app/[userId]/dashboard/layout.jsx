import Link from "next/link";
import { MdOutlineInsights } from "react-icons/md";
import { LuUsers2 } from "react-icons/lu";
import { LuLogOut } from "react-icons/lu";
import { TbSmartHome } from "react-icons/tb";
import { LogoutLink } from "@kinde-oss/kinde-auth-nextjs/components";
import User from "@cards/User";
import credentials from "@credentials";
import { ModeToggle } from "@themes/dark-mode-toggle";

async function layout({ children }) {
  const { user, isAdmin } = await credentials();
  const dashboardRoutes = [
    {
      path: `/`,
      name: "Home",
      icon: <TbSmartHome size={20} />,
    },
    {
      path: `/${user?.id}/dashboard/users`,
      name: "Users",
      icon: <LuUsers2 size={20} />,
    },
    {
      path: `/${user?.id}/dashboard/analysis`,
      name: "Analysis",
      icon: <MdOutlineInsights size={20} />,
    },
  ];
  return (
    <div className="admin_dashboard">
      <aside className="admin_aside">
        <div className="admin_aside_top">
          <div className="w-full self-center mx-auto">
            <User
              name={`${user?.given_name} ${user?.family_name}`}
              picture={user?.picture}
              email={user?.email}
              isAdmin={isAdmin}
            />
          </div>

          <nav>
            <ul className="admin_aside_top_navigation">
              {dashboardRoutes.map((route, index) => {
                return (
                  <li
                    key={index}
                    className="w-full flex justify-start items-center gap-10 p-2 hover:text-purple-500 duration-150"
                  >
                    <Link className={`w-full flex gap-2`} href={route.path}>
                      <span>{route?.icon}</span>
                      {route?.name}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
        </div>
        <div className="admin_aside_bottom">
          <ModeToggle theme={"show"} />
          <LogoutLink className="w-full flex gap-2 hover:text-purple-500 duration-150">
            <span>
              <LuLogOut size={20} />
            </span>
            logout
          </LogoutLink>
        </div>
      </aside>

      <main className="admin_main_content">{children}</main>
    </div>
  );
}
export default layout;
