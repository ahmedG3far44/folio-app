import { ChangeEvent, useState } from "react";
import { Button } from "../ui/button";
import SubmitButton from "../submit-button";
import { Card } from "../ui/card";
import { useForm } from "react-hook-form";
import { skillsSchema } from "@/lib/schemas";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import ErrorMessage from "../ErrorMessage";
import { useAuth } from "@/contexts/AuthProvider";
import { XIcon } from "lucide-react";
import toast from "react-hot-toast";
// import { useParams } from "react-router-dom";
import UploadHere from "../cards/UploadHere";
import { useTheme } from "@/contexts/ThemeProvider";
import { useUser } from "@/contexts/UserProvider";
import ShowListCard from "../cards/ShowListCard";
import Loader from "../loader";
import { ISkillType } from "@/lib/types";
import { useNavigate } from "react-router-dom";

const URL_SERVER = import.meta.env.VITE_URL_SERVER as string;

function SkillForm() {
  const { token } = useAuth();
  const { skills, pending } = useUser();
  const navigate = useNavigate();
  const { activeTheme } = useTheme();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isUpdating, setIsUdating] = useState<boolean>(false);
  const [file, setFile] = useState<File | null>(null);
  const [updateSkill, setUpdateSkill] = useState<ISkillType | null>(null);

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
    <>
      <div className="flex flex-col items-center w-full">
        <div className="flex justify-between items-center w-full mb-4">
          <h1>Skill Form</h1>
          <Button onClick={() => setIsOpen(!isOpen)}>
            {!isOpen ? "create skill" : "cancel"}
          </Button>
        </div>
        {isOpen && (
          <form
            onSubmit={handleSubmit(async () => {
              const values = getValues();
              const formData = new FormData();
              if (file) {
                formData.append("file", file!);
              }
              formData.append("skillName", values.skillName);

              try {
                const response = await fetch(
                  `${URL_SERVER}/skills/${isUpdating ? updateSkill?.id : ""}`,
                  {
                    method: isUpdating ? "PUT" : "POST",
                    headers: {
                      Authorization: `Bearer ${token}`,
                    },
                    body: formData,
                  }
                );

                if (!response.ok) {
                  throw new Error("adding a new skill failed!!");
                }
                const data = await response.json();
                console.log(data);
                toast.success("a new skill was created success!!");
                return navigate(0);
              } catch (err) {
                console.log((err as Error).message);
                toast.error((err as Error).message);
                return;
              } finally {
                setIsOpen(false);
                setFile(null);
                reset();
                setIsUdating(false);
              }
            })}
            className="w-full p-2 flex flex-col gap-4"
          >
            <Card className="w-full">
              <div className="w-full flex items-center justify-center gap-4 flex-col">
                {updateSkill || file ? (
                  <div
                    style={{ borderColor: activeTheme.borderColor }}
                    className="relative w-40 h-40 rounded-2xl border p-2 flex items-center justify-center"
                  >
                    <img
                      className="w-30 h-30 object-cover rounded-2xl"
                      src={
                        file
                          ? URL.createObjectURL(file)
                          : updateSkill?.skillLogo
                      }
                      alt="compnay logo image"
                    />
                    {!isSubmitting && (
                      <Button
                        type="button"
                        variant={"destructive"}
                        className="cursor-pointer hover:opacity-70 duration-150 absolute -top-2 rounded-2xl flex items-center justify-center text-white"
                        onClick={() => {
                          if (updateSkill)
                            setUpdateSkill({
                              ...updateSkill,
                              skillLogo: "",
                            });
                          setFile(null);
                        }}
                      >
                        <XIcon size={20} />
                      </Button>
                    )}
                  </div>
                ) : (
                  <UploadHere inputId="file" />
                )}
                <input
                  readOnly={isSubmitting}
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
            <Card className="p-4">
              <input
                style={{
                  backgroundColor: activeTheme.backgroundColor,
                  color: activeTheme.primaryText,
                  borderColor: activeTheme.borderColor,
                }}
                readOnly={isSubmitting}
                className="p-2 border rounded-md"
                type="text"
                id="skillName"
                placeholder="skillName"
                defaultValue={updateSkill ? updateSkill.skillName : ""}
                {...register("skillName")}
              />
              {errors.skillName && (
                <ErrorMessage
                  message={errors.skillName.message?.toString() as string}
                />
              )}
            </Card>
            <SubmitButton loading={isSubmitting} type="submit">
              Submit
            </SubmitButton>
          </form>
        )}
      </div>
      <Card
        className="p-4 border"
        style={{
          color: activeTheme.primaryText,
          backgroundColor: activeTheme.backgroundColor,
          borderColor: activeTheme.borderColor,
        }}
      >
        {pending ? (
          <div className="w-full min-h-[400px] flex items-center justify-center">
            <Loader size="md" />
          </div>
        ) : (
          <>
            {skills.length > 0 && (
              <div className="flex flex-col justify-start items-start gap-1">
                {skills.map((skill) => {
                  return (
                    <ShowListCard
                      id={skill.id}
                      key={skill.id}
                      title={skill.skillName}
                      image={skill.skillLogo}
                      sectionName={"skills"}
                      setUpdate={() => {
                        setUpdateSkill({ ...skill });
                        setIsOpen(true);
                        setIsUdating(true);
                        console.log(updateSkill);
                      }}
                    />
                  );
                })}
              </div>
            )}
          </>
        )}
      </Card>
    </>
  );
}

export default SkillForm;
