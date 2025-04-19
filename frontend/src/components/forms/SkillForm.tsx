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

const URL_SERVER = import.meta.env.VITE_URL_SERVER as string;

function SkillForm() {
  const { token } = useAuth();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [file, setFile] = useState<File | null>(null);

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

            console.log(values);
            console.log(file);
            const formData = new FormData();
            formData.append("file", file!);
            formData.append("skillName", values.skillName);
            try {
              const response = await fetch(`${URL_SERVER}/skills`, {
                method: "POST",
                headers: {
                  Authorization: `Bearer ${token}`,
                },
                body: formData,
              });
              if (!response.ok) {
                throw new Error("create a new skill failed!!");
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
          className="w-full p-2 flex flex-col gap-4"
        >
          <Card className="w-full">
            <div className="w-full flex items-center justify-center gap-4 flex-col">
              {file ? (
                <div className="relative w-40 h-40 rounded-2xl">
                  <img
                    className="w-40 h-40 object-cover rounded-2xl"
                    src={file ? URL.createObjectURL(file) : ""}
                    alt="compnay logo image"
                  />
                  {!isSubmitting && (
                    <button
                      className="cursor-pointer hover:bg-red-700 bg-red-500 duration-150 absolute -top-0  -right-0 p-2 rounded-2xl flex items-center justify-center text-white "
                      onClick={() => setFile(null)}
                    >
                      <XIcon size={20} />
                    </button>
                  )}
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
                readOnly={isSubmitting}
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
          <Card className="p-4">
            <input
              readOnly={isSubmitting}
              className="p-2 border rounded-md"
              type="text"
              id="skillName"
              placeholder="skillName"
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
  );
}

export default SkillForm;
