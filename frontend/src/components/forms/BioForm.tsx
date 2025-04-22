import { z } from "zod";
import { useState } from "react";
import { bioSchema } from "@/lib/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { useUser } from "@/contexts/UserProvider";
import { useAuth } from "@/contexts/AuthProvider";

import { Card } from "../ui/card";
import { Button } from "../ui/button";
import SubmitButton from "../submit-button";
import ErrorMessage from "../ErrorMessage";
import toast from "react-hot-toast";
import ContactForm from "./ContactForm";
import { UserPen } from "lucide-react";
import UploadResume from "./UploadResume";
import { useTheme } from "@/contexts/ThemeProvider";

const URL_SERVER = import.meta.env.VITE_URL_SERVER as string;

function BioForm() {
  const [isBioOpen, setIsBioOpen] = useState<boolean>(false);
  const [isContactOpen, setIsContactOpen] = useState<boolean>(false);
  const [isResumeOpen, setIsResumeOpen] = useState<boolean>(false);
  // const [heroImage, setHeroImage] = useState<File | null>(null);
  const { bio } = useUser();
  const { activeTheme } = useTheme();
  const { token } = useAuth();
  const {
    register,
    reset,
    handleSubmit,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm<z.infer<typeof bioSchema>>({
    resolver: zodResolver(bioSchema),
  });
  return (
    <div
      style={{ color: activeTheme.primaryText }}
      className="w-full flex flex-col gap-4"
    >
      <div className="w-full p-4">
        <div className="w-full flex justify-between items-center">
          <h1>Bio Info</h1>
          <Button
            className="cursor-pointer"
            onClick={() => setIsBioOpen(!isBioOpen)}
          >
            {!isBioOpen ? <UserPen size={20} /> : "cancel"}
          </Button>
        </div>
        {isBioOpen && (
          <form
            onSubmit={handleSubmit(async () => {
              const values = getValues();
              const { name, jobTitle, summary } = values;
              try {
                const response = await fetch(`${URL_SERVER}/bio/${bio.id}`, {
                  method: "PUT",
                  headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                  },
                  body: JSON.stringify({
                    name,
                    jobTitle,
                    summary,
                  }),
                });
                if (!response.ok) {
                  throw new Error("update bio info failed!!");
                }
                const data = await response.json();

                reset();
                toast.success("bio info was updated success!!");
                return data;
              } catch (err) {
                console.log((err as Error).message);
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
              }}
              className="p-4 w-full"
            >
              <input
                style={{
                  backgroundColor: activeTheme.backgroundColor,
                  color: activeTheme.primaryText,
                  borderColor: activeTheme.borderColor,
                }}
                defaultValue={bio.jobTitle}
                readOnly={isSubmitting}
                className="p-2  w-full rounded-md"
                type="text"
                id="jobTitle"
                placeholder="Job title"
                {...register("jobTitle")}
              />
              {errors.jobTitle && (
                <ErrorMessage
                  message={errors.jobTitle.message?.toString() as string}
                />
              )}
              <input
              style={{
                backgroundColor: activeTheme.backgroundColor,
                color: activeTheme.primaryText,
                borderColor: activeTheme.borderColor,
              }}
                defaultValue={bio.bioName}
                readOnly={isSubmitting}
                className="p-2  rounded-md"
                type="text"
                id="name"
                placeholder="name"
                {...register("name")}
              />
              {errors.name && (
                <ErrorMessage
                  message={errors.name.message?.toString() as string}
                />
              )}
              <textarea
                style={{
                  backgroundColor: activeTheme.backgroundColor,
                  color: activeTheme.primaryText,
                  borderColor: activeTheme.borderColor,
                }}
                defaultValue={bio.bio}
                readOnly={isSubmitting}
                className="w-full p-2  rounded-md"
                id="bio"
                placeholder="bio"
                {...register("summary")}
              />
              {errors.summary && (
                <ErrorMessage
                  message={errors.summary.message?.toString() as string}
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
      <div className="w-full p-4 flex flex-col justify-start items-center gap-4">
        <div className="flex justify-between items-center w-full ">
          <h1>Contacts Info</h1>
          <Button
            className="cursor-pointer"
            onClick={() => setIsContactOpen(!isContactOpen)}
            type="button"
          >
            {!isContactOpen ? <UserPen size={20} /> : "cancel"}
          </Button>
        </div>
        {isContactOpen && (
          
            <ContactForm />
          
        )}
      </div>
      <div className="w-full p-4 flex flex-col justify-start items-center gap-4">
        <div className="flex justify-between items-center w-full ">
          <h1>Resume Info</h1>
          <Button
            className="cursor-pointer"
            onClick={() => setIsResumeOpen(!isResumeOpen)}
            type="button"
          >
            {!isResumeOpen ? <UserPen size={20} /> : "cancel"}
          </Button>
        </div>
        {isResumeOpen && (
          <Card
            style={{
              backgroundColor: activeTheme.cardColor,
              border: `1px solid ${activeTheme.borderColor}`,
            }}
            className={"w-full p-4"}
          >
            <UploadResume />
          </Card>
        )}
      </div>
    </div>
  );
}

export default BioForm;
