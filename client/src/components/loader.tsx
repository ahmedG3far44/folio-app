import { useTheme } from "@/contexts/ThemeProvider";

function Loader({ size = "md" }: { size?: "sm" | "md" | "lg" | "xl" }) {
  const { activeTheme, defaultTheme } = useTheme();
  const themeColor = activeTheme?.borderColor || defaultTheme.borderColor;

  const barSizes = {
    sm: "w-0.5 h-2",
    md: "w-1 h-3",
    lg: "w-1.5 h-5",
    xl: "w-2 h-7",
  };

  return (
    <div className="flex items-end justify-center gap-0.5">
      {[0, 1, 2, 3, 4].map((index) => (
        <div
          key={index}
          className={`${barSizes[size]} rounded-full animate-grow animate-ping`}
          style={{
            backgroundColor: themeColor,
            animationDelay: `${index * 0.15}s`,
          }}
        />
      ))}
    </div>
  );
}

export default Loader;
