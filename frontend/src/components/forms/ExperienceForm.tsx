import { z } from "zod";
import { ChangeEvent, useState } from "react";
import { experienceSchema } from "@/lib/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useAuth } from "@/contexts/AuthProvider";

import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { XIcon } from "lucide-react";

import SubmitButton from "../submit-button";
import ErrorMessage from "../ErrorMessage";
import toast from "react-hot-toast";
import { useTheme } from "@/contexts/ThemeProvider";
import UploadHere from "../cards/UploadHere";

const URL_SERVER = import.meta.env.VITE_URL_SERVER as string;

function ExperienceForm() {
  const { token } = useAuth();
  const { activeTheme } = useTheme();
  const [isOpen, setIsOpen] = useState<boolean>(false);
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
              setFile(null);
              reset();
              toast.success("a new experience was created success!!");
              return data;
            } catch (err) {
              // console.log((err as Error).message);
              toast.error((err as Error).message);
              return;
            }
          })}
          className="w-full p-2 flex flex-col justify-start items-center gap-2"
        >
          <Card
            style={{
              backgroundColor: activeTheme.cardColor,
              border: `1px solid ${activeTheme.borderColor}`,
              color: activeTheme.primaryText,
            }}
            className="w-full"
          >
            <div className="w-full flex items-center justify-center gap-4 flex-col">
              {file ? (
                <div
                  style={{ borderColor: activeTheme.borderColor }}
                  className="relative w-40 h-40 rounded-2xl border p-2 flex items-center justify-center"
                >
                  <img
                    className="w-30 h-30 object-cover rounded-2xl"
                    src={file ? URL.createObjectURL(file) : ""}
                    alt="compnay logo image"
                  />
                  {!isSubmitting && (
                    <Button
                      variant={"destructive"}
                      className="cursor-pointer hover:bg-red-700 duration-150 absolute -top-2 -right-4 p-2 rounded-2xl flex items-center justify-center text-white "
                      onClick={() => setFile(null)}
                    >
                      <XIcon size={20} />
                    </Button>
                  )}
                </div>
              ) : (
                <UploadHere inputId="file" />
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
            </div>
          </Card>
          <Card
            style={{
              backgroundColor: activeTheme.cardColor,
              border: `1px solid ${activeTheme.borderColor}`,
              color: activeTheme.secondaryText,
            }}
            className="p-4 w-full"
          >
            <input
              style={{
                backgroundColor: activeTheme.backgroundColor,
                color: activeTheme.primaryText,
                borderColor: activeTheme.borderColor,
              }}
              readOnly={isSubmitting}
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
              style={{
                backgroundColor: activeTheme.backgroundColor,
                color: activeTheme.primaryText,
                borderColor: activeTheme.borderColor,
              }}
              readOnly={isSubmitting}
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
              style={{
                backgroundColor: activeTheme.backgroundColor,
                color: activeTheme.primaryText,
                borderColor: activeTheme.borderColor,
              }}
              readOnly={isSubmitting}
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
              style={{
                backgroundColor: activeTheme.backgroundColor,
                color: activeTheme.primaryText,
                borderColor: activeTheme.borderColor,
              }}
              readOnly={isSubmitting}
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
              style={{
                backgroundColor: activeTheme.backgroundColor,
                color: activeTheme.primaryText,
                borderColor: activeTheme.borderColor,
              }}
              readOnly={isSubmitting}
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
          <SubmitButton
            className="w-full mt-4"
            loading={isSubmitting}
            type="submit"
          >
            Submit
          </SubmitButton>
        </form>
      )}
    </div>
  );
}

export default ExperienceForm;
