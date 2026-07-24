import { ChangeEvent, useState } from "react";
import { useAuth } from "@/contexts/AuthProvider";
import { useTheme } from "@/contexts/ThemeProvider";

import { Button } from "../ui/button";
import { FileCheck2, FileUser, X, Upload } from "lucide-react";
import { Link } from "react-router-dom";

import SubmitButton from "../submit-button";
import UploadHere from "../cards/UploadHere";
import toast from "react-hot-toast";

const URL_SERVER = import.meta.env.VITE_API_URL as string;

function UploadResume() {
  const { token, user } = useAuth();
  const { activeTheme } = useTheme();
  const [file, setFile] = useState<File | null>(null);
  const [isChangeResume, setIsChangeResume] = useState<boolean>(false);
  const [uploading, setUploading] = useState<boolean>(false);

  const handleUploadResume = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      setUploading(true);
      const formData = new FormData();
      formData.append("resume", file as File);

      const response = await fetch(`${URL_SERVER}/resume`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      if (!response.ok) throw new Error("Upload failed");
      await response.json();
      toast.success("Resume uploaded successfully");
    } catch (err) {
      toast.error((err as Error).message);
    } finally {
      setFile(null);
      setIsChangeResume(false);
      setUploading(false);
    }
  };

  return (
    <div className="space-y-4">
      {user.resume && !isChangeResume && (
        <div className="flex items-center gap-4">
          <Link
            to={user.resume}
            target="_blank"
            className="flex items-center gap-2 text-sm hover:underline hover:opacity-75 duration-150"
            style={{ color: activeTheme.primaryText }}
          >
            <FileUser size={18} />
            View Current Resume
          </Link>
          <Button
            variant="outline"
            size="sm"
            className="cursor-pointer"
            onClick={() => setIsChangeResume(true)}
          >
            <Upload size={14} />
            Change
          </Button>
        </div>
      )}

      {(isChangeResume || !user.resume) && (
        <form onSubmit={handleUploadResume} className="space-y-4">
          {file ? (
            <div
              className="flex flex-col items-center gap-3 p-5 rounded-xl border"
              style={{
                backgroundColor: activeTheme.backgroundColor,
                color: activeTheme.primaryText,
                borderColor: activeTheme.borderColor,
              }}
            >
              <FileCheck2 size={32} className="opacity-60" />
              <div className="text-center text-sm">
                <p className="font-semibold truncate max-w-[260px]">
                  {file.name.split(".")[0]}
                </p>
                <p className="opacity-60">
                  {(file.size / 1024).toFixed(0)} KB &middot;{" "}
                  {file.type.split("/").pop()?.toUpperCase()}
                </p>
              </div>
              {!uploading && (
                <button
                  type="button"
                  onClick={() => setFile(null)}
                  className="cursor-pointer bg-red-600 hover:bg-red-700 duration-150 rounded-full p-1.5 text-white"
                >
                  <X size={16} />
                </button>
              )}
            </div>
          ) : (
            <UploadHere inputId="resume" />
          )}

          <input
            type="file"
            name="resume"
            id="resume"
            className="hidden"
            accept=".pdf,.doc,.docx"
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setFile(e.target.files ? e.target.files[0] : null)
            }
          />

          {file && (
            <SubmitButton className="w-full" loading={uploading} type="submit">
              Upload Resume
            </SubmitButton>
          )}
        </form>
      )}
    </div>
  );
}

export default UploadResume;
