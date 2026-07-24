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
import { Label } from "../ui/label";

const URL_SERVER = import.meta.env.VITE_API_URL as string;

const contactFields = [
  { id: "github", label: "GitHub URL", placeholder: "https://github.com/username" },
  { id: "linkedin", label: "LinkedIn URL", placeholder: "https://linkedin.com/in/username" },
  { id: "youtube", label: "YouTube URL", placeholder: "https://youtube.com/@channel" },
  { id: "twitter", label: "Twitter / X URL", placeholder: "https://x.com/username" },
] as const;

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
      onSubmit={handleSubmit(async () => {
        const values = getValues();
        try {
          const response = await fetch(`${URL_SERVER}/contacts/${contacts.id}`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(values),
          });
          if (!response.ok) throw new Error("Failed to update contacts");
          reset();
          toast.success("Contacts updated successfully");
        } catch (err) {
          toast.error((err as Error).message);
        }
      })}
      className="space-y-5"
    >
      <div
        className="space-y-4 p-5 rounded-xl border"
        style={{
          backgroundColor: activeTheme.cardColor,
          borderColor: activeTheme.borderColor,
        }}
      >
        {contactFields.map(({ id, label, placeholder }) => (
          <div key={id} className="space-y-1.5">
            <Label htmlFor={id} style={{ color: activeTheme.primaryText }}>
              {label}
            </Label>
            <input
              {...register(id)}
              defaultValue={contacts[id as keyof typeof contacts]}
              readOnly={isSubmitting}
              placeholder={placeholder}
              type="url"
              className="w-full rounded-lg border px-3 py-2 text-sm outline-none transition-colors focus-visible:ring-[3px]"
              style={{
                backgroundColor: activeTheme.backgroundColor,
                color: activeTheme.primaryText,
                borderColor: activeTheme.borderColor,
              }}
            />
            {errors[id as keyof typeof errors] && (
              <ErrorMessage
                message={errors[id as keyof typeof errors]?.message?.toString() || ""}
              />
            )}
          </div>
        ))}
      </div>
      <SubmitButton className="w-full" loading={isSubmitting} type="submit">
        Save Changes
      </SubmitButton>
    </form>
  );
}

export default ContactForm;
