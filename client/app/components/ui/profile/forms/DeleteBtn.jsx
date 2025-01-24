"use client";
import { useState } from "react";
import { useToast } from "@shadcn/use-toast";
import { Loader2 } from "lucide-react";

function DeleteBtn({ deleteFunction, id }) {
  const [pending, setPending] = useState(false);
  const { toast } = useToast();
  const handleDelete = async () => {
    setPending(true);
    await deleteFunction(id)
      .then((response) => {
        setPending(false);
        toast({
          title: "deleted successful",
          description: response.message,
        });
      })
      .catch((error) => {
        setPending(false);
        toast({
          variant: "destructive",
          title: error.error,
          description: error.message,
        });
      });
  };
  return (
    <span
      aria-disabled={pending}
      className="disabled:bg-rose-800 disabled:cursor-pointer flex justify-center items-center text-white  w-20 h-full min-h-full hover:bg-destructive "
      onClick={handleDelete}
    >
      {pending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "delete"}
    </span>
  );
}

export default DeleteBtn;
