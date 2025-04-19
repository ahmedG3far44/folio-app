import { ChangeEvent, useState } from "react";
import { Button } from "../ui/button";
import { experienceSchema } from "@/lib/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import SubmitButton from "../submit-button";
import ErrorMessage from "../ErrorMessage";
import { Card } from "../ui/card";
import { useAuth } from "@/contexts/AuthProvider";

// import { XIcon } from "lucide-react";
// import UploadImage from "../UploadImage";
import { XIcon } from "lucide-react";
const URL_SERVER = import.meta.env.VITE_URL_SERVER as string;

function ExperienceForm() {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const { token } = useAuth();
  const [file, setFile] = useState<File | null>(null);
  const {
    register,
    reset,
    handleSubmit,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm<z.infer<typeof experienceSchema>>({
    resolver: zodResolver(experienceSchema),
  });
  return (
    <div className="w-full flex flex-col gap-4">
      <div className="w-full flex justify-between items-center">
        <h1>Experience Form</h1>
        <Button onClick={() => setIsOpen(!isOpen)}>
          {!isOpen ? "create Experience" : "cancel"}
        </Button>
      </div>
      {isOpen && (
        <form
          onSubmit={handleSubmit(async () => {
            const values = getValues();

            console.log(values);
            console.log(file);
            const formData = new FormData();
            formData.append("file", file!);
            formData.append("cName", values.cName);
            formData.append("position", values.position);
            formData.append("duration", values.duration);
            formData.append("role", values.role);
            formData.append("location", values.location);
            try {
              const response = await fetch(`${URL_SERVER}/experiences`, {
                method: "POST",
                headers: {
                  Authorization: `Bearer ${token}`,
                },
                body: formData,
              });
              if (!response.ok) {
                throw new Error("create a new experience failed!!");
              }
              const data = await response.json();
              console.log(data);
              setFile(null);
              reset();
              console.log("show toast message");
              return data;
            } catch (err) {
              console.log((err as Error).message);
            }
          })}
          className="w-full p-2 flex flex-col justify-start items-center gap-2"
        >
          <Card className="w-full">
            <div className="w-full flex items-center justify-center gap-4 flex-col">
              {file ? (
                <div className="relative">
                  <img
                    className="w-40 h-40 object-cover rounded-2xl"
                    src={file ? URL.createObjectURL(file) : ""}
                    alt="compnay logo image"
                  />
                  <button
                    className="cursor-pointer hover:bg-red-700 bg-red-500 duration-150 absolute -top-2  -right-2 p-2 rounded-2xl flex items-center justify-center text-white "
                    onClick={() => setFile(null)}
                  >
                    <XIcon size={20} />
                  </button>
                </div>
              ) : (
                <label
                  className="w-1/2 p-4 bg-zinc-100 border border-dashed rounded-md hover:bg-zinc-200 cursor-pointer duration-150"
                  htmlFor="file"
                >
                  Upload image
                </label>
              )}
              <input
                id="file"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setFile(e.target.files ? e.target.files[0] : null)
                }
              />
              {/* <Button type="submit">upload</Button> */}
            </div>
          </Card>
          <Card className="p-4 w-full">
            <input
              className="p-2 border w-full rounded-md"
              type="text"
              id="cName"
              placeholder="Company Name"
              {...register("cName")}
            />
            {errors.cName && (
              <ErrorMessage
                message={errors.cName.message?.toString() as string}
              />
            )}
            <input
              className="p-2 border rounded-md"
              type="text"
              id="position"
              placeholder="position"
              {...register("position")}
            />
            {errors.position && (
              <ErrorMessage
                message={errors.position.message?.toString() as string}
              />
            )}
            <input
              className="p-2 border rounded-md"
              type="text"
              id="duration"
              placeholder="duration"
              {...register("duration")}
            />
            {errors.duration && (
              <ErrorMessage
                message={errors.duration.message?.toString() as string}
              />
            )}
            <textarea
              className="w-full p-2 border rounded-md"
              id="role"
              placeholder="role"
              {...register("role")}
            />
            {errors.role && (
              <ErrorMessage
                message={errors.role.message?.toString() as string}
              />
            )}
            <input
              className="p-2 border rounded-md"
              type="text"
              id="location"
              placeholder="location"
              {...register("location")}
            />
            {errors.location && (
              <ErrorMessage
                message={errors.location.message?.toString() as string}
              />
            )}
          </Card>
          <SubmitButton className="w-full" loading={isSubmitting} type="submit">
            Submit
          </SubmitButton>
        </form>
      )}
    </div>
  );
}

export default ExperienceForm;
