import { useTheme } from "@/contexts/ThemeProvider";
import { ISkillType } from "@/lib/types";

function SkillCard({ skillLogo, skillName }: ISkillType) {
  const { activeTheme } = useTheme();
  return (
    <div className="flex justify-start items-center gap-4">
      <div className="w-12 h-12 overflow-hidden rounded-2xl">
        <img src={skillLogo} alt={skillName} />
      </div>
      <div style={{ color: activeTheme.primaryText}}>
        <h1 className="text-2xl font-black">{skillName}</h1>
      </div>
    </div>
  );
}

export default SkillCard;
