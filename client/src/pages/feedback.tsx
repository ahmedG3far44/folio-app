import { z } from "zod";
import { ChangeEvent, useState } from "react";
import { useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { feedbackSchema } from "@/lib/schemas";
import { Label } from "@/components/ui/label";

import {
  CheckCircle2,
  Image as ImageIcon,
  Video as VideoIcon,
  MessageSquareText,
  User,
  Briefcase,
  X,
  ArrowLeft,
  Heart,
  Star,
} from "lucide-react";

import ErrorMessage from "@/components/ErrorMessage";
import toast from "react-hot-toast";
import { motion } from "motion/react";

const URL_SERVER = import.meta.env.VITE_API_URL as string;

const colors = {
  bg: "#0a0a0b",
  surface: "#141416",
  surfaceHover: "#1c1c1f",
  border: "#26262b",
  borderActive: "#3b3b45",
  text: "#f4f4f5",
  textSecondary: "#a1a1aa",
  textMuted: "#6b6b76",
  accent: "#a78bfa",
  accentDim: "#7c5cbf",
  success: "#4ade80",
  error: "#f87171",
  overlay: "rgba(0,0,0,0.6)",
};

function FileUpload({
  id,
  label,
  accept,
  file,
  onFileChange,
  disabled = false,
  preview,
}: {
  id: string;
  label: string;
  accept: string;
  file: File | null;
  onFileChange: (file: File | null) => void;
  disabled?: boolean;
  preview?: "image" | "video";
}) {
  const [dragOver, setDragOver] = useState(false);
  const isImage = preview === "image";
  const isVideo = preview === "video";

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const f = e.dataTransfer.files?.[0];
    if (f) onFileChange(f);
  };

  return (
    <div className="space-y-2">
      <Label className="text-sm font-medium" style={{ color: colors.text }}>{label}</Label>
      {file ? (
        <div
          className="relative rounded-xl overflow-hidden border"
          style={{ borderColor: colors.border }}
        >
          {isImage && (
            <div className="relative w-28 h-28 mx-auto my-3">
              <img
                className="w-full h-full object-cover rounded-full"
                src={URL.createObjectURL(file)}
                alt="Preview"
              />
              {!disabled && (
                <button
                  type="button"
                  className="absolute -top-1 -right-1 w-7 h-7 rounded-full flex items-center justify-center cursor-pointer transition-opacity hover:opacity-80"
                  style={{ backgroundColor: colors.error, color: "#fff" }}
                  onClick={() => onFileChange(null)}
                >
                  <X size={14} />
                </button>
              )}
            </div>
          )}
          {isVideo && (
            <div className="relative max-w-sm mx-auto p-2">
              <video
                autoPlay
                loop
                muted
                className="w-full rounded-lg"
                style={{ border: `1px solid ${colors.border}` }}
                src={URL.createObjectURL(file)}
              />
              {!disabled && (
                <button
                  type="button"
                  className="absolute top-1 right-1 w-7 h-7 rounded-full flex items-center justify-center cursor-pointer transition-opacity hover:opacity-80"
                  style={{ backgroundColor: colors.error, color: "#fff" }}
                  onClick={() => onFileChange(null)}
                >
                  <X size={14} />
                </button>
              )}
            </div>
          )}
        </div>
      ) : (
        <label
          htmlFor={id}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          className="flex flex-col items-center justify-center w-full py-10 rounded-xl border-2 border-dashed cursor-pointer transition-all duration-200"
          style={{
            borderColor: dragOver ? colors.accent : colors.border,
            backgroundColor: dragOver ? "rgba(167,139,250,0.06)" : colors.surface,
          }}
        >
          <div className="flex flex-col items-center gap-2">
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center"
              style={{ backgroundColor: `${colors.accent}15` }}
            >
              {isImage ? <ImageIcon size={22} style={{ color: colors.accent }} /> : <VideoIcon size={22} style={{ color: colors.accent }} />}
            </div>
            <p className="text-sm font-medium" style={{ color: colors.textSecondary }}>
              <span className="underline underline-offset-2 decoration-1" style={{ color: colors.accent }}>
                Click to upload
              </span>{" "}
              or drag and drop
            </p>
            <p className="text-xs" style={{ color: colors.textMuted }}>
              {isImage ? "PNG, JPG, GIF — max 10MB" : "MP4, WebM — max 50MB"}
            </p>
          </div>
        </label>
      )}
      <input
        id={id}
        type="file"
        accept={accept}
        className="hidden"
        onChange={(e: ChangeEvent<HTMLInputElement>) =>
          onFileChange(e.target.files?.[0] || null)
        }
        disabled={disabled}
      />
    </div>
  );
}

