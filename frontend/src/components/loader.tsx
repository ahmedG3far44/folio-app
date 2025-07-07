import { useTheme } from "@/contexts/ThemeProvider";

function Loader({ size }: { size?: string | "sm" | "md" | "lg" | "xl" }) {
  const { activeTheme } = useTheme();
  return (
    <div
      style={{ borderColor: activeTheme.primaryText}}
      className={`${
        size === "sm"
          ? "w-4 h-4"
          : size === "md"
          ? "w-8 h-8"
          : size === "lg"
          ? "w-14 h-14"
          : size === "xl"
          ? "w-20 h-20"
          : "w-4 h-4"
      } rounded-full animate-spin border-r border-t bg-transparent`}
    ></div>
  );
}

export default Loader;
