import { IExperienceType } from "@/lib/types";

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
    <div className="relative">
      {isLogged && (
        <div className="absolute -top-8 right-0 z-10">
          <ChangeLayoutForm sectionName="expLayout" />
        </div>
      )}
      {experiences.length > 0 ? (
        <ApplyLayout sectionName="expLayout" type="parent">
          {experiences.map((exp: IExperienceType) => (
            <ExperienceCard key={exp.id} exp={exp} />
          ))}
        </ApplyLayout>
      ) : null}
    </div>
  );
}

export default ExperienceSection;
