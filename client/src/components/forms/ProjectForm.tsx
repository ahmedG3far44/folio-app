import { z } from "zod";
import { ChangeEvent, useState } from "react";
import { IProjectImagesType, IProjectType } from "@/lib/types";
import { projectSchema } from "@/lib/schemas";
import { zodResolver } from "@hookform/resolvers/zod";

import { useForm } from "react-hook-form";
import { useTheme } from "@/contexts/ThemeProvider";
import { useAuth } from "@/contexts/AuthProvider";
import { useUser } from "@/contexts/UserProvider";

import { CirclePlus, X, FolderKanban } from "lucide-react";
import { Button } from "../ui/button";

import Tiptap from "../Tiptap";
import Loader from "../loader";
import toast from "react-hot-toast";
import ErrorMessage from "../ErrorMessage";
import SubmitButton from "../submit-button";
import UploadHere from "../cards/UploadHere";
import ShowListCard from "../cards/ShowListCard";

import checkUploadedImages from "@/lib/checkUploadedImages";
import { Label } from "../ui/label";

const URL_SERVER = import.meta.env.VITE_API_URL as string;

const THUMBNAIL_MAX = 10 * 1024 * 1024;
const IMAGE_MAX = 4 * 1024 * 1024;

export type ProjectFormData = {
  title: string;
  sourceUrl: string;
  description: string;
  tags: string[];
  thumbnail: File;
  images: (File | IProjectImagesType)[];
};