function SuccessState({ onReset }: { onReset: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="min-h-screen flex items-center justify-center p-4"
      style={{ backgroundColor: colors.bg }}
    >
      <div className="max-w-md w-full text-center space-y-6">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.15, type: "spring", stiffness: 200, damping: 15 }}
          className="w-20 h-20 rounded-full flex items-center justify-center mx-auto"
          style={{ backgroundColor: `${colors.success}18` }}
        >
          <CheckCircle2 size={40} style={{ color: colors.success }} />
        </motion.div>
        <div className="space-y-2">
          <h1 className="text-2xl font-bold tracking-tight" style={{ color: colors.text }}>
            Feedback Submitted!
          </h1>
          <p className="text-sm leading-relaxed" style={{ color: colors.textSecondary }}>
            Thank you for sharing your thoughts. Your feedback helps make this portfolio better.
          </p>
        </div>
        <div className="flex items-center justify-center gap-1 pt-2">
          {[1, 2, 3, 4, 5].map((i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + i * 0.08 }}
            >
              <Star size={18} fill={colors.accent} color={colors.accent} />
            </motion.div>
          ))}
        </div>
        <button
          onClick={onReset}
          className="inline-flex items-center gap-2 text-sm font-medium cursor-pointer transition-opacity hover:opacity-70"
          style={{ color: colors.accent }}
        >
          <ArrowLeft size={16} />
          Submit another feedback
        </button>
      </div>
    </motion.div>
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
          toast.error("Please write your feedback");
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
        throw new Error(errorData.message || "Failed to submit feedback");
      }

      await response.json();
      setProfile(null);
      setFeedBackVideo(null);
      reset();
      setSuccess(true);
      toast.success("Feedback submitted!");
    } catch (err) {
      toast.error((err as Error).message);
    }
  };

  if (isFeedBackAdded) {
    return <SuccessState onReset={() => setSuccess(false)} />;
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4 sm:p-6 lg:p-10"
      style={{ backgroundColor: colors.bg }}
    >
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-xl rounded-2xl border overflow-hidden"
        style={{
          backgroundColor: colors.surface,
          borderColor: colors.border,
        }}
      >
        <div className="p-6 sm:p-8 space-y-8">
          <div className="space-y-1.5">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight" style={{ color: colors.text }}>
              Share Your Feedback
            </h1>
            <p className="text-sm" style={{ color: colors.textSecondary }}>
              I'd love to hear about your experience working with me
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <FileUpload
              id="profile"
              label="Your Photo"
              accept="image/*"
              file={profile}
              onFileChange={setProfile}
              disabled={isSubmitting}
              preview="image"
            />

            <div
              className="rounded-xl border p-5 space-y-5"
              style={{ borderColor: colors.border, backgroundColor: colors.bg }}
            >
              <div className="space-y-1.5">
                <Label htmlFor="name" style={{ color: colors.text }}>
                  <span className="inline-flex items-center gap-1.5">
                    <User size={14} style={{ color: colors.accent }} />
                    Your Name
                  </span>
                </Label>
                <input
                  id="name"
                  type="text"
                  placeholder="e.g. Jane Smith"
                  disabled={isSubmitting}
                  className="w-full rounded-lg border px-3.5 py-2.5 text-sm outline-none transition-colors focus-visible:ring-[3px] placeholder:opacity-40 focus-visible:border-[color:--border-active]"
                  style={{
                    backgroundColor: colors.surface,
                    color: colors.text,
                    borderColor: errors.name ? colors.error : colors.border,
                    ["--border-active" as string]: colors.borderActive,
                  }}
                  {...register("name")}
                />
                {errors.name && (
                  <ErrorMessage message={errors.name.message as string} />
                )}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="position" style={{ color: colors.text }}>
                  <span className="inline-flex items-center gap-1.5">
                    <Briefcase size={14} style={{ color: colors.accent }} />
                    Your Role
                  </span>
                </Label>
                <input
                  id="position"
                  type="text"
                  placeholder="e.g. Product Designer at Acme"
                  disabled={isSubmitting}
                  className="w-full rounded-lg border px-3.5 py-2.5 text-sm outline-none transition-colors focus-visible:ring-[3px] placeholder:opacity-40 focus-visible:border-[color:--border-active]"
                  style={{
                    backgroundColor: colors.surface,
                    color: colors.text,
                    borderColor: errors.position ? colors.error : colors.border,
                    ["--border-active" as string]: colors.borderActive,
                  }}
                  {...register("position")}
                />
                {errors.position && (
                  <ErrorMessage message={errors.position.message as string} />
                )}
              </div>
            </div>

            <div className="space-y-3">
              <Label style={{ color: colors.text }}>
                <span className="inline-flex items-center gap-1.5">
                  <MessageSquareText size={14} style={{ color: colors.accent }} />
                  Feedback Type
                </span>
              </Label>
              <div className="grid grid-cols-2 gap-2">
                {(["text", "video"] as const).map((type) => {
                  const isActive = feedbackType === type;
                  const Icon = type === "text" ? MessageSquareText : VideoIcon;
                  return (
                    <button
                      key={type}
                      type="button"
                      disabled={isSubmitting}
                      className="flex items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-medium cursor-pointer transition-all duration-150"
                      style={{
                        backgroundColor: isActive ? colors.accent : colors.surface,
                        color: isActive ? "#0a0a0b" : colors.textSecondary,
                        border: `1px solid ${isActive ? colors.accent : colors.border}`,
                      }}
                      onClick={() => setFeedBackType(type)}
                    >
                      <Icon size={16} />
                      {type === "text" ? "Written" : "Video"}
                    </button>
                  );
                })}
              </div>
            </div>

            {feedbackType === "text" ? (
              <div className="space-y-1.5">
                <Label htmlFor="feedback" style={{ color: colors.text }}>Your Message</Label>
                <textarea
                  id="feedback"
                  placeholder="Share your thoughts, experience, or a quick testimonial..."
                  rows={5}
                  disabled={isSubmitting}
                  className="w-full rounded-lg border px-3.5 py-2.5 text-sm outline-none transition-colors focus-visible:ring-[3px] resize-none placeholder:opacity-40 focus-visible:border-[color:--border-active]"
                  style={{
                    backgroundColor: colors.surface,
                    color: colors.text,
                    borderColor: errors.feedback ? colors.error : colors.border,
                    ["--border-active" as string]: colors.borderActive,
                  }}
                  {...register("feedback")}
                />
                {errors.feedback && (
                  <ErrorMessage message={errors.feedback.message as string} />
                )}
              </div>
            ) : (
              <FileUpload
                id="feedbackVideo"
                label="Video Message"
                accept="video/mp4,video/webm"
                file={video}
                onFileChange={setFeedBackVideo}
                disabled={isSubmitting}
                preview="video"
              />
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-lg py-2.5 text-sm font-semibold cursor-pointer transition-all duration-150 disabled:opacity-40 disabled:cursor-not-allowed hover:brightness-110"
              style={{
                backgroundColor: colors.accent,
                color: "#0a0a0b",
              }}
            >
              {isSubmitting ? (
                <span className="inline-flex items-center gap-2">
                  <span
                    className="inline-block w-4 h-4 rounded-full border-2 border-transparent animate-spin"
                    style={{
                      borderTopColor: "#0a0a0b",
                      borderRightColor: "#0a0a0b",
                    }}
                  />
                  Submitting...
                </span>
              ) : (
                <span className="inline-flex items-center gap-2">
                  <Heart size={16} />
                  Submit Feedback
                </span>
              )}
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  );
}

export default UserFeedBack;
