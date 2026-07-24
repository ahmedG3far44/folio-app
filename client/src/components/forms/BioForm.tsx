import { z } from "zod";
import { useState } from "react";
import { bioSchema } from "@/lib/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { useUser } from "@/contexts/UserProvider";
import { useAuth } from "@/contexts/AuthProvider";

import { Button } from "../ui/button";
import SubmitButton from "../submit-button";
import ErrorMessage from "../ErrorMessage";
import toast from "react-hot-toast";
import ContactForm from "./ContactForm";
import { Camera, Pencil, X } from "lucide-react";
import UploadResume from "./UploadResume";
import { useTheme } from "@/contexts/ThemeProvider";
import { Label } from "../ui/label";
import Image from "../ui/image";

const URL_SERVER = import.meta.env.VITE_API_URL as string;

function BioForm() {
  const [isBioOpen, setIsBioOpen] = useState<boolean>(false);
  const [isContactOpen, setIsContactOpen] = useState<boolean>(false);
  const [isResumeOpen, setIsResumeOpen] = useState<boolean>(false);
  const { bio } = useUser();
  const { activeTheme } = useTheme();
  const { token, user, login } = useAuth();
  const [pictureFile, setPictureFile] = useState<File | null>(null);
  const [pictureUploading, setPictureUploading] = useState(false);

  const handlePictureUpload = async () => {
    if (!pictureFile) return;
    try {
      setPictureUploading(true);
      const formData = new FormData();
      formData.append("picture", pictureFile);

      const response = await fetch(`${URL_SERVER}/user/profile-picture`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      if (!response.ok) throw new Error("Failed to update profile picture");
      const result = await response.json();
      const updatedUser = result.data;

      login({ user: updatedUser, token });
      setPictureFile(null);
      toast.success("Profile picture updated");
    } catch (err) {
      toast.error((err as Error).message);
    } finally {
      setPictureUploading(false);
    }
  };

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
    <div className="space-y-8">
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Profile Picture</h2>
        </div>
        <div
          className="rounded-xl border p-5"
          style={{
            backgroundColor: activeTheme.cardColor,
            borderColor: activeTheme.borderColor,
          }}
        >
          <div className="flex items-center gap-5">
            <div className="relative shrink-0">
              <div className="w-20 h-20 md:w-24 md:h-24 rounded-full overflow-hidden border-2"
                style={{ borderColor: activeTheme.borderColor }}>
                {pictureFile ? (
                  <img
                    className="w-full h-full object-cover"
                    src={URL.createObjectURL(pictureFile)}
                    alt="Preview"
                  />
                ) : (
                  <Image
                    className="w-full h-full object-cover"
                    src={user?.picture || ""}
                    alt={user?.name || "Profile"}
                  />
                )}
              </div>
              <label
                htmlFor="profilePicture"
                className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full flex items-center justify-center cursor-pointer transition-opacity hover:opacity-80 border"
                style={{
                  backgroundColor: activeTheme.backgroundColor,
                  borderColor: activeTheme.borderColor,
                  color: activeTheme.primaryText,
                }}
              >
                <Camera size={14} />
              </label>
              <input
                id="profilePicture"
                type="file"
                accept="image/*"
                className="hidden"
                disabled={pictureUploading}
                onChange={(e) => setPictureFile(e.target?.files?.[0] || null)}
              />
            </div>

            <div className="space-y-2">
              <p className="text-sm font-medium" style={{ color: activeTheme.primaryText }}>
                {user?.name || "Your Name"}
              </p>
              <p className="text-xs" style={{ color: activeTheme.secondaryText }}>
                JPEG, PNG, WEBP — max 5MB
              </p>
              <div className="flex items-center gap-2">
                {pictureFile && (
                  <>
                    <Button
                      type="button"
                      size="sm"
                      className="cursor-pointer"
                      disabled={pictureUploading}
                      onClick={handlePictureUpload}
                    >
                      {pictureUploading ? "Uploading..." : "Save"}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="cursor-pointer"
                      disabled={pictureUploading}
                      onClick={() => setPictureFile(null)}
                    >
                      Cancel
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Bio Info</h2>
          <Button
            variant="outline"
            size="sm"
            className="cursor-pointer"
            onClick={() => setIsBioOpen(!isBioOpen)}
          >
            {isBioOpen ? <X size={16} /> : <Pencil size={16} />}
            {isBioOpen ? "Close" : "Edit"}
          </Button>
        </div>
        {isBioOpen && (
          <form
            onSubmit={handleSubmit(async () => {
              const values = getValues();
              try {
                const response = await fetch(`${URL_SERVER}/bio/${bio.id}`, {
                  method: "PUT",
                  headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                  },
                  body: JSON.stringify(values),
                });
                if (!response.ok) throw new Error("Update failed");
                const data = await response.json();
                toast.success(data.message);
                reset();
              } catch (err) {
                toast.error((err as Error).message);
              }
            })}
            className="space-y-4"
          >
            <div
              className="space-y-4 p-5 rounded-xl border"
              style={{
                backgroundColor: activeTheme.cardColor,
                borderColor: activeTheme.borderColor,
              }}
            >
              <div className="space-y-1.5">
                <Label htmlFor="name" style={{ color: activeTheme.primaryText }}>
                  Full Name
                </Label>
                <input
                  {...register("name")}
                  defaultValue={bio.bioName}
                  readOnly={isSubmitting}
                  placeholder="Your name"
                  className="w-full rounded-lg border px-3 py-2 text-sm outline-none transition-colors focus-visible:ring-[3px]"
                  style={{
                    backgroundColor: activeTheme.backgroundColor,
                    color: activeTheme.primaryText,
                    borderColor: activeTheme.borderColor,
                  }}
                />
                {errors.name && (
                  <ErrorMessage message={errors.name.message?.toString() || ""} />
                )}
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="jobTitle" style={{ color: activeTheme.primaryText }}>
                  Job Title
                </Label>
                <input
                  {...register("jobTitle")}
                  defaultValue={bio.jobTitle}
                  readOnly={isSubmitting}
                  placeholder="e.g. Software Engineer"
                  className="w-full rounded-lg border px-3 py-2 text-sm outline-none transition-colors focus-visible:ring-[3px]"
                  style={{
                    backgroundColor: activeTheme.backgroundColor,
                    color: activeTheme.primaryText,
                    borderColor: activeTheme.borderColor,
                  }}
                />
                {errors.jobTitle && (
                  <ErrorMessage message={errors.jobTitle.message?.toString() || ""} />
                )}
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="summary" style={{ color: activeTheme.primaryText }}>
                  Bio Summary
                </Label>
                <textarea
                  {...register("summary")}
                  defaultValue={bio.bio}
                  readOnly={isSubmitting}
                  placeholder="Write a short bio..."
                  rows={4}
                  className="w-full rounded-lg border px-3 py-2 text-sm outline-none transition-colors focus-visible:ring-[3px] resize-y"
                  style={{
                    backgroundColor: activeTheme.backgroundColor,
                    color: activeTheme.primaryText,
                    borderColor: activeTheme.borderColor,
                  }}
                />
                {errors.summary && (
                  <ErrorMessage message={errors.summary.message?.toString() || ""} />
                )}
              </div>
            </div>
            <SubmitButton className="w-full" loading={isSubmitting} type="submit">
              Save Changes
            </SubmitButton>
          </form>
        )}
      </section>

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Contacts</h2>
          <Button
            variant="outline"
            size="sm"
            className="cursor-pointer"
            onClick={() => setIsContactOpen(!isContactOpen)}
          >
            {isContactOpen ? <X size={16} /> : <Pencil size={16} />}
            {isContactOpen ? "Close" : "Edit"}
          </Button>
        </div>
        {isContactOpen && <ContactForm />}
      </section>

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Resume</h2>
          <Button
            variant="outline"
            size="sm"
            className="cursor-pointer"
            onClick={() => setIsResumeOpen(!isResumeOpen)}
          >
            {isResumeOpen ? <X size={16} /> : <Pencil size={16} />}
            {isResumeOpen ? "Close" : "Edit"}
          </Button>
        </div>
        {isResumeOpen && (
          <div
            className="p-5 rounded-xl border"
            style={{
              backgroundColor: activeTheme.cardColor,
              borderColor: activeTheme.borderColor,
            }}
          >
            <UploadResume />
          </div>
        )}
      </section>
    </div>
  );
}

export default BioForm;