function ProjectForm() {
  const { token } = useAuth();
  const { activeTheme } = useTheme();
  const { projects, setProjects, pending } = useUser();
  const [isUpdating, setIsUpdating] = useState<boolean>(false);
  const [updatedProject, setUpdatedProject] = useState<IProjectType | null>(null);

  const [description, setDescription] = useState<string>("");

  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [thumbnail, setThumbnail] = useState<File | string | null>(
    updatedProject ? updatedProject.thumbnail : null
  );
  const [error, setError] = useState<string | null>(null);
  const [images, setImages] = useState<(File | IProjectImagesType)[] | null>(
    updatedProject ? updatedProject.ImagesList : null
  );
  const [tags, setTags] = useState<string[]>([]);
  const [oneTag, setOneTag] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

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
  } = useForm<z.infer<typeof projectSchema>>({
    resolver: zodResolver(projectSchema),
  });

  const handleAddingTags = () => {
    if (oneTag) {
      setTags([...tags, oneTag]);
      setOneTag(null);
    }
  };

  const addNewProject = async (data: ProjectFormData) => {
    const formData = new FormData();
    const { title, sourceUrl, description, tags, thumbnail, images } = data;
    formData.append("title", title);
    if (sourceUrl) formData.append("sourceUrl", sourceUrl);
    formData.append("description", description);
    formData.append("thumbnail", thumbnail);
    tags.forEach((tag) => formData.append("tags", tag));
    images.forEach((img) => formData.append("image", img as File));

    setIsUploading(true);
    try {
      const response = await fetch(`${URL_SERVER}/project`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      if (!response.ok) {
        const err = await response.json().catch(() => null);
        throw new Error(err?.message || "Failed to add new project");
      }
      const result = await response.json();
      setProjects(result.data);
      return result.data;
    } finally {
      setIsUploading(false);
    }
  };

  const handleThumbnailChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > THUMBNAIL_MAX) {
      setError("Thumbnail must be less than 10MB");
      e.target.value = "";
      return;
    }

    setThumbnail(file);
    setError(null);
  };

  const handleImagesChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    for (const f of Array.from(files)) {
      if (f.size > IMAGE_MAX) {
        setError(`"${f.name}" exceeds the 4MB limit`);
        e.target.value = "";
        return;
      }
    }

    setImages([...files]);
    setError(null);
  };

  const thumbnailSrc =
    thumbnail instanceof File
      ? URL.createObjectURL(thumbnail)
      : thumbnail || "";

  const isVideoFile = thumbnail instanceof File && thumbnail.type.startsWith("video/");

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Projects</h2>
        <Button
          variant="outline"
          size="sm"
          className="cursor-pointer"
          onClick={() => {
            setIsOpen(!isOpen);
            if (isOpen) {
              setIsUpdating(false);
              setUpdatedProject(null);
              setTags([]);
              setImages(null);
              setDescription("");
              setThumbnail(null);
              setError(null);
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

      {isOpen && !isUpdating && (
        <form
          onSubmit={handleSubmit(async () => {
            const { title, sourceUrl } = getValues();
            const projectData = { title, sourceUrl, description: description.trim(), tags, thumbnail, images };

            if (!thumbnail) {
              throw new Error("You must upload a thumbnail");
            }
            if (images && images.length > 0 && !checkUploadedImages(images as File[])) {
              throw new Error("You uploaded more than 5 images");
            }

            try {
              const newProject = await addNewProject(projectData as ProjectFormData);
              if (!newProject) throw new Error("Failed to add new project");
              setProjects(newProject);
              reset();
              setIsOpen(false);
              setTags([]);
              setImages(null);
              setDescription("");
              setThumbnail(null);
              setError(null);
              toast.success("Project added successfully");
            } catch (error) {
              toast.error((error as Error).message);
              setError((error as Error).message);
            }
          })}
          className="space-y-4"
        >
          {error && <ErrorMessage message={error} />}

          <div
            className="rounded-xl border p-5 space-y-5"
            style={{
              backgroundColor: activeTheme.cardColor,
              borderColor: activeTheme.borderColor,
            }}
          >
            <div className="flex justify-center">
              <div className="w-40">
                {thumbnail ? (
                  <div
                    className="relative border rounded-lg p-2 flex items-center justify-center"
                    style={{ borderColor: activeTheme.borderColor }}
                  >
                    {isVideoFile ? (
                      <video
                        className="w-32 h-32 object-cover rounded-lg"
                        src={thumbnailSrc}
                        controls
                      />
                    ) : (
                      <img
                        className="w-32 h-32 object-cover rounded-lg"
                        src={thumbnailSrc}
                        alt="project thumbnail"
                      />
                    )}
                    {!isUploading && (
                      <button
                        type="button"
                        className="cursor-pointer bg-red-600 p-1.5 hover:bg-red-700 duration-150 absolute -top-2.5 -right-2.5 rounded-full text-white"
                        onClick={() => {
                          if (updatedProject)
                            setUpdatedProject({ ...updatedProject, thumbnail: "" });
                          setThumbnail(null);
                        }}
                      >
                        <X size={14} />
                      </button>
                    )}
                  </div>
                ) : (
                  <UploadHere inputId="thumbnail" />
                )}
                <input
                  id="thumbnail"
                  type="file"
                  accept="image/*, video/*"
                  className="hidden"
                  disabled={isUploading}
                  onChange={handleThumbnailChange}
                />
              </div>
            </div>

            <div className="flex justify-center">
              <div className="w-full">
                {images !== null ? (
                  <div className="flex flex-wrap items-start justify-center gap-3">
                    {images?.map((img, index) => (
                      <div
                        key={index}
                        className="relative border rounded-lg p-2"
                        style={{ borderColor: activeTheme.borderColor }}
                      >
                        <img
                          className="w-24 h-24 object-cover rounded-md"
                          src={
                            img instanceof File
                              ? URL.createObjectURL(img)
                              : (img as IProjectImagesType).url
                          }
                          alt="project image"
                        />
                        {!isUploading && (
                          <button
                            type="button"
                            className="cursor-pointer bg-red-600 p-1.5 hover:bg-red-700 duration-150 absolute -top-2.5 -right-2.5 rounded-full text-white"
                            onClick={() => {
                              if (updatedProject) {
                                setUpdatedProject({
                                  ...updatedProject,
                                  ImagesList: updatedProject.ImagesList.filter(
                                    (fi) => fi.id !== (img as IProjectImagesType).id
                                  ),
                                });
                              } else {
                                const filtered = images.filter(
                                  (_, innerIndex) => index !== innerIndex
                                );
                                setImages(filtered.length > 0 ? filtered : null);
                              }
                            }}
                          >
                            <X size={14} />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <UploadHere inputId="images" />
                )}
                <input
                  id="images"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  multiple
                  disabled={isUploading}
                  onChange={handleImagesChange}
                />
              </div>
            </div>
          </div>

          <div
            className="rounded-xl border p-5 space-y-5"
            style={{
              backgroundColor: activeTheme.cardColor,
              borderColor: activeTheme.borderColor,
            }}
          >
            <div className="space-y-1.5">
              <Label htmlFor="title" style={{ color: activeTheme.primaryText }}>
                Project Title
              </Label>
              <input
                style={inputStyle}
                readOnly={isSubmitting || isUploading}
                className="w-full rounded-lg border px-3 py-2 text-sm outline-none transition-colors focus-visible:ring-[3px]"
                type="text"
                id="title"
                placeholder="Project Title"
                defaultValue={updatedProject ? updatedProject.title : ""}
                {...register("title")}
              />
              {errors.title && (
                <ErrorMessage message={errors.title.message?.toString() || ""} />
              )}
            </div>

            <div className="space-y-1.5">
              <Label style={{ color: activeTheme.primaryText }}>Tags</Label>
              <div className="flex items-center gap-2">
                <input
                  style={inputStyle}
                  readOnly={isSubmitting || isUploading}
                  className="flex-1 rounded-lg border px-3 py-2 text-sm outline-none transition-colors focus-visible:ring-[3px]"
                  type="text"
                  placeholder="Add a tag"
                  value={oneTag || ""}
                  onChange={(e) => setOneTag(e.target.value)}
                />
                <Button
                  disabled={isSubmitting || isUploading}
                  type="button"
                  size="sm"
                  className="cursor-pointer shrink-0"
                  onClick={handleAddingTags}
                >
                  Add Tag
                </Button>
              </div>
              {(tags.length > 0 || (updatedProject?.tags?.length ?? 0) > 0) && (
                <div className="flex flex-wrap items-center gap-2 pt-1">
                  {(updatedProject?.tags ? updatedProject.tags.map((t) => t.tagName) : tags).map(
                    (tag, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs border"
                        style={{
                          backgroundColor: activeTheme.backgroundColor,
                          color: activeTheme.primaryText,
                          borderColor: activeTheme.borderColor,
                        }}
                      >
                        {tag}
                        <button
                          type="button"
                          className="hover:opacity-60 cursor-pointer"
                          onClick={() =>
                            setTags(tags.filter((_, i) => index !== i))
                          }
                        >
                          <X size={12} />
                        </button>
                      </span>
                    )
                  )}
                </div>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="sourceUrl" style={{ color: activeTheme.primaryText }}>
                Source URL
              </Label>
              <input
                style={inputStyle}
                readOnly={isSubmitting || isUploading}
                className="w-full rounded-lg border px-3 py-2 text-sm outline-none transition-colors focus-visible:ring-[3px]"
                type="url"
                id="sourceUrl"
                placeholder="https://github.com/username/project"
                defaultValue={updatedProject ? updatedProject.source : ""}
                {...register("sourceUrl")}
              />
              {errors.sourceUrl && (
                <ErrorMessage message={errors.sourceUrl.message?.toString() || ""} />
              )}
            </div>

            <div className="space-y-1.5">
              <Label style={{ color: activeTheme.primaryText }}>
                Description
              </Label>
              <div
                className="rounded-lg border p-3"
                style={inputStyle}
              >
                <Tiptap content={description} setContent={setDescription} />
              </div>
            </div>
          </div>

          <SubmitButton
            className="w-full"
            loading={isSubmitting || isUploading}
            type="submit"
          >
            {isUploading ? "Uploading..." : "Create Project"}
          </SubmitButton>
        </form>
      )}

      {pending ? (
        <div className="w-full min-h-[300px] flex items-center justify-center">
          <Loader size="md" />
        </div>
      ) : (
        <div className="space-y-2">
          {projects.length > 0 ? (
            projects.map((project) => (
              <ShowListCard
                id={project.id}
                key={project.id}
                title={project.title}
                image={project.thumbnail}
                sectionName={"project"}
                setUpdate={() => {
                  setIsOpen(true);
                  setUpdatedProject(project);
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
              <FolderKanban size={32} className="opacity-30" />
              <p className="text-sm opacity-50">No projects yet</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default ProjectForm;
