import { IExperienceType } from "@/lib/types";
import { useTheme } from "@/contexts/ThemeProvider";
import { MapPin } from "lucide-react";

import LayoutsJson from "@/lib/layouts.json";
import { useUser } from "@/contexts/UserProvider";
import Image from "../ui/image";

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
      className={`p-4 md:p-5 w-full transition-shadow duration-200
       ${
         layouts.expLayout === "1"
           ? child?.default
           : layouts.expLayout === "2"
           ? child?.medium
           : layouts.expLayout === "3"
           ? child.minimal
           : layouts.expLayout === "4"
           ? child?.wizard
           : layouts.expLayout === "5"
           ? child?.accent
           : ""
       }`}
    >
      <div className="flex flex-wrap items-start gap-3 md:gap-4">
        <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl overflow-hidden shrink-0">
          <Image
            className="w-full h-full rounded-xl object-cover"
            src={cLogo}
            alt={cName}
          />
        </div>

        <div className="min-w-0 flex-1">
          <h3 className="text-lg md:text-xl font-bold truncate">{cName}</h3>
          <p className="text-xs md:text-sm" style={{ color: activeTheme.secondaryText }}>
            {position}
          </p>
        </div>

        <span
          style={{ color: activeTheme.secondaryText }}
          className="text-xs md:text-sm font-medium whitespace-nowrap"
        >
          {duration}
        </span>
      </div>

      {role && (
        <div
          style={{ color: activeTheme.secondaryText }}
          className="mt-3 text-sm leading-relaxed"
        >
          <div
            className="editor-content prose-sm max-w-none"
            dangerouslySetInnerHTML={{ __html: role }}
          />
        </div>
      )}

      {location && (
        <div className="flex items-center gap-1.5 mt-3 text-xs md:text-sm" style={{ color: activeTheme.secondaryText }}>
          <MapPin size={14} />
          <span>{location}</span>
        </div>
      )}
    </div>
  );
}

export default ExperienceCard;
