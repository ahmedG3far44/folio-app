import { IExperienceType } from "@/lib/types";
import ExperienceCard from "../cards/ExperienceCard";
import { Link } from "react-router-dom";
import { Button } from "../ui/button";
import { useAuth } from "@/contexts/AuthProvider";

function ExperienceSection({
  experiences,
}: {
  experiences: IExperienceType[];
}) {
  const { isLogged } = useAuth();
  return (
    <>
      {experiences.length > 0 ? (
        <div className="w-full grid grid-cols-1 lg:grid-cols-2 grid-flow-row gap-4 p-4">
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
      ) : (
        <div className="w-full flex items-center  justify-center">
          {isLogged && (
            <Link to={"/profile/experiences"}>
              <Button>add experience</Button>
            </Link>
          )}
        </div>
      )}
    </>
  );
}

export default ExperienceSection;
