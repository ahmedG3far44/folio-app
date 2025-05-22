import { useTheme } from "@/contexts/ThemeProvider";
import { ISkillType } from "@/lib/types";

import LayoutJson from "@/lib/layouts.json";
import { useUser } from "@/contexts/UserProvider";

function SkillCard({
  skill,
}: // className,
{
  skill: ISkillType;
  className?: string;
}) {
  const { activeTheme } = useTheme();
  const { skillLogo, skillName } = skill;
  const { layouts } = useUser();
  const { skillsLayout } = LayoutJson;
  const { child } = skillsLayout;
  return (
    <div
      style={{
        backgroundColor: activeTheme.cardColor,
        borderColor: activeTheme.borderColor,
      }}
      className={`
        p-4 border 
      ${
        layouts.skillsLayout === "1"
          ? child?.default
          : layouts.skillsLayout === "2"
          ? child?.medium
          : layouts.skillsLayout === "3"
          ? child.minimal
          : layouts.skillsLayout === "4"
          ? child?.wizzard
          : layouts.skillsLayout === "5"
          ? child?.accent
          : "1"
      }`}
    >
      <div
        className={`
          w-12 h-12 overflow-hidden rounded-2xl
        
        ${layouts.skillsLayout === "2" ? "hidden" : "block "}`}
      >
        <img src={skillLogo} alt={skillName} />
      </div>
      <div style={{ color: activeTheme.primaryText }}>
        <h1 className="text-2xl font-black">{skillName}</h1>
      </div>
    </div>
  );
}

export default SkillCard;
