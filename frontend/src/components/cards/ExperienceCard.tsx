import { IExperienceType } from "@/lib/types";
import { Card } from "../ui/card";

function ExperienceCard({
  id,
  cName,
  cLogo,
  duration,
  position,
  role,
  location,
}: IExperienceType) {
  return (
    <Card className="p-4">
      <div className="flex items-center gap-2">
        <div className="w-12 h-12 rounded-xl  overflow-hidden">
          <img
            className="w-full h-full rounded-xl object-cover"
            src={cLogo}
            alt={cName}
          />
        </div>

        <div>
          <h2>{cName}</h2>
          <h2>{position}</h2>
        </div>
        <span className="ml-auto flex">{duration}</span>
      </div>
      <div className="flex flex-col justify-start items-start gap-2">
       
        <p>{role}</p>
      </div>
      <div>
        <span>icon</span> {location}
        <span>{id}</span>
      </div>
    </Card>
  );
}

export default ExperienceCard;
