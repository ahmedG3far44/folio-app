import { z } from "zod";
import { ChangeEvent, useState } from "react";
import { useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { feedbackSchema } from "@/lib/schemas";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";

import {
  PartyPopper,
  XIcon,
  Upload,
  User,
  Video as VideoIcon,
} from "lucide-react";

import ErrorMessage from "@/components/ErrorMessage";
import toast from "react-hot-toast";

const URL_SERVER = import.meta.env.VITE_URL_SERVER as string;

interface FileUploadProps {
  id: string;
  label: string;
  accept: string;
  file: File | null;
  onFileChange: (file: File | null) => void;
  disabled?: boolean;
  preview?: "image" | "video";
}

function FileUpload({
  id,
  label,
  accept,
  file,
  onFileChange,
  disabled = false,
  preview,
}: FileUploadProps) {
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null;
    onFileChange(selectedFile);
  };

  const handleRemove = () => {
    onFileChange(null);
  };

  return (
    <div className="w-full space-y-2 border-dashed-2 rounded-md">
      <Label htmlFor={id} className="text-sm font-medium">
        {label}
      </Label>

      {file ? (
        <div className="relative w-full">
          {preview === "image" && (
            <div className="relative w-32 h-32 mx-auto">
              <img
                className="w-full h-full object-cover rounded-full border-2 border-border"
                src={URL.createObjectURL(file)}
                alt="Preview"
              />
              {!disabled && (
                <button
                  type="button"
                  className="absolute top-0 right-0 h-8 w-8 rounded-full bg-red-500 text-white cursor-pointer hover:opacity-50 flex items-center justify-center duration-300"
                  onClick={handleRemove}
                >
                  <XIcon className="h-4 w-4" />
                </button>
              )}
            </div>
          )}

          {preview === "video" && (
            <div className="relative w-full max-w-md mx-auto">
              <video
                autoPlay
                loop
                muted
                className="w-full rounded-lg border-2 border-border"
                src={URL.createObjectURL(file)}
              />
              {!disabled && (
                <button
                  type="button"
                  className="absolute -top-1 -right-1 h-8 w-8 rounded-full bg-red-500 text-white cursor-pointer hover:opacity-50 flex items-center justify-center duration-300"
                  onClick={handleRemove}
                >
                  <XIcon className="h-4 w-4" />
                </button>
              )}
            </div>
          )}
        </div>
      ) : (
        <label
          htmlFor={id}
          className="flex flex-col items-center justify-center w-full h-32 p-8  border border-dashed border-zinc-700 rounded-lg cursor-pointer bg-zinc-950 hover:bg-zinc-800 text-white transition-colors duration-300"
        >
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            <Upload className="w-10 h-10 mb-3 text-muted-foreground" />
            <p className="mb-2 text-sm text-muted-foreground">
              <span className="font-semibold">Click to upload</span> or drag and
              drop
            </p>
            <p className="text-xs text-muted-foreground">
              {accept.includes("image") && "PNG, JPG, GIF up to 10MB"}
              {accept.includes("video") && "MP4, WebM up to 50MB"}
            </p>
          </div>
        </label>
      )}

      <Input
        id={id}
        type="file"
        accept={accept}
        className="hidden"
        onChange={handleChange}
        disabled={disabled}
      />
    </div>
  );
}

