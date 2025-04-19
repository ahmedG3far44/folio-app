import { useState } from "react";
import { Button } from "../ui/button";
import { bioSchema } from "@/lib/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import SubmitButton from "../submit-button";
import ErrorMessage from "../ErrorMessage";
import { Card } from "../ui/card";

function BioForm() {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const {
    register,
    reset,
    handleSubmit,
    getValues,
    formState: { errors, isLoading },
  } = useForm<z.infer<typeof bioSchema>>({
    resolver: zodResolver(bioSchema),
  });
  return (
    <div className="w-full flex flex-col gap-4">
      <div className="w-full flex justify-between items-center">
        <h1>Bio Form</h1>
        <Button onClick={() => setIsOpen(!isOpen)}>
          {!isOpen ? "change bio" : "cancel"}
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
          <Card className="p-4 w-full">
            <input
              className="p-2 border w-full rounded-md"
              type="text"
              id="jobTitle"
              placeholder="Job title"
              {...register("jobTitle")}
            />
            {errors.jobTitle && (
              <ErrorMessage
                message={errors.jobTitle.message?.toString() as string}
              />
            )}
            <input
              className="p-2 border rounded-md"
              type="text"
              id="name"
              placeholder="name"
              {...register("name")}
            />
            {errors.name && (
              <ErrorMessage
                message={errors.name.message?.toString() as string}
              />
            )}
            <textarea
              className="w-full p-2 border rounded-md"
              id="bio"
              placeholder="bio"
              {...register("summary")}
            />
            {errors.summary && (
              <ErrorMessage
                message={errors.summary.message?.toString() as string}
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

export default BioForm;
