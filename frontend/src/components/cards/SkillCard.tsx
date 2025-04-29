import { useTheme } from "@/contexts/ThemeProvider";
import { ISkillType } from "@/lib/types";
import { ApplyLayout } from "../sections/SkillSection";
import { Card } from "../ui/card";

function SkillCard({
  skill,
}: // className,
{
  skill: ISkillType;
  className?: string;
}) {
  const { activeTheme } = useTheme();
  const { skillLogo, skillName } = skill;
  return (
    <Card   >
      <ApplyLayout type="child" sectionName="skillsLayout">
        <div className="w-12 h-12 overflow-hidden rounded-2xl">
          <img src={skillLogo} alt={skillName} />
        </div>
        <div style={{ color: activeTheme.primaryText }}>
          <h1 className="text-2xl font-black">{skillName}</h1>
        </div>
      </ApplyLayout>
    </Card>
  );
}

export default SkillCard;
