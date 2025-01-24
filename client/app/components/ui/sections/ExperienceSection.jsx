"use client";
import { useState } from "react";
import ExperiencesForm from "@profileForms/ExperiencesForm";
import ExperienceCard from "@cards/ExperienceCard";

function ExperienceSection() {
  const [experiencesObject, setExperiencesObject] = useState({
    cName: "company name",
    cLogo: "",
    position: "position || job title",
    start: "2023-09-09",
    end: "2024-01-01",
    role: "your roles and duties in this company",
    location: "location of work",
  });
  return (
    <div className="w-full h-1/2 flex justify-start items-start flex-wrap-reverse gap-8 max-md:flex-col-reverse max-sm:flex-col-reverse">
      <div className="flex-1">
        <ExperiencesForm
          experiencesObject={experiencesObject}
          setExperiencesObject={setExperiencesObject}
        />
      </div>
      <div className="flex-1 flex flex-col justify-center items-center h-full min-h-full m-auto bg-secondary  p-8  border-2 border-dashed rounded-md">
        <ExperienceCard
          cLogo={experiencesObject.cLogo}
          cName={experiencesObject.cName || "company name"}
          start={experiencesObject.start || "2022"}
          end={experiencesObject.end || "2022"}
          role={experiencesObject.role || "your role in this company"}
          position={experiencesObject.position || "your position"}
          location={experiencesObject.location || "company location"}
          layoutStyle={"2"}
        />
      </div>
    </div>
  );
}

export default ExperienceSection;
