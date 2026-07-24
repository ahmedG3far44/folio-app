import { ReactNode } from "react";
import { Button } from "./ui/button";
import Loader from "./loader";

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
  return (
    <Button
      type={type as "submit" | "reset" | "button"}
      onClick={onClickFunction}
      disabled={loading}
      className={`${className} max-w-full cursor-pointer disabled:opacity-50`}
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
