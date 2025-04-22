import { z } from "zod";
import { contactsSchema } from "@/lib/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { useUser } from "@/contexts/UserProvider";
import { useAuth } from "@/contexts/AuthProvider";

import toast from "react-hot-toast";
import ErrorMessage from "../ErrorMessage";
import SubmitButton from "../submit-button";
import { useTheme } from "@/contexts/ThemeProvider";
import { Card } from "../ui/card";

const URL_SERVER = import.meta.env.VITE_URL_SERVER as string;

function ContactForm() {
  const { token } = useAuth();
  const { activeTheme } = useTheme();
  const { contacts } = useUser();
  const {
    register,
    reset,
    handleSubmit,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm<z.infer<typeof contactsSchema>>({
    resolver: zodResolver(contactsSchema),
  });
  return (
    <form
      
      className="w-full flex flex-col justify-start items-start gap-2"
      onSubmit={handleSubmit(async () => {
        const values = getValues();
        const { github, linkedin, youtube, twitter } = values;
        try {
          const response = await fetch(
            `${URL_SERVER}/contacts/${contacts.id}`,
            {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify({
                linkedin,
                github,
                youtube,
                twitter,
              }),
            }
          );
          if (!response.ok) {
            throw new Error("can't update contacts info!!");
          }
          //   const data = await response.json();
          //   console.log(data);
          reset();
          toast.success("contact inof was updated success");
          return;
        } catch (err) {
          console.log((err as Error).message);
          toast.error((err as Error).message);
          return;
        }
      })}
    >
      <Card
        style={{
          backgroundColor: activeTheme.cardColor,
          border: `1px solid ${activeTheme.borderColor}`,
        }}
        className={"w-full p-4"}
      >
        <input
            style={{
              backgroundColor: activeTheme.backgroundColor,
              color: activeTheme.primaryText,
              borderColor: activeTheme.borderColor,
            }}
          {...register("github")}
          defaultValue={contacts.github}
          readOnly={isSubmitting}
          placeholder="github profile url"
          type="url"
          className="p-2 w-full border border-zinc-200 rounded-md"
        />
        {errors.github && (
          <ErrorMessage message={errors.github.message?.toString() as string} />
        )}
        <input
           style={{
            backgroundColor: activeTheme.backgroundColor,
            color: activeTheme.primaryText,
            borderColor: activeTheme.borderColor,
          }}
          {...register("linkedin")}
          defaultValue={contacts.linkedin}
          readOnly={isSubmitting}
          placeholder="linkedin profile url"
          type="url"
          className="p-2 w-full border border-zinc-200 rounded-md"
        />
        {errors.linkedin && (
          <ErrorMessage
            message={errors.linkedin.message?.toString() as string}
          />
        )}
        <input
           style={{
            backgroundColor: activeTheme.backgroundColor,
            color: activeTheme.primaryText,
            borderColor: activeTheme.borderColor,
          }}
          {...register("youtube")}
          defaultValue={contacts.youtube}
          readOnly={isSubmitting}
          placeholder="youtube channel url"
          type="url"
          className="p-2 w-full border border-zinc-200 rounded-md"
        />
        {errors.youtube && (
          <ErrorMessage
            message={errors.youtube.message?.toString() as string}
          />
        )}
        <input
           style={{
            backgroundColor: activeTheme.backgroundColor,
            color: activeTheme.primaryText,
            borderColor: activeTheme.borderColor,
          }}
          {...register("twitter")}
          defaultValue={contacts.twitter}
          readOnly={isSubmitting}
          placeholder="twitter profile url"
          type="url"
          className="p-2 w-full border border-zinc-200 rounded-md"
        />
        {errors.twitter && (
          <ErrorMessage
            message={errors.twitter.message?.toString() as string}
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
  );
}

export default ContactForm;
