import { IExperienceType } from "@/lib/types";
// import { Card } from "../ui/card";
import { useTheme } from "@/contexts/ThemeProvider";
import { MapPin } from "lucide-react";

import LayoutsJson from "@/lib/layouts.json";
import { useUser } from "@/contexts/UserProvider";

function ExperienceCard({ exp }: { exp: IExperienceType; className?: string }) {
  const { cName, cLogo, duration, position, role, location } = exp;
  const { activeTheme } = useTheme();
  const { layouts } = useUser();
  const { expLayout } = LayoutsJson;
  const { child } = expLayout;

  return (
    <div
      style={{
        backgroundColor: activeTheme.cardColor,
        borderColor: activeTheme.borderColor,
      }}
      className={` p-4 w-full duration-150 cursor-pointer shadow-sm hover:shadow-2xl
       ${
         layouts.expLayout === "1"
           ? child?.default
           : layouts.expLayout === "2"
           ? child?.medium
           : layouts.expLayout === "3"
           ? child.minimal
           : layouts.expLayout === "4"
           ? child?.wizzard
           : layouts.expLayout === "5"
           ? child?.accent
           : "1"
       }`}
    >
      <div className="w-full flex justify-start items-center gap-4">
        <div className="w-12 h-12 rounded-xl  overflow-hidden">
          <img
            className="w-full h-full rounded-xl object-cover"
            src={cLogo}
            alt={cName}
          />
        </div>

        <div>
          <h2 className="text-xl font-bold">{cName}</h2>
          <h2 className="text-sm" style={{ color: activeTheme.secondaryText }}>
            {position}
          </h2>
        </div>
        <span
          style={{ color: activeTheme.secondaryText }}
          className="ml-auto flex text-sm font-semibold "
        >
          {duration}
        </span>
      </div>

      <div
        style={{
          color: activeTheme.secondaryText,
        }}
        className="flex flex-col justify-start items-start gap-2 text-sm"
      >
        <p>{role}</p>
      </div>

      <div className="flex justify-start items-center gap-2">
        <span>
          <MapPin size={20} />
        </span>{" "}
        <span className="text-sm">{location}</span>
      </div>
    </div>
  );
}

export default ExperienceCard;
