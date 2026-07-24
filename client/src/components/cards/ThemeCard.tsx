import { IThemeType } from "@/lib/types";
import { useTheme } from "@/contexts/ThemeProvider";
import { Check } from "lucide-react";

function ThemeCard({
  themeName,
  backgroundColor,
  cardColor,
  primaryText,
  secondaryText,
  borderColor,
  id,
}: IThemeType) {
  const { activeTheme } = useTheme();
  const isActive = activeTheme.id === id;

  return (
    <div
      className={`relative flex flex-col items-start justify-start gap-2 p-1 transition-transform duration-150 ${
        isActive ? "" : "hover:scale-[1.02]"
      }`}
    >
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium">{themeName}</span>
        {isActive && (
          <span className="flex items-center gap-1 text-xs font-medium"
            style={{ color: activeTheme.primaryText }}
          >
            <Check size={14} />
            Active
          </span>
        )}
      </div>
      <div
        className="flex items-center rounded-lg overflow-hidden border"
        style={{
          borderColor: isActive ? activeTheme.primaryText : borderColor,
        }}
      >
        <div className="w-10 h-8" style={{ backgroundColor }} />
        <div className="w-10 h-8" style={{ backgroundColor: cardColor }} />
        <div className="w-10 h-8" style={{ backgroundColor: primaryText }} />
        <div className="w-10 h-8" style={{ backgroundColor: secondaryText }} />
        <div className="w-10 h-8" style={{ backgroundColor: borderColor }} />
      </div>
    </div>
  );
}

export default ThemeCard;
