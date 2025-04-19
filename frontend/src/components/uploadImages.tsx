import { Card } from "@/components/ui/card";
import { useRef, useState } from "react";
import { useAuth } from "@/contexts/AuthProvider";

import SubmitButton from "@/components/submit-button";
import { useUpload } from "@/contexts/UploadProvider";

const URL_SERVER = import.meta.env.VITE_URL_SERVER as string;

function UploadImages({ status }: { status: string | "single" | "multiple" }) {
  const { token } = useAuth();
  const { uploadedInfo, setUploadedInfo } = useUpload();
  const [uploading, setUploading] = useState(false);
  // const [uploadedInfo, setUploadedInfo] = useState<UploadFileType[] | null>(
  //   null
  // );
  const fileRef = useRef<HTMLInputElement | null>(null);
  const uploadFileForm = useRef<HTMLFormElement>(null);

  const handleUpload = async (e: React.FormEvent<HTMLFormElement>) => {
    try {
      e.preventDefault();
      setUploading(true);
      const formData = new FormData();
      const files = fileRef.current?.files;
      if (!files) return;

      for (const file of files) {
        formData.append("file", file);
      }

      const response = await fetch(`${URL_SERVER}/upload`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) throw new Error("upload file failed try agian later!!");

      const uploadedFile = await response.json();
      const uploaded = uploadedFile.data;
      setUploadedInfo(uploaded);
      resetForm();
      console.log(uploaded);
      return uploaded;
    } catch (err) {
      console.log(err);
      return;
    } finally {
      setUploading(false);
    }
  };
  const resetForm = () => {
    if (uploadFileForm.current) {
      uploadFileForm.current.reset();
    }
  };
  return (
    <Card className="w-[400px] p-4">
      {uploadedInfo ? (
        <div className="p-4 flex justify-center items-center gap-2 flex-wrap">
          {uploadedInfo.map((file, index) => {
            return (
              <div
                className="flex flex-col justify-center items-center gap-2"
                key={index}
              >
                <div className="w-20 h-20 overflow-hidden rounded-2xl border border-zinc-300">
                  <img
                    className="w-full h-full rounded-2xl object-cover overflow-hidden"
                    src={file.url as string}
                    alt={file.name}
                  />
                </div>

                <span className="text-[10px] text-zinc-500 font-semibold">
                  {(file.size / 1024 / 1024).toLocaleString()}
                  <span>
                    {(file.size / 1024 / 1024).toLocaleString() < "1"
                      ? "KB"
                      : "MB"}
                  </span>
                </span>
              </div>
            );
          })}
        </div>
      ) : (
        <form
          onSubmit={handleUpload}
          ref={uploadFileForm}
          className="w-full flex flex-col justify-start items-start gap-4"
        >
          <label
            className="p-4 cursor-pointer  rounded-md w-full bg-zinc-100 border-dashed border-2 flex flex-col justify-center items-center gap-1 hover:bg-zinc-200 duration-150"
            htmlFor="file"
          >
            <h3 className="font-semibold">Upload Image here...</h3>
            <span className="text-[10px]">PNG | JPEG | JPG | WEBP | PDF</span>
          </label>
          <input
            id="file"
            name="file"
            type="file"
            ref={fileRef}
            accept="image/*"
            multiple={status === "mutiple" && true}
            className="hidden"
          />

          <SubmitButton className="w-full " type="submit" loading={uploading}>
            Upload
          </SubmitButton>
        </form>
      )}
    </Card>
  );
}

export default UploadImages;
