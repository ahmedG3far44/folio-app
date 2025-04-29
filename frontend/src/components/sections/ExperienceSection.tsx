import { IExperienceType } from "@/lib/types";
import ExperienceCard from "../cards/ExperienceCard";
import { Link } from "react-router-dom";
import { Button } from "../ui/button";
import { useAuth } from "@/contexts/AuthProvider";
import { ChagneLayoutForm } from "./ProjectSection";
import { ApplyLayout } from "./SkillSection";

function ExperienceSection({
  experiences,
}: {
  experiences: IExperienceType[];
}) {
  const { isLogged } = useAuth();

  return (
    <>
      {isLogged && <ChagneLayoutForm sectionName={"expLayout"} />}
      {experiences.length > 0 ? (
        <ApplyLayout sectionName="expLayout" type="parent">
          {experiences.map((exp: IExperienceType) => {
            return (
              <ExperienceCard
                key={exp.id}
                exp={exp}
              />
            );
          })}
        </ApplyLayout>
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
