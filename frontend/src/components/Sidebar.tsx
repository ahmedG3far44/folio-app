import { useAuth } from "@/contexts/AuthProvider";
import {
  Home,
  LucideAlarmCheck,
  LucideFlaskConical,
  LucideInfo,
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "./ui/button";

function Sidebar({ isOpen }: { isOpen: boolean; setIsOpen?: () => void }) {
  const { user, isLogged, logout } = useAuth();
  const { pathname } = useLocation();
  const activeLink = pathname.split("/").pop();

  //   const [isOpen, setIsOpen] = useState(false);
  console.log(isOpen);
  const profileLinks = [
    {
      id: 1,
      name: "Home",
      path: "/",
      icon: <Home size={20} />,
    },
    {
      id: 2,
      name: "Bio",
      path: "bio",
      icon: <LucideInfo size={20} />,
    },
    {
      id: 3,
      name: "Experiences",
      path: "experiences",
      icon: <LucideAlarmCheck size={20} />,
    },
    {
      id: 4,
      name: "Projects",
      path: "projects",
      icon: <Home size={20} />,
    },
    {
      id: 5,
      name: "Skills",
      path: "skills",
      icon: <LucideFlaskConical size={20} />,
    },
    {
      id: 6,
      name: "Testimonials",
      path: "testimonials",
      icon: <LucideFlaskConical size={20} />,
    },
  ];
  return (
    <aside
      className={` bg-white ${
        isOpen && "hidden shadow-sm  border-zinc-400"
      }  flex-col justify-start items-center lg:flex h-screen z-50`}
    >
      <div className="border-b border-b-stone-200 flex items-start justify-start gap-2 p-4 flex-wrap">
        <div className="w-10 h-10 overflow-hidden rounded-full">
          <img
            className="w-full h-full object-cover"
            src={user?.picture as string}
            alt={user.email as string}
          />
        </div>
        <div className="text-sm text-stone-600 ">
          <h3 className="font-bold">{user.name}</h3>
          <h4>{user.email}</h4>
        </div>
      </div>
      <div className="flex flex-col justify-around items-center w-full h-full p-4 mt-10">
        <ul>
          {profileLinks.map((url) => {
            return (
              <Link
                to={`${
                  url.path === "/" ? `/${user.id}` : `/profile/${url.path}`
                }`}
                className={`${
                  url.path === activeLink && "text-purple-500 "
                } p-4 w-full hover:text-stone-500  transition-all duration-150 cursor-pointer flex items-center gap-4 font-bold `}
                key={url.id}
              >
                <span>{url.icon}</span>
                {url.name}
              </Link>
            );
          })}
        </ul>
        {isLogged && (
          <Button
            className="w-full cursor-pointer mt-auto mb-8"
            type="button"
            onClick={logout}
          >
            Logout
          </Button>
        )}
      </div>
    </aside>
  );
}

export default Sidebar;
