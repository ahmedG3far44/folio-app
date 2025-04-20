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

const URL_SERVER = import.meta.env.VITE_URL_SERVER as string;

function ProjectForm() {
  const { token } = useAuth();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [images, setImages] = useState<File[] | []>([]);
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
    <div className="w-full flex flex-col gap-4">
      <div className="w-full flex justify-between items-center">
        <h1>Project Form</h1>
        <Button onClick={() => setIsOpen(!isOpen)}>
          {!isOpen ? "create project" : "cancel"}
        </Button>
      </div>
      {isOpen && (
        <form
          onSubmit={handleSubmit(async () => {
            const values = getValues();
            const { title, description, sourceUrl } = values;
            console.log(values);
            console.log(thumbnail);
            console.log(images);

            const formData = new FormData();
            formData.append("thumbnail", thumbnail!);
            formData.append("title", title);
            formData.append("description", description);
            formData.append("sourceUrl", sourceUrl!);

            for (const tag of tags) {
              formData.append("tags", tag);
            }
            for (const image of images) {
              formData.append("image", image);
            }

            try {
              const response = await fetch(`${URL_SERVER}/project`, {
                method: "POST",
                headers: {
                  Authorization: `Bearer ${token}`,
                },
                body: formData,
              });
              if (!response.ok) {
                throw new Error("adding a new project failed!!");
              }
              const data = await response.json();
              console.log(data);
              setThumbnail(null);
              setImages([]);
              setTags([]);
              reset();
              // console.log("show add project success toast message");
              toast.success("a new project was created success!!");
              return data;
            } catch (err) {
              console.log((err as Error).message);
              toast.error((err as Error).message);
              return;
            }
          })}
          className="w-full p-2 flex flex-col justify-start items-center gap-2"
        >
          <Card className="w-full">
            <div className="w-full flex items-center justify-center gap-4 flex-col">
              {thumbnail ? (
                <div className="relative">
                  <img
                    className="w-40 h-40 object-cover rounded-2xl"
                    src={thumbnail ? URL.createObjectURL(thumbnail) : ""}
                    alt="compnay logo image"
                  />
                  {!isSubmitting && (
                    <Button
                      variant={"destructive"}
                      className="cursor-pointer hover:bg-red-700 duration-150 absolute -top-2  -right-2 p-2 rounded-2xl flex items-center justify-center text-white "
                      onClick={() => setThumbnail(null)}
                    >
                      <XIcon size={15} />
                    </Button>
                  )}
                </div>
              ) : (
                <label
                  className="w-1/2 p-4 bg-zinc-100 border border-dashed rounded-md hover:bg-zinc-200 cursor-pointer duration-150"
                  htmlFor="thumbnail"
                >
                  Upload image
                </label>
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
              {images.length > 0 ? (
                <div className="flex items-center justify-center gap-2">
                  {images.map((img, index) => {
                    return (
                      <div key={index} className="relative">
                        <img
                          className="w-30 h-30 object-cover rounded-2xl"
                          src={images ? URL.createObjectURL(img) : ""}
                          alt="compnay logo image"
                        />
                        {!isSubmitting && (
                          <Button
                            variant={"destructive"}
                            type="button"
                            className="cursor-pointer hover:bg-red-700 duration-150 absolute -top-2  -right-2 p-2 rounded-2xl flex items-center justify-center text-white "
                            onClick={() =>
                              setImages([
                                ...images.filter(
                                  (_, filterIndex) => index !== filterIndex
                                ),
                              ])
                            }
                          >
                            <XIcon size={20} />
                          </Button>
                        )}
                      </div>
                    );
                  })}
                </div>
              ) : (
                <label
                  className="w-1/2 p-4 bg-zinc-100 border border-dashed rounded-md hover:bg-zinc-200 cursor-pointer duration-150"
                  htmlFor="images"
                >
                  Upload image
                </label>
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
              readOnly={isSubmitting}
              className="p-2 border w-full rounded-md"
              type="text"
              id="title"
              placeholder="Project Title"
              {...register("title")}
            />
            {errors.title && (
              <ErrorMessage
                message={errors.title.message?.toString() as string}
              />
            )}
            <div className="w-full flex items-center gap-4">
              <input
                readOnly={isSubmitting}
                className="p-2 border rounded-md w-[80%]"
                type="text"
                id="tags"
                placeholder="tags"
                defaultValue={oneTag ? oneTag : ""}
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
              {tags.map((tag, index) => {
                return (
                  <div className="relative p-1 px-4 w-fit rounded-2xl border border-zinc-100 bg-secondary">
                    {!isSubmitting && (
                      <Button
                        type="button"
                        variant={"destructive"}
                        className="cursor-pointer hover:bg-red-700 duration-150 absolute -top-4  -right-4  rounded-xl flex items-center justify-center text-white shadow"
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
            </div>
            <input
              readOnly={isSubmitting}
              className="p-2 border rounded-md"
              type="text"
              id="sourceUrl"
              placeholder="sourceUrl"
              {...register("sourceUrl")}
            />
            {errors.sourceUrl && (
              <ErrorMessage
                message={errors.sourceUrl.message?.toString() as string}
              />
            )}

            <textarea
              readOnly={isSubmitting}
              className="w-full p-2 border rounded-md"
              id="description"
              placeholder="description"
              {...register("description")}
            />
            {errors.description && (
              <ErrorMessage
                message={errors.description.message?.toString() as string}
              />
            )}
          </Card>
          <SubmitButton className="w-full" loading={isSubmitting} type="submit">
            Submit
          </SubmitButton>
        </form>
      )}
    </div>
  );
}

export default ProjectForm;
