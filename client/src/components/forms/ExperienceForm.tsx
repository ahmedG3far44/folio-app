import { z } from "zod";
import { ChangeEvent, useState } from "react";
import { experienceSchema } from "@/lib/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useAuth } from "@/contexts/AuthProvider";

import { Button } from "../ui/button";
import { Briefcase, CirclePlus, X } from "lucide-react";

import { useTheme } from "@/contexts/ThemeProvider";
import { useUser } from "@/contexts/UserProvider";

import { IExperienceType } from "@/lib/types";

import Loader from "../loader";
import toast from "react-hot-toast";
import ErrorMessage from "../ErrorMessage";
import SubmitButton from "../submit-button";
import UploadHere from "../cards/UploadHere";
import ShowListCard from "../cards/ShowListCard";
import Tiptap from "../Tiptap";
import { Label } from "../ui/label";

const URL_SERVER = import.meta.env.VITE_API_URL as string;

function ExperienceForm() {
  const { token } = useAuth();
  const { activeTheme } = useTheme();
  const { experiences, setExperiences, pending } = useUser();

  const [updateThisExperience, setUpdateThisExperience] =
    useState<IExperienceType | null>(null);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isUpdating, setIsUpdating] = useState<boolean>(false);
  const [file, setFile] = useState<File | string | null>(
    updateThisExperience ? updateThisExperience.cLogo : null
  );
  const [content, setContent] = useState<string>("");

  const {
    register,
    reset,
    handleSubmit,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm<z.infer<typeof experienceSchema>>({
    resolver: zodResolver(experienceSchema),
  });

  const inputStyle = {
    backgroundColor: activeTheme.backgroundColor,
    color: activeTheme.primaryText,
    borderColor: activeTheme.borderColor,
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Experiences</h2>
        <Button
          variant="outline"
          size="sm"
          className="cursor-pointer"
          onClick={() => {
            setIsOpen(!isOpen);
            if (isOpen) {
              setIsUpdating(false);
              setUpdateThisExperience(null);
              setContent("");
              setFile(null);
            }
          }}
        >
          {!isOpen ? (
            <><CirclePlus size={16} /> Add</>
          ) : (
            <><X size={16} /> Close</>
          )}
        </Button>
      </div>

      {isOpen && (
        <form
          onSubmit={handleSubmit(async () => {
            const values = getValues();
            const formData = new FormData();
            if (file) formData.append("file", file!);
            Object.entries(values).forEach(([key, value]) => {
              formData.append(key, value);
            });
            formData.append("role", content);

            try {
              const response = await fetch(
                `${URL_SERVER}/experiences/${isUpdating ? updateThisExperience?.id : ""}`,
                {
                  method: isUpdating ? "PUT" : "POST",
                  headers: { Authorization: `Bearer ${token}` },
                  body: formData,
                }
              );
              if (!response.ok) throw new Error("Failed to save experience");
              const data = await response.json();
              setExperiences(data.data);
              setContent("");
              reset();
              toast.success("Experience saved successfully");
            } catch (err) {
              toast.error((err as Error).message);
            } finally {
              setFile(null);
              setIsOpen(false);
              setIsUpdating(false);
            }
          })}
          className="space-y-4"
        >
          <div
            className="rounded-xl border p-5 space-y-5"
            style={{
              backgroundColor: activeTheme.cardColor,
              borderColor: activeTheme.borderColor,
              color: activeTheme.primaryText,
            }}
          >
            <div className="flex justify-center">
              <div className="w-40">
                {file ? (
                  <div
                    className="relative border rounded-lg p-2 flex items-center justify-center"
                    style={{ borderColor: activeTheme.borderColor }}
                  >
                    <img
                      className="w-32 h-32 object-cover rounded-lg"
                      src={
                        typeof file === "string"
                          ? file
                          : URL.createObjectURL(file!)
                      }
                      alt="company logo"
                    />
                    {!isSubmitting && (
                      <button
                        type="button"
                        className="cursor-pointer bg-red-600 p-1.5 hover:bg-red-700 duration-150 absolute -top-2.5 -right-2.5 rounded-full text-white"
                        onClick={() => {
                          setFile(null);
                          if (updateThisExperience) {
                            setUpdateThisExperience({ ...updateThisExperience });
                          }
                        }}
                      >
                        <X size={14} />
                      </button>
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
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="cName" style={{ color: activeTheme.primaryText }}>
                Company Name
              </Label>
              <input
                style={inputStyle}
                readOnly={isSubmitting}
                className="w-full rounded-lg border px-3 py-2 text-sm outline-none transition-colors focus-visible:ring-[3px]"
                type="text"
                id="cName"
                placeholder="Company Name"
                defaultValue={updateThisExperience ? updateThisExperience.cName : ""}
                {...register("cName")}
              />
              {errors.cName && (
                <ErrorMessage message={errors.cName.message?.toString() || ""} />
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="position" style={{ color: activeTheme.primaryText }}>
                Job Position
              </Label>
              <input
                style={inputStyle}
                readOnly={isSubmitting}
                className="w-full rounded-lg border px-3 py-2 text-sm outline-none transition-colors focus-visible:ring-[3px]"
                type="text"
                id="position"
                placeholder="Job Position"
                defaultValue={updateThisExperience ? updateThisExperience.position : ""}
                {...register("position")}
              />
              {errors.position && (
                <ErrorMessage message={errors.position.message?.toString() || ""} />
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="duration" style={{ color: activeTheme.primaryText }}>
                Duration
              </Label>
              <input
                style={inputStyle}
                readOnly={isSubmitting}
                className="w-full rounded-lg border px-3 py-2 text-sm outline-none transition-colors focus-visible:ring-[3px]"
                type="text"
                id="duration"
                placeholder="e.g. Jan 2020 - Present"
                defaultValue={updateThisExperience ? updateThisExperience.duration : ""}
                {...register("duration")}
              />
              {errors.duration && (
                <ErrorMessage message={errors.duration.message?.toString() || ""} />
              )}
            </div>

            <div className="space-y-1.5">
              <Label style={{ color: activeTheme.primaryText }}>Role Description</Label>
              <div
                className="rounded-lg border p-3"
                style={inputStyle}
              >
                <Tiptap content={content} setContent={setContent} />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="location" style={{ color: activeTheme.primaryText }}>
                Location
              </Label>
              <input
                style={inputStyle}
                readOnly={isSubmitting}
                className="w-full rounded-lg border px-3 py-2 text-sm outline-none transition-colors focus-visible:ring-[3px]"
                type="text"
                id="location"
                placeholder="e.g. San Francisco, CA"
                defaultValue={updateThisExperience ? updateThisExperience.location : ""}
                {...register("location")}
              />
              {errors.location && (
                <ErrorMessage message={errors.location.message?.toString() || ""} />
              )}
            </div>
          </div>

          <SubmitButton className="w-full" loading={isSubmitting} type="submit">
            {isUpdating ? "Update Experience" : "Add Experience"}
          </SubmitButton>
        </form>
      )}

      {pending ? (
        <div className="w-full min-h-[300px] flex items-center justify-center">
          <Loader size="md" />
        </div>
      ) : (
        <div
          className="space-y-2"
          style={{ color: activeTheme.primaryText }}
        >
          {experiences.length > 0 ? (
            experiences.map((exp) => (
              <ShowListCard
                id={exp.id}
                key={exp.id}
                title={exp.cName}
                image={exp.cLogo}
                sectionName={"experiences"}
                setUpdate={() => {
                  setIsUpdating(true);
                  setIsOpen(true);
                  setUpdateThisExperience(exp);
                }}
              />
            ))
          ) : (
            <div className="w-full min-h-[300px] flex flex-col items-center justify-center gap-3 rounded-xl border"
              style={{
                backgroundColor: activeTheme.backgroundColor,
                borderColor: activeTheme.borderColor,
              }}
            >
              <Briefcase size={32} className="opacity-30" />
              <p className="text-sm opacity-50">No experiences yet</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default ExperienceForm;
