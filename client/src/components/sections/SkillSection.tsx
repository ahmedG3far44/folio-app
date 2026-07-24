import { ISkillType } from "@/lib/types";

import { ApplyLayout, ChangeLayoutForm } from "../layouts/Layouts";

import { useAuth } from "@/contexts/AuthProvider";

import SkillCard from "../cards/SkillCard";

function SkillSection({ skills }: { skills: ISkillType[] }) {
  const { isLogged } = useAuth();
  return (
    <div className="relative">
      {isLogged && (
        <div className="absolute -top-8 right-0 z-10">
          <ChangeLayoutForm sectionName="skillsLayout" />
        </div>
      )}

      {skills.length > 0 ? (
        <ApplyLayout sectionName="skillsLayout" type="parent">
          {skills.map((skill: ISkillType) => (
            <SkillCard key={skill.id} skill={skill} />
          ))}
        </ApplyLayout>
      ) : null}
    </div>
  );
}

export default SkillSection;
