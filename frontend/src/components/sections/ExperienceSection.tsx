import { IExperienceType } from "@/lib/types";
import ExperienceCard from "../cards/ExperienceCard";

function ExperienceSection({
  experiences,
}: {
  experiences: IExperienceType[];
}) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {experiences.map((exp: IExperienceType) => {
        return (
          <ExperienceCard
            key={exp.id}
            id={exp.id}
            cName={exp.cName}
            cLogo={exp.cLogo}
            position={exp.position}
            duration={exp.duration}
            role={exp.role}
            location={exp.location}
          />
        );
      })}
    </div>
  );
}

export default ExperienceSection;
