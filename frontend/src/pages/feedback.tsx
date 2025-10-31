import { z } from "zod";
import { ChangeEvent, useState } from "react";
import { useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { feedbackSchema } from "@/lib/schemas";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
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
import SubmitButton from "@/components/submit-button";
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
    <div className="w-full space-y-2">
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
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  className="absolute -top-2 -right-2 h-8 w-8 rounded-full"
                  onClick={handleRemove}
                >
                  <XIcon className="h-4 w-4" />
                </Button>
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
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  className="absolute -top-2 -right-2 h-8 w-8 rounded-full"
                  onClick={handleRemove}
                >
                  <XIcon className="h-4 w-4" />
                </Button>
              )}
            </div>
          )}
        </div>
      ) : (
        <label
          htmlFor={id}
          className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-border rounded-lg cursor-pointer bg-card hover:bg-accent/50 transition-colors"
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
      <div className="w-full flex items-center justify-center min-h-screen p-4 bg-background">
        <Card className="w-full max-w-md">
          <CardContent className="flex flex-col items-center pt-6">
            <div className="p-4 rounded-full bg-primary/10 mb-4">
              <PartyPopper className="w-12 h-12 text-primary" />
            </div>
            <h2 className="text-2xl font-bold text-center mb-2">
              Feedback Submitted Successfully!
            </h2>
            <p className="text-center text-muted-foreground">
              Thank you for sharing your feedback. We appreciate your input!
            </p>
          </CardContent>
          <CardFooter className="justify-center">
            <Button variant="outline" onClick={() => setSuccess(false)}>
              Submit Another Feedback
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="w-full flex items-center justify-center min-h-screen p-4 lg:p-24 bg-background">
      <Card className="w-full max-w-2xl">
        <CardContent className="p-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold mb-2">Share Your Feedback</h1>
            <p className="text-muted-foreground">
              We'd love to hear about your experience
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Profile Image Upload */}
            <FileUpload
              id="profile"
              label="Profile Image"
              accept="image/*"
              file={profile}
              onFileChange={setProfile}
              disabled={isSubmitting}
              preview="image"
            />

            {/* Name Input */}
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
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

            {/* Position Input */}
            <div className="space-y-2">
              <Label htmlFor="position">Position</Label>
              <Input
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

            {/* Feedback Type Toggle */}
            <div className="space-y-2">
              <Label>Feedback Type</Label>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant={feedbackType === "text" ? "default" : "outline"}
                  className="flex-1"
                  onClick={() => setFeedBackType("text")}
                  disabled={isSubmitting}
                >
                  <User className="w-4 h-4 mr-2" />
                  Text
                </Button>
                <Button
                  type="button"
                  variant={feedbackType === "video" ? "default" : "outline"}
                  className="flex-1"
                  onClick={() => setFeedBackType("video")}
                  disabled={isSubmitting}
                >
                  <VideoIcon className="w-4 h-4 mr-2" />
                  Video
                </Button>
              </div>
            </div>

            {/* Feedback Content */}
            {feedbackType === "text" ? (
              <div className="space-y-2">
                <Label htmlFor="feedback">Your Feedback</Label>
                <Textarea
                  id="feedback"
                  placeholder="Share your thoughts and experience..."
                  className="min-h-[150px] resize-none"
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

            {/* Submit Button */}
            <SubmitButton
              className="w-full"
              type="submit"
              loading={isSubmitting}
            >
              Submit Feedback
            </SubmitButton>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

export default UserFeedBack;
