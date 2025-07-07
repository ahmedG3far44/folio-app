import { ChangeEvent, useState } from "react";
import { useAuth } from "@/contexts/AuthProvider";
import { useTheme } from "@/contexts/ThemeProvider";

import { Button } from "../ui/button";
import { FileCheck2, FileUser, XIcon } from "lucide-react";
import { Link } from "react-router-dom";

import SubmitButton from "../submit-button";
import UploadHere from "../cards/UploadHere";
import toast from "react-hot-toast";

const URL_SERVER = import.meta.env.VITE_URL_SERVER as string;
const BUCKET_DOMAIN = import.meta.env.VITE_BUCKET_DOMAIN as string;

function UploadResume() {
  const { token, user } = useAuth();
  const { activeTheme } = useTheme();
  const [file, setFile] = useState<File | null>(null);
  const [isChangeResume, setIsChangeResume] = useState<boolean>(false);
  const [uploadState, setUploadState] = useState<{
    uploading: boolean;
    success?: string | null;
    error?: string | null;
  }>({
    uploading: false,
    success: "",
    error: "",
  });
  const handleUploadResume = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      setUploadState({
        error: null,
        success: null,
        uploading: true,
      });
      const formData = new FormData();

      formData.append("resume", file as File);

      const response = await fetch(`${URL_SERVER}/resume`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });
      if (!response.ok) {
        throw new Error("uploading resume failed!!");
      }
      const data = await response.json();
      toast.success("uploading resume success");
      setUploadState({
        ...uploadState,
        success: "uploading resume success",
      });
      return data;
    } catch (err) {
      setUploadState({ ...uploadState, error: (err as Error).message });
      return;
    } finally {
      setFile(null);
      setIsChangeResume(false);
      setUploadState({
        success: null,
        error: null,
        uploading: false,
      });
    }
  };
  return (
    <>
      {user.resume && (
        <div className="w-full flex flex-col gap-4 justify-center items-center my-4">
          <Link
            style={{ color: activeTheme.primaryText }}
            to={`${BUCKET_DOMAIN}/${user.resume}`}
            target="_blank"
            className="flex justify-center items-center gap-2 my-4 hover:underline hover:opacity-75 duration-150"
          >
            <FileUser size={20} />
            <h1>Show Current Resume</h1>
          </Link>
          <Button onClick={() => setIsChangeResume(!isChangeResume)}>
            {isChangeResume ? "Close" : "Change Resume"}
          </Button>
        </div>
      )}
      {isChangeResume && (
        <>
          <form
            onSubmit={handleUploadResume}
            className="w-full flex flex-col gap-8 justify-center items-center"
          >
            {file ? (
              <div
                style={{
                  backgroundColor: activeTheme.backgroundColor,
                  color: activeTheme.primaryText,
                  borderColor: activeTheme.borderColor,
                }}
                className="w-full lg:w-[350px] flex flex-col items-center justify-center gap-2 p-4 border rounded-2xl relative"
              >
                <div className="w-fit">
                  <span>
                    <FileCheck2 size={30} />
                  </span>
                  {!uploadState.uploading && (
                    <button
                      onClick={() => setFile(null)}
                      type="button"
                      className="bg-red-600 hover:bg-red-700 duration-150 rounded-full p-2 text-white cursor-pointer absolute -top-2 -right-4"
                    >
                      <XIcon size={20} />
                    </button>
                  )}
                </div>
                <div className="flex flex-col justify-start items-center text-center text-sm ">
                  <h2 className="font-semibold max-w-[260px] overflow-x-hidden">
                    {file.name.split(".")[0]}
                  </h2>
                  <div className="flex flex-row-reverse items-center gap-2">
                    <h3>{(file.size / 1024 / 1024).toLocaleString()} KB</h3>
                    <h4>
                      {file.type.split("/").pop()?.toString().toUpperCase()}
                    </h4>
                  </div>
                </div>
              </div>
            ) : (
              <UploadHere inputId="resume" />
            )}
            <input
              type="file"
              readOnly={uploadState.uploading}
              name="resume"
              id="resume"
              className="hidden"
              accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setFile(e.target.files ? e.target.files[0] : null)
              }
            />
            {file && (
              <SubmitButton
                className="w-full cursor-pointer"
                loading={uploadState.uploading}
                type="submit"
              >
                Upload
              </SubmitButton>
            )}
          </form>
        </>
      )}
    </>
  );
}

export default UploadResume;
