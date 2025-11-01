import { useAuth } from "@/contexts/AuthProvider";
import { useTheme } from "@/contexts/ThemeProvider";
import { CloudUpload } from "lucide-react";

function UploadHere({ inputId }: { inputId: string }) {
  const { activeTheme, defaultTheme } = useTheme();
  const { isLogged } = useAuth();
  return (
    <div
      className={`px-4 py-8 min-h-[150px]  w-full  border border-dashed rounded-2xl flex items-center justify-center gap-2 cursor-pointer `}
      style={
        isLogged
          ? {
              color: activeTheme.primaryText,
              border: `1px dashed ${activeTheme.borderColor}`,
              backgroundColor: activeTheme.backgroundColor,
            }
          : {
              color: defaultTheme.primaryText,
              border: `1px dashed ${defaultTheme.borderColor}`,
              backgroundColor: defaultTheme.backgroundColor,
            }
      }
    >
      <label
        className=" cursor-pointer text-md flex flex-col items-center justify-center gap-1 hover:opacity-50 "
        htmlFor={inputId}
      >
        <div>
          <CloudUpload size={25} />
        </div>
        <div className="flex justify-center items-center gap-2 text-sm">
          <span className="underline cursor-pointer text-nowrap">
            click to upload{" "}
          </span>
        </div>
        <div
          style={
            isLogged
              ? { color: activeTheme.secondaryText }
              : { color: defaultTheme.secondaryText }
          }
          className="text-[10px] text-center mt-2"
        >
          {inputId === "resume"
            ? "PDF, DOCX, Word, Txt max size (2MB)"
            : "JPEG, PNG, WEBP & GIF max(800px X 400px)"}
        </div>
      </label>
    </div>
  );
}

export default UploadHere;
