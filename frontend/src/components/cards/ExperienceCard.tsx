import { IExperienceType } from "@/lib/types";
import { Card } from "../ui/card";
import { useTheme } from "@/contexts/ThemeProvider";
import { MapPin } from "lucide-react";

function ExperienceCard({
  cName,
  cLogo,
  duration,
  position,
  role,
  location,
}: IExperienceType) {
  const { activeTheme } = useTheme();
  return (
    <Card
      style={{
        backgroundColor: activeTheme.cardColor,
        color: activeTheme.primaryText,
        border: `1px solid ${activeTheme.borderColor}`,
      }}
      className="p-4"
    >
      <div className="flex justify-start items-center gap-4">
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
    </Card>
  );
}

export default ExperienceCard;