function UserFeedBack() {
  const { userId } = useParams();
  const [profile, setProfile] = useState<File | null>(null);
  const [isFeedBackAdded, setSuccess] = useState<boolean>(false);
  const [feedbackType, setFeedBackType] = useState<"text" | "video">("text");
  const [video, setFeedBackVideo] = useState<File | null>(null);

  const {
    register,
    reset,
    getValues,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<z.infer<typeof feedbackSchema>>({
    resolver: zodResolver(feedbackSchema),
  });

  const onSubmit = async () => {
    try {
      const values = getValues();
      const formData = new FormData();
      const { name, position } = values;

      if (!profile) {
        toast.error("Please upload a profile image");
        return;
      }

      formData.append("profile", profile);
      formData.append("name", name);
      formData.append("position", position);

      if (feedbackType === "text") {
        if (!values.feedback) {
          toast.error("Please provide feedback text");
          return;
        }
        formData.append("feedback", values.feedback);
      } else {
        if (!video) {
          toast.error("Please upload a feedback video");
          return;
        }
        formData.append("video", video);
      }

      const response = await fetch(`${URL_SERVER}/feedback/${userId}`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to add feedback");
      }

      const data = await response.json();

      setProfile(null);
      setFeedBackVideo(null);
      reset();
      setSuccess(true);
      toast.success("Your feedback has been added successfully!");

      return data;
    } catch (err) {
      toast.error((err as Error).message);
      console.error("Feedback submission error:", err);
    }
  };

  if (isFeedBackAdded) {
    return (
      <div className="w-full flex items-center justify-center min-h-screen p-4 bg-black text-white">
        <div className="w-full max-w-md">
          <div className="flex flex-col items-center pt-6">
            <div className="p-4 rounded-full bg-primary/10 mb-4">
              <PartyPopper className="w-12 h-12" />
            </div>
            <h2 className="text-2xl font-bold text-center mb-2">
              Feedback Submitted Successfully!
            </h2>
            <p className="text-center text-muted-foreground">
              Thank you for sharing your feedback. We appreciate your input!
            </p>
          </div>
          <div className="justify-center">
            <button onClick={() => setSuccess(false)}>
              Submit Another Feedback
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full flex items-center justify-center min-h-screen p-4 bg-black text-white lg:p-24">
      <div className="w-full max-w-2xl rounded-md shadow-md bg-zinc-900 border border-zinc-700">
        <div className="p-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold mb-2">Share Your Feedback</h1>
            <p className="text-sm">We'd love to hear about your experience</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <FileUpload
              id="profile"
              label="Profile Image"
              accept="image/*"
              file={profile}
              onFileChange={setProfile}
              disabled={isSubmitting}
              preview="image"
            />
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                className={`border border-zinc-700`}
                id="name"
                type="text"
                placeholder="Enter your name"
                disabled={isSubmitting}
                {...register("name")}
              />
              {errors.name && (
                <ErrorMessage message={errors.name.message as string} />
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="position">Position</Label>
              <Input
                className={`border border-zinc-700`}
                id="position"
                type="text"
                placeholder="Your role or position"
                disabled={isSubmitting}
                {...register("position")}
              />
              {errors.position && (
                <ErrorMessage message={errors.position.message as string} />
              )}
            </div>

            <div className="space-y-2">
              <Label>Feedback Type</Label>
              <div className="flex gap-2">
                <button
                  type="button"
                  className={`flex-1 bg-zinc-950 text-white border border-zinc-700 flex items-center justify-center gap-2 rounded-md py-2 px-4 cursor-pointer hover:opacity-90 ${
                    feedbackType === "text" ? "border" : "border-none"
                  }`}
                  onClick={() => setFeedBackType("text")}
                  disabled={isSubmitting}
                >
                  <User className="w-4 h-4 mr-2" />
                  Text
                </button>
                <button
                  type="button"
                  className={`flex-1 bg-zinc-950 text-white  border-zinc-700 flex items-center justify-center gap-2 rounded-md py-2 px-4 cursor-pointer hover:opacity-90 ${
                    feedbackType === "video" ? "border" : "border-none"
                  }`}
                  onClick={() => setFeedBackType("video")}
                  disabled={isSubmitting}
                >
                  <VideoIcon className="w-4 h-4 mr-2" />
                  Video
                </button>
              </div>
            </div>

            {feedbackType === "text" ? (
              <div className="space-y-2">
                <Label htmlFor="feedback">Your Feedback</Label>
                <Textarea
                  id="feedback"
                  placeholder="Share your thoughts and experience..."
                  className="min-h-[150px] resize-none border border-zinc-700"
                  disabled={isSubmitting}
                  {...register("feedback")}
                />
                {errors.feedback && (
                  <ErrorMessage message={errors.feedback.message as string} />
                )}
              </div>
            ) : (
              <FileUpload
                id="feedbackVideo"
                label="Feedback Video"
                accept="video/mp4,video/webm"
                file={video}
                onFileChange={setFeedBackVideo}
                disabled={isSubmitting}
                preview="video"
              />
            )}
            <button
              className="w-full py-2 px-4 rounded-md text-sm text-center border border-zinc-700  cursor-pointer hover:opacity-70 duration-300 "
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Submitting..." : "Submit Feedback"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default UserFeedBack;
