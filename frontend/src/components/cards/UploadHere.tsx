import { useTheme } from "@/contexts/ThemeProvider";
import { CloudUpload } from "lucide-react";

function UploadHere({ inputId }: { inputId: string }) {
  const { activeTheme } = useTheme();
  return (
    <div
      className={`px-4 py-8 min-h-[150px]  w-3/4 lg:w-1/3 border border-dashed rounded-2xl flex items-center justify-center gap-2 cursor-pointer `}
      style={{
        color: activeTheme.primaryText,
        border: `1px dashed ${activeTheme.borderColor}`,
        backgroundColor: activeTheme.backgroundColor,
      }}
    >
      <label
        className=" cursor-pointer text-md flex flex-col items-center justify-center gap-1 hover:opacity-50 "
        htmlFor={inputId}
      >
        <div>
          <CloudUpload size={30} />
        </div>
        <div className="flex justify-center items-center gap-2 text-sm">
          <span className="underline cursor-pointer text-nowrap">
            click to upload{" "}
          </span>
        </div>
        <div className="text-[10px]">
          {inputId === "resume"
            ? "PDF, DOCX, Word, Txt max size (2MB)"
            : "JPEG, PNG, WEBP & GIF max(800px X 400px)"}
        </div>
      </label>
    </div>
  );
}

export default UploadHere;
