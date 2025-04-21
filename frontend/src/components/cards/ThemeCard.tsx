import { useTheme } from "@/contexts/ThemeProvider";
import { IThemeType } from "@/lib/types";

function ThemeCard({
  backgroundColor,
  cardColor,
  primaryText,
  secondaryText,
  borderColor,
}: IThemeType) {
  const { activeTheme } = useTheme();
  return (
    <div
      style={{
        // backgroundColor: activeTheme.borderColor,
        border: `1px solid ${activeTheme.borderColor}`
      }}
      className="flex items-center justify-center gap-1  p-2  rounded-md"
    >
      <div
        className="w-10 h-8 rounded-tl-md rounded-bl-md"
        style={{
          backgroundColor: backgroundColor,
        }}
      ></div>
      <div
        className="w-10 h-8"
        style={{
          backgroundColor: cardColor,
        }}
      ></div>
      <div
        className="w-10 h-8 "
        style={{
          backgroundColor: primaryText,
        }}
      ></div>
      <div
        className="w-10 h-8"
        style={{
          backgroundColor: secondaryText,
        }}
      ></div>
      <div
        className="w-10 h-8 rounded-tr-md rounded-br-md"
        style={{
          backgroundColor: borderColor,
        }}
      ></div>
    </div>
  );
}

export default ThemeCard;
