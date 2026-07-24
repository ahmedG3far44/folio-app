import { useAuth } from "@/contexts/AuthProvider";
import { useTheme } from "@/contexts/ThemeProvider";
import { CloudUpload } from "lucide-react";

function UploadHere({ inputId }: { inputId: string }) {
  const { activeTheme, defaultTheme } = useTheme();
  const { isLogged } = useAuth();
  const theme = isLogged ? activeTheme : defaultTheme;
  return (
    <div
      className="relative w-full rounded-xl border-2 border-dashed transition-colors duration-150 hover:opacity-80 cursor-pointer"
      style={{
        color: theme.primaryText,
        borderColor: theme.borderColor,
        backgroundColor: theme.backgroundColor,
      }}
    >
      <label
        className="flex flex-col items-center justify-center gap-2 py-10 cursor-pointer"
        htmlFor={inputId}
      >
        <CloudUpload size={28} strokeWidth={1.5} />
        <span className="text-sm underline underline-offset-2">
          click to upload
        </span>
        <span
          className="text-[11px] text-center max-w-[220px]"
          style={{ color: theme.secondaryText }}
        >
          {inputId === "resume"
            ? "PDF, DOCX, Word, Txt — max 2MB"
            : inputId === "thumbnail"
            ? "Image or Video — max 10MB"
            : "JPEG, PNG, WEBP & GIF — max 4MB"}
        </span>
      </label>
    </div>
  );
}

export default UploadHere;
