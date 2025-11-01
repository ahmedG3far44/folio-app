import { ReactNode } from "react";
import { Button } from "./ui/button";
import Loader from "./loader";
import { useTheme } from "@/contexts/ThemeProvider";
import { useAuth } from "@/contexts/AuthProvider";

interface SubmitButtonProps {
  children: ReactNode;
  type: string | "submit" | "reset" | "button";
  className?: string;
  onClickFunction?: (e?: React.FormEvent) => void;
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
  const { defaultTheme, activeTheme } = useTheme();
  const { isLogged } = useAuth();
  return (
    <Button
      type={type as "submit" | "reset" | "button"}
      onClick={onClickFunction}
      disabled={loading}
      style={
        isLogged
          ? {
              backgroundColor: activeTheme.backgroundColor,
              borderColor: activeTheme.borderColor,
            }
          : {
              backgroundColor: defaultTheme.backgroundColor,
              borderColor: defaultTheme.borderColor,
            }
      }
      className={`${className} border  max-w-full hover:opacity-75 duration-150 cursor-pointer disabled:bg-accent-foreground`}
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
