import { ISkillType } from "@/lib/types";
import SkillCard from "../cards/SkillCard";
import { useAuth } from "@/contexts/AuthProvider";
import { Link } from "react-router-dom";
import { Button } from "../ui/button";

function SkillSection({ skills }: { skills: ISkillType[] }) {
  const { isLogged } = useAuth();
  return (
    <>
      {skills.length > 0 ? (
        <div className="w-full grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 grid-flow-row gap-4 place-center p-4">
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
      ) : (
        <div className="w-full flex items-center justify-center">
          {isLogged && (
            <Link to={"/profile/skills"}>
              <Button type="button">add skills</Button>
            </Link>
          )}
        </div>
      )}
    </>
  );
}

export default SkillSection;
