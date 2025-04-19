import { useState } from "react";
import { Button } from "../ui/button";
import { projectSchema } from "@/lib/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import SubmitButton from "../submit-button";
import ErrorMessage from "../ErrorMessage";
import { Card } from "../ui/card";

function ProjectForm() {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const {
    register,
    reset,
    handleSubmit,
    getValues,
    formState: { errors, isLoading },
  } = useForm<z.infer<typeof projectSchema>>({
    resolver: zodResolver(projectSchema),
  });
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
          onSubmit={handleSubmit(() => {
            const values = getValues();
            console.log(values);
            reset();
          })}
          className="w-full p-2 flex flex-col justify-start items-center gap-2"
        >
          <Card className="w-full p-4">
            <div className="w-full bg-zinc-100 rounded-md p-8 flex items-center justify-center duration-150 hover:bg-zinc-100 cusor-pointer">
              Upload
            </div>
          </Card>
          <Card className="p-4 w-full">
            <input
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
            <input
              className="p-2 border rounded-md"
              type="text"
              id="tags"
              placeholder="tags"
              {...register("tags")}
            />
            {errors.tags && (
              <ErrorMessage
                message={errors.tags.message?.toString() as string}
              />
            )}
            <input
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
          <SubmitButton className="w-full" loading={isLoading} type="submit">
            Submit
          </SubmitButton>
        </form>
      )}
    </div>
  );
}

export default ProjectForm;
