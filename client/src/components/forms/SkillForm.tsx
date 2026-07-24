import { ChangeEvent, useState } from "react";
import { Button } from "../ui/button";
import SubmitButton from "../submit-button";
import { useForm } from "react-hook-form";
import { skillsSchema } from "@/lib/schemas";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import ErrorMessage from "../ErrorMessage";
import { useAuth } from "@/contexts/AuthProvider";
import { CirclePlus, X, LayoutPanelLeft } from "lucide-react";
import toast from "react-hot-toast";

import UploadHere from "../cards/UploadHere";
import { useTheme } from "@/contexts/ThemeProvider";
import { useUser } from "@/contexts/UserProvider";
import ShowListCard from "../cards/ShowListCard";
import Loader from "../loader";
import { ISkillType } from "@/lib/types";
import { Label } from "../ui/label";

const URL_SERVER = import.meta.env.VITE_API_URL as string;

function SkillForm() {
  const { token } = useAuth();
  const { skills, setSkills, pending } = useUser();
  const { activeTheme } = useTheme();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isUpdating, setIsUpdating] = useState<boolean>(false);
  const [updateSkill, setUpdateSkill] = useState<ISkillType | null>(null);
  const [file, setFile] = useState<File | string | null>(
    updateSkill ? updateSkill.skillLogo : null
  );

  const inputStyle = {
    backgroundColor: activeTheme.backgroundColor,
    color: activeTheme.primaryText,
    borderColor: activeTheme.borderColor,
  };

  const {
    register,
    reset,
    handleSubmit,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm<z.infer<typeof skillsSchema>>({
    resolver: zodResolver(skillsSchema),
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Skills</h2>
        <Button
          variant="outline"
          size="sm"
          className="cursor-pointer"
          onClick={() => {
            setIsOpen(!isOpen);
            if (isOpen) {
              setIsUpdating(false);
              setUpdateSkill(null);
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
            formData.append("skillName", values.skillName);

            try {
              const response = await fetch(
                `${URL_SERVER}/skills/${isUpdating ? updateSkill?.id : ""}`,
                {
                  method: isUpdating ? "PUT" : "POST",
                  headers: { Authorization: `Bearer ${token}` },
                  body: formData,
                }
              );
              if (!response.ok) throw new Error("Failed to save skill");
              const data = await response.json();
              toast.success("Skill saved successfully");
              setSkills(data.data);
            } catch (err) {
              toast.error((err as Error).message);
            } finally {
              reset();
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
                      alt="skill logo"
                    />
                    {!isSubmitting && (
                      <button
                        type="button"
                        className="cursor-pointer bg-red-600 p-1.5 hover:bg-red-700 duration-150 absolute -top-2.5 -right-2.5 rounded-full text-white"
                        onClick={() => {
                          setFile(null);
                          if (updateSkill) {
                            setUpdateSkill({ ...updateSkill, skillLogo: "" });
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
              <Label htmlFor="skillName" style={{ color: activeTheme.primaryText }}>
                Skill Name
              </Label>
              <input
                style={inputStyle}
                readOnly={isSubmitting}
                className="w-full rounded-lg border px-3 py-2 text-sm outline-none transition-colors focus-visible:ring-[3px]"
                type="text"
                id="skillName"
                placeholder="e.g. React, TypeScript, Figma"
                defaultValue={updateSkill ? updateSkill.skillName : ""}
                {...register("skillName")}
              />
              {errors.skillName && (
                <ErrorMessage message={errors.skillName.message?.toString() || ""} />
              )}
            </div>
          </div>

          <SubmitButton className="w-full" loading={isSubmitting} type="submit">
            {isUpdating ? "Update Skill" : "Add Skill"}
          </SubmitButton>
        </form>
      )}

      {pending ? (
        <div className="w-full min-h-[300px] flex items-center justify-center">
          <Loader size="md" />
        </div>
      ) : (
        <div className="space-y-2">
          {skills.length > 0 ? (
            skills.map((skill) => (
              <ShowListCard
                id={skill.id}
                key={skill.id}
                title={skill.skillName}
                image={skill.skillLogo}
                sectionName={"skills"}
                setUpdate={() => {
                  setUpdateSkill({ ...skill });
                  setIsOpen(true);
                  setIsUpdating(true);
                }}
              />
            ))
          ) : (
            <div
              className="w-full min-h-[300px] flex flex-col items-center justify-center gap-3 rounded-xl border"
              style={{
                backgroundColor: activeTheme.backgroundColor,
                borderColor: activeTheme.borderColor,
              }}
            >
              <LayoutPanelLeft size={32} className="opacity-30" />
              <p className="text-sm opacity-50">No skills yet</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default SkillForm;
