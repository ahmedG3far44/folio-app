"use client";
import Loader from "@/app/components/loaders/Loader";
import { Button } from "../../shadcn/button";
import { useFormStatus } from "react-dom";

function SubmitBtn({ loadingText, defaultBtnText }) {
  const { pending } = useFormStatus();
  return (
    <Button
      className={"w-full"}
      type={"submit"}
      variant={pending ? "outline" : "secondary"}
      disabled={pending}
    >
      {pending ? (
        <div className="flex justify-center items-center gap-2">
          <span>
            <Loader />
          </span>
          {loadingText}
        </div>
      ) : (
        defaultBtnText
      )}
    </Button>
  );
}

export default SubmitBtn;
