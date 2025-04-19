import { ISkillType } from "@/lib/types";
import SkillCard from "../cards/SkillCard";

function SkillSection({ skills }: { skills: ISkillType[] }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 grid-flow-row gap-4">
      {skills.map((Skill: ISkillType) => {
        return (
          <SkillCard
            key={Skill.id}
            id={Skill.id}
            skillLogo={Skill.skillLogo}
            skillName={Skill.skillName}
          />
        );
      })}
    </div>
  );
}

export default SkillSection;
