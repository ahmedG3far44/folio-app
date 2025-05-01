import { IExperienceType } from "@/lib/types";

import { Button } from "../ui/button";
import { Link } from "react-router-dom";

import { useAuth } from "@/contexts/AuthProvider";


import ExperienceCard from "../cards/ExperienceCard";
import { ApplyLayout, ChangeLayoutForm } from "../layouts/Layouts";


function ExperienceSection({
  experiences,
}: {
  experiences: IExperienceType[];
}) {
  const { isLogged } = useAuth();

  return (
    <>
      {isLogged && <ChangeLayoutForm sectionName={"expLayout"} />}
      {experiences.length > 0 ? (
        <ApplyLayout sectionName="expLayout" type="parent">
          {experiences.map((exp: IExperienceType) => {
            return <ExperienceCard key={exp.id} exp={exp} />;
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
