
import { ISkillType } from "@/lib/types";

import { Link } from "react-router-dom";
import { Button } from "../ui/button";

import { ApplyLayout, ChangeLayoutForm } from "../layouts/Layouts";


import { useAuth } from "@/contexts/AuthProvider";

import SkillCard from "../cards/SkillCard";




function SkillSection({ skills }: { skills: ISkillType[] }) {
  const { isLogged } = useAuth();
  return (
    <>
      {isLogged && <ChangeLayoutForm sectionName="skillsLayout" />}

      {skills.length > 0 ? (
        <ApplyLayout sectionName="skillsLayout" type="parent" >
          {skills.map((skill: ISkillType) => {
            return <SkillCard key={skill.id} skill={skill} />;
          })}
        </ApplyLayout>
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



