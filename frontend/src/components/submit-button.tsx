import { ReactNode } from "react";
import { Button } from "./ui/button";
import Loader from "./loader";
import { useTheme } from "@/contexts/ThemeProvider";

interface SubmitButtonProps {
  children: ReactNode;
  type: string | "submit" | "reset" | "button";
  className?: string;
  onClickFunction?: () => void;
  variant?:
    | string
    | "outline"
    | "default"
    | "desctuctive"
    | "secondary"
    | undefined;
  loading?: boolean;
}
function SubmitButton({
  children,
  type,
  onClickFunction,
  variant,
  loading,
  className,
}: SubmitButtonProps) {
  const { activeTheme } = useTheme();
  return (
    <Button
      style={{
        backgroundColor: activeTheme.backgroundColor,
        color: activeTheme.primaryText,
        border: `1px solid ${activeTheme.borderColor}`,
      }}
      type={type as "submit" | "reset" | "button"}
      onClick={onClickFunction}
      disabled={loading}
      className={`${className} min-w-32 max-w-full hover:opacity-75 duration-150 cursor-pointer disabled:bg-accent-foreground`}
      variant={
        variant as
          | "outline"
          | "default"
          | "secondary"
          | "link"
          | "destructive"
          | "ghost"
          | null
          | undefined
      }
    >
      {loading ? <Loader size="sm" /> : children}
    </Button>
  );
}

export default SubmitButton;
