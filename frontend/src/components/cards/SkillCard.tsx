import { ISkillType } from "@/lib/types";

function SkillCard({ skillLogo, skillName }: ISkillType) {
  return (
    <div className="flex justify-start items-center gap-2">
      <div className="w-12 h-12 overflow-hidden rounded-2xl">
        <img src={skillLogo} alt={skillName} />
      </div>
      <div>
        <h1>{skillName}</h1>
      </div>
    </div>
  );
}

export default SkillCard;
