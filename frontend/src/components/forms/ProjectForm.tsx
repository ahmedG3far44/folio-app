import { z } from "zod";
import { ChangeEvent, useState } from "react";
import { projectSchema } from "@/lib/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { XIcon } from "lucide-react";
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
import { useNavigate } from "react-router-dom";

const URL_SERVER = import.meta.env.VITE_URL_SERVER as string;

function ProjectForm() {
  const navigate = useNavigate();
  const { token } = useAuth();
  const { activeTheme } = useTheme();
  const { projects, pending } = useUser();
  const [isUpdating, setIsUpdating] = useState<boolean>(false);
  const [updatedProject, setUpdatedProject] = useState<IProjectType | null>(
    null
  );

  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [thumbnail, setThumbnail] = useState<File | string | null>(null);
  const [images, setImages] = useState<File[] | IProjectImagesType[] | null>(
    null
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
  return (
    <>
      <div className="w-full flex flex-col gap-4 my-4">
        <div className="w-full flex justify-between items-center">
          <h1>Project Form</h1>
          <Button onClick={() => setIsOpen(!isOpen)}>
            {!isOpen ? "create project" : "cancel"}
          </Button>
        </div>
        {isOpen && (
          <form
            onSubmit={handleSubmit(async () => {
              const formData = new FormData();

              if (isUpdating && updatedProject) {
                const { title, description, sourceUrl } = getValues();
                formData.append("title", title);
                formData.append("description", description);
                formData.append("sourceUrl", sourceUrl as string);
              } else {
                const values = getValues();
                if (thumbnail) {
                  formData.append("thumbnail", thumbnail!);
                }

                Object.entries(values).forEach(([key, value]) => {
                  formData.append(key, value);
                });

                if (tags && tags.length > 0) {
                  for (const tag of tags) {
                    formData.append("tags", tag);
                  }
                }

                if (images) {
                  for (const image of images) {
                    formData.append("image", image as File);
                  }
                }
              }

              try {
                const response = await fetch(
                  `${URL_SERVER}/project/${
                    isUpdating ? updatedProject?.id : ""
                  }`,
                  {
                    method: isUpdating ? "PUT" : "POST",
                    headers: {
                      Authorization: `Bearer ${token}`,
                    },
                    body: formData,
                  }
                );

                if (!response.ok) {
                  throw new Error("adding a new project failed!!");
                }

                const data = await response.json();

                console.log(data);

                toast.success(data.message);

                return navigate(0);
              } catch (err) {
                console.log((err as Error).message);
                toast.error((err as Error).message);
                return;
              } finally {
                setThumbnail(null);
                setImages([]);
                setTags([]);
                reset();
                setIsOpen(false);
                setIsUpdating(false);
              }
            })}
            className="w-full p-2 flex flex-col justify-start items-center gap-2"
          >
            <Card className="w-full">
              <div className="w-full flex items-center justify-center gap-4 flex-col">
                {updatedProject?.thumbnail !== "" || thumbnail ? (
                  <div
                    style={{ borderColor: activeTheme.borderColor }}
                    className="relative w-40 h-40 rounded-2xl border p-2 flex items-center justify-center"
                  >
                    <img
                      className="w-30 h-30 object-cover rounded-2xl"
                      src={
                        thumbnail
                          ? URL.createObjectURL(thumbnail as File)
                          : updatedProject
                          ? (updatedProject.thumbnail as string)
                          : ""
                      }
                      alt="compnay logo image"
                    />
                    {!isSubmitting && (
                      <Button
                        type="button"
                        variant={"destructive"}
                        className="cursor-pointer hover:bg-red-700 duration-150 absolute -top-2 rounded-2xl flex items-center justify-center text-white"
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
                      </Button>
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
                {updatedProject ? (
                  <div className="flex flex-wrap items-start justify-center gap-4 p-4">
                    {updatedProject.ImagesList?.map((img) => {
                      return (
                        <div
                          key={img.id}
                          style={{ borderColor: activeTheme.borderColor }}
                          className="relative w-30 h-30 rounded-2xl border p-2 flex items-center justify-center"
                        >
                          <img
                            className="w-25  h-25  lg:w-full lg:h-full object-cover rounded-2xl"
                            src={img && img.url}
                            alt="compnay logo image"
                          />
                          {!isSubmitting && (
                            <Button
                              variant={"destructive"}
                              type="button"
                              className="cursor-pointer z-[50] hover:bg-red-700 duration-150 absolute -top-2 -right-4 p-2 rounded-2xl flex items-center justify-center text-white "
                              // When filtering images during update
                              onClick={() => {
                                if (updatedProject) {
                                  setUpdatedProject({
                                    ...updatedProject,
                                    ImagesList:
                                      updatedProject.ImagesList.filter(
                                        (filteredImg) =>
                                          filteredImg.id !== img.id
                                      ),
                                  });
                                }
                              }}
                            >
                              <XIcon size={20} />
                            </Button>
                          )}
                        </div>
                      );
                    })}
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
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    setImages(Array.from(e.target.files || []))
                  }
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
                  placeholder="tags"
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
                className="p-2 border rounded-md"
                type="text"
                id="sourceUrl"
                placeholder="sourceUrl"
                defaultValue={updatedProject ? updatedProject.source : ""}
                {...register("sourceUrl")}
              />
              {errors.sourceUrl && (
                <ErrorMessage
                  message={errors.sourceUrl.message?.toString() as string}
                />
              )}

              <textarea
                style={{
                  backgroundColor: activeTheme.backgroundColor,
                  color: activeTheme.primaryText,
                  borderColor: activeTheme.borderColor,
                }}
                readOnly={isSubmitting}
                className="w-full p-2 border rounded-md"
                id="description"
                placeholder="description"
                defaultValue={updatedProject ? updatedProject.description : ""}
                {...register("description")}
              />
              {errors.description && (
                <ErrorMessage
                  message={errors.description.message?.toString() as string}
                />
              )}
            </Card>
            <SubmitButton
              className="w-full"
              loading={isSubmitting}
              type="submit"
            >
              Submit
            </SubmitButton>
          </form>
        )}
      </div>
      <Card
        className="p-4 border"
        style={{
          color: activeTheme.primaryText,
          backgroundColor: activeTheme.backgroundColor,
          borderColor: activeTheme.borderColor,
        }}
      >
        {pending ? (
          <div className="w-full min-h-[400px] flex items-center justify-center">
            <Loader size="md" />
          </div>
        ) : (
          <>
            {projects.length > 0 && (
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
                        console.log(project);
                      }}
                    />
                  );
                })}
              </div>
            )}
          </>
        )}
      </Card>
    </>
  );
}

export default ProjectForm;
