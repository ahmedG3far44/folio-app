import { IThemeType } from "@/lib/types";
import { useTheme } from "@/contexts/ThemeProvider";


function ThemeCard({
  themeName,
  backgroundColor,
  cardColor,
  primaryText,
  secondaryText,
  borderColor,
}: IThemeType) {
  const { activeTheme } = useTheme();

  return (
    <div className="flex flex-col items-start justify-start gap-2 hover:scale-95 duration-150 ">
      <h2>{themeName}</h2>
      <div
        style={{
          border: `1px solid ${activeTheme.borderColor}`,
        }}
        className="flex items-center justify-center gap-1  p-2  rounded-md relative"
      >
        <div
          className="w-10 h-8 border border-zinc-800 rounded-tl-md rounded-bl-md"
          style={{
            backgroundColor: backgroundColor,
          }}
        ></div>
        <div
          className="w-10 h-8 border border-zinc-800"
          style={{
            backgroundColor: cardColor,
          }}
        ></div>
        <div
          className="w-10 h-8 border border-zinc-800"
          style={{
            backgroundColor: primaryText,
          }}
        ></div>
        <div
          className="w-10 h-8 border border-zinc-800"
          style={{
            backgroundColor: secondaryText,
          }}
        ></div>
        <div
          className="w-10 h-8 border border-zinc-800 rounded-tr-md rounded-br-md"
          style={{
            backgroundColor: borderColor,
          }}
        ></div>
      </div>
    </div>
  );
}

export default ThemeCard;
