import { useTheme } from "@/contexts/ThemeProvider";
import { ISkillType } from "@/lib/types";

import LayoutJson from "@/lib/layouts.json";
import { useUser } from "@/contexts/UserProvider";
import Image from "../ui/image";

function SkillCard({
  skill,
}: {
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
      className={`p-4 md:p-5 flex items-center gap-3 md:gap-4
        ${
          layouts.skillsLayout === "1"
            ? child?.default
            : layouts.skillsLayout === "2"
            ? child?.medium
            : layouts.skillsLayout === "3"
            ? child.minimal
            : layouts.skillsLayout === "4"
            ? child?.wizard
            : layouts.skillsLayout === "5"
            ? child?.accent
            : ""
        }`}
    >
      <div
        className={`w-10 h-10 md:w-12 md:h-12 shrink-0 overflow-hidden rounded-xl ${
          layouts.skillsLayout === "2" ? "hidden" : "block"
        }`}
      >
        <Image className="w-full h-full object-cover" src={skillLogo} alt={skillName} />
      </div>
      <p className="text-lg md:text-xl font-bold truncate" style={{ color: activeTheme.primaryText }}>
        {skillName}
      </p>
    </div>
  );
}

export default SkillCard;
