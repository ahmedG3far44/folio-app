import { z } from "zod";
import { ChangeEvent, useState } from "react";
import { projectSchema } from "@/lib/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { CirclePlus, XIcon } from "lucide-react";
import { Button } from "../ui/button";
import { Card } from "../ui/card";

import SubmitButton from "../submit-button";
import ErrorMessage from "../ErrorMessage";
import { useAuth } from "@/contexts/AuthProvider";
import toast from "react-hot-toast";
import { useTheme } from "@/contexts/ThemeProvider";
import UploadHere from "../cards/UploadHere";
import { useUser } from "@/contexts/UserProvider";
import ShowListCard from "../cards/ShowListCard";
import Loader from "../loader";
import { IProjectImagesType, IProjectType } from "@/lib/types";
import checkUploadedImages from "@/lib/checkUploadedImages";
import Tiptap from "../Tiptap";

const URL_SERVER = import.meta.env.VITE_URL_SERVER as string;

export type ProjectFormData = {
  title: string;
  sourceUrl: string;
  description: string;
  tags: string[];
  thumbnail: File;
  images: File[];
};
function ProjectForm() {
  const { token } = useAuth();
  const { activeTheme } = useTheme();
  const { projects, setProjects, pending } = useUser();
  const [isUpdating, setIsUpdating] = useState<boolean>(false);
  const [updatedProject, setUpdatedProject] = useState<IProjectType | null>(
    null
  );

  const [description, setDescription] = useState<string>("");

  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [thumbnail, setThumbnail] = useState<File | string | null>(
    updatedProject ? updatedProject.thumbnail : null
  );
  const [error, setError] = useState<string | null>(null);
  const [images, setImages] = useState<File[] | IProjectImagesType[] | null>(
    updatedProject ? updatedProject.ImagesList : null
  );
  const [tags, setTags] = useState<string[] | []>([]);
  const [oneTag, setOneTag] = useState<string | null>(null);

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
    formData.append("sourceUrl", sourceUrl);
    formData.append("description", description);
    formData.append("thumbnail", thumbnail);
    tags.map((tag) => {
      formData.append("tags", tag as string);
    });
    images.map((img) => {
      formData.append("image", img as File);
    });


    try {
      const response = await fetch(`${URL_SERVER}/project`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to add new project");
      }
      const data = await response.json();
      setProjects(data.data);
      return data.data;
    } catch (error) {
      setError((error as Error).message as string);
      return error;
    }
  };
  return (
    <>
      <div className="w-full flex flex-col gap-4 my-4">
        <div className="w-full flex justify-between items-center">
          <h1>Project Form</h1>
          <Button onClick={() => setIsOpen(!isOpen)}>
            {!isOpen ? (
              <>
                <CirclePlus size={20} /> {"add project"}
              </>
            ) : (
              "cancel"
            )}
          </Button>
        </div>
        {isOpen && !isUpdating && (
          <form
            onSubmit={handleSubmit(async () => {
              const { title, sourceUrl } = getValues();
              const projectData = {
                title,
                sourceUrl,
                description: description.trim(),
                tags,
                thumbnail,
                images,
              };

              if (!thumbnail) {
                throw new Error("You must upload a thumbnail");
              }

              if (!checkUploadedImages(images as File[])) {
                throw new Error("You uploaded more than 5 images");
              }
              try {
                const newProject = await addNewProject(
                  projectData as ProjectFormData
                );
                if (!newProject) {
                  throw new Error("Failed to add new project");
                }
                setProjects(newProject);
                reset();
                setIsOpen(false);
                setTags([]);
                setImages([]);
                setDescription("");
                setThumbnail(null);
                setError(null);
                toast.success("Project added successfully");
                return;
              } catch (error) {
                toast.error((error as Error).message as string);
                setError((error as Error).message as string);
                return;
              }
            })}
            className="w-full p-2 flex flex-col justify-start items-center gap-2"
          >
            <Card className="w-full">
              {error && <ErrorMessage message={error} />}
              <div className="w-full flex items-center justify-center gap-4 flex-col">
                {thumbnail ? (
                  <div
                    style={{ borderColor: activeTheme.borderColor }}
                    className="relative w-40 h-40 rounded-2xl border p-2 flex items-center justify-center"
                  >
                    <img
                      className="w-30 h-30 object-cover rounded-2xl"
                      src={
                        typeof thumbnail === "string"
                          ? thumbnail
                          : typeof thumbnail === "object"
                          ? URL.createObjectURL(thumbnail!)
                          : ""
                      }
                      alt="company logo image"
                    />
                    {!isSubmitting && (
                      <button
                        type="button"
                        className="cursor-pointer bg-red-600 p-2 hover:bg-red-700 duration-150 absolute -top-3 -right-3 rounded-full flex items-center justify-center text-white"
                        onClick={() => {
                          if (updatedProject)
                            setUpdatedProject({
                              ...updatedProject,
                              thumbnail: "",
                            });
                          setThumbnail(null);
                        }}
                      >
                        <XIcon size={20} />
                      </button>
                    )}
                  </div>
                ) : (
                  <UploadHere inputId="thumbnail" />
                )}
                <input
                  readOnly={isSubmitting}
                  id="thumbnail"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    setThumbnail(e.target.files ? e.target.files[0] : null)
                  }
                />
              </div>
            </Card>
            <Card className="w-full">
              <div className="w-full flex items-center justify-center gap-4 flex-col">
                {images !== null ? (
                  <div className="flex flex-wrap items-start justify-center gap-4 p-4">
                    <>
                      {images?.map((img: IProjectImagesType | File, index) => {
                        return (
                          <div
                            key={index}
                            style={{ borderColor: activeTheme.borderColor }}
                            className="relative w-30 h-30 rounded-2xl border p-2 flex items-center justify-center"
                          >
                            <img
                              className="w-25  h-25  lg:w-full lg:h-full object-cover rounded-2xl"
                              src={
                                img instanceof File
                                  ? URL.createObjectURL(img as File)
                                  : ((img as IProjectImagesType).url as string)
                              }
                              alt="company logo image"
                            />
                            {!isSubmitting && (
                              <button
                                type="button"
                                className="cursor-pointer bg-red-600 p-2 hover:bg-red-700 duration-150 absolute -top-3 -right-3 rounded-full flex items-center justify-center text-white"
                                onClick={() => {
                                  if (updatedProject) {
                                    setUpdatedProject({
                                      ...updatedProject,
                                      ImagesList:
                                        updatedProject.ImagesList.filter(
                                          (filteredImg) =>
                                            filteredImg.id !==
                                            (img as IProjectImagesType).id
                                        ),
                                    });
                                  } else {
                                    const filteredImages = images.filter(
                                      (filteredImg, innerIndex) => {
                                        if (img instanceof File) {
                                          return index !== innerIndex;
                                        }
                                        return (
                                          (img as IProjectImagesType).id !==
                                          (filteredImg as IProjectImagesType).id
                                        );
                                      }
                                    );
                                    setImages(
                                      filteredImages.length > 0
                                        ? (filteredImages as
                                            | File[]
                                            | IProjectImagesType[])
                                        : null
                                    );
                                  }
                                }}
                              >
                                <XIcon size={20} />
                              </button>
                            )}
                          </div>
                        );
                      })}
                    </>
                  </div>
                ) : (
                  <UploadHere inputId="images" />
                )}
                <input
                  readOnly={isSubmitting}
                  id="images"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  multiple
                  onChange={(e: ChangeEvent<HTMLInputElement>) => {
                    if (e.target.files) {
                      setImages([...e.target.files]);
                    }
                  }}
                />
              </div>
            </Card>
            <Card className="p-4 w-full">
              <input
                style={{
                  backgroundColor: activeTheme.backgroundColor,
                  color: activeTheme.primaryText,
                  borderColor: activeTheme.borderColor,
                }}
                readOnly={isSubmitting}
                className="p-2 border w-full rounded-md"
                type="text"
                id="title"
                placeholder="Project Title"
                defaultValue={updatedProject ? updatedProject.title : ""}
                {...register("title")}
              />
              {errors.title && (
                <ErrorMessage
                  message={errors.title.message?.toString() as string}
                />
              )}
              <div className="w-full flex items-center gap-2">
                <input
                  style={{
                    backgroundColor: activeTheme.backgroundColor,
                    color: activeTheme.primaryText,
                    borderColor: activeTheme.borderColor,
                  }}
                  readOnly={isSubmitting}
                  className="p-2 border rounded-md w-[80%]"
                  type="text"
                  id="tags"
                  placeholder="Project Tags"
                  value={oneTag ? oneTag : ""}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => {
                    setOneTag(e.target.value);
                  }}
                />
                <Button
                  disabled={isSubmitting}
                  onClick={handleAddingTags}
                  className="w-[20%] cursor-pointer disabled:bg-zinc-400 disabled:cursor-not-allowed"
                  type="button"
                >
                  Add Tag
                </Button>
              </div>
              <div className="flex items-center justify-start gap-4">
                {updatedProject ? (
                  <>
                    {updatedProject.tags?.map((tag, index) => {
                      return (
                        <div
                          style={{
                            backgroundColor: activeTheme.backgroundColor,
                            color: activeTheme.primaryText,
                            borderColor: activeTheme.borderColor,
                          }}
                          key={tag.id}
                          className="relative p-1 px-4 w-fit rounded-2xl border "
                        >
                          {!isSubmitting && (
                            <Button
                              type="button"
                              variant={"destructive"}
                              className="cursor-pointer duration-150 absolute -top-4  -right-4  rounded-xl flex items-center justify-center"
                              onClick={() =>
                                setTags([
                                  ...tags.filter(
                                    (_, filterIndex) => index !== filterIndex
                                  ),
                                ])
                              }
                            >
                              <XIcon size={12} />
                            </Button>
                          )}
                          <span>{tag.tagName}</span>
                        </div>
                      );
                    })}
                  </>
                ) : (
                  <>
                    {tags.map((tag, index) => {
                      return (
                        <div
                          style={{
                            backgroundColor: activeTheme.backgroundColor,
                            color: activeTheme.primaryText,
                            borderColor: activeTheme.borderColor,
                          }}
                          key={index}
                          className="relative p-1 px-4 w-fit rounded-2xl border my-4"
                        >
                          {!isSubmitting && (
                            <button
                              type="button"
                              className="cursor-pointer bg-red-600 p-2 hover:bg-red-700 duration-150 absolute -top-3 -right-3 rounded-full flex items-center justify-center text-white"
                              onClick={() =>
                                setTags([
                                  ...tags.filter(
                                    (_, filterIndex) => index !== filterIndex
                                  ),
                                ])
                              }
                            >
                              <XIcon size={12} />
                            </button>
                          )}
                          <span>{tag}</span>
                        </div>
                      );
                    })}
                  </>
                )}
              </div>
              <input
                style={{
                  backgroundColor: activeTheme.backgroundColor,
                  color: activeTheme.primaryText,
                  borderColor: activeTheme.borderColor,
                }}
                readOnly={isSubmitting}
                className="w-full p-2 border rounded-md"
                type="text"
                id="sourceUrl"
                placeholder="Project external source link"
                defaultValue={updatedProject ? updatedProject.source : ""}
                {...register("sourceUrl")}
              />
              {errors.sourceUrl && (
                <ErrorMessage
                  message={errors.sourceUrl.message?.toString() as string}
                />
              )}
            </Card>
            <Card className="p-4 w-full">
              <Tiptap content={description} setContent={setDescription} />
            </Card>
            <SubmitButton
              className="w-full"
              loading={isSubmitting}
              type="submit"
            >
              create project
            </SubmitButton>
          </form>
        )}
      </div>

      <>
        {pending ? (
          <div className="w-full min-h-[400px] flex items-center justify-center">
            <Loader size="md" />
          </div>
        ) : (
          <>
            {projects?.length > 0 ? (
              <Card
                className="p-4 border"
                style={{
                  color: activeTheme.primaryText,
                  backgroundColor: activeTheme.backgroundColor,
                  borderColor: activeTheme.borderColor,
                }}
              >
                <div className="flex flex-col justify-start items-start gap-1">
                  {projects.map((project) => {
                    return (
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
                    );
                  })}
                </div>
              </Card>
            ) : (
              <div className="w-full min-h-[400px] flex items-center justify-center">
                <p>No projects found</p>
              </div>
            )}
          </>
        )}
      </>
    </>
  );
}

export default ProjectForm;
