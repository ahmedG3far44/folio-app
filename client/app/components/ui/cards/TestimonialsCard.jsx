"use client";
import { useParams, useRouter } from "next/navigation";
import { LuTrash } from "react-icons/lu";
import { useToast } from "@shadcn/use-toast";
import { useState } from "react";
import Loader from "@components/loaders/Loader";
import Image from "next/image";

function TestimonialsCard({
  id,
  profile,
  feedback,
  position,
  name,
  video,
  isLogged,
  feedbackState,
}) {
  const { userId } = useParams();
  const { toast } = useToast();
  const router = useRouter();
  const [pending, setPending] = useState(false);

  const handleDeleteFeedback = async (id) => {
    try {
      setPending(true);
      const request = await fetch(
        `http://localhost:4000/api/${userId}/feedback/${id}`,
        {
          method: "DELETE",
        }
      );
      if (!request.ok) {
        throw new Error("network error check your connection");
      }
      const data = await request.json();

      // router.refresh("/testimonials");

      toast({
        title: "delete  success",
        description: "the feedback is deleted successful",
      });
      router.prefetch("/testimonials");
      return data;
    } catch (error) {
      toast({
        variant: "destructive",
        title: "can't delete feedback",
        description: error.message,
      });
    } finally {
      setPending(false);
    }
  };
  return (
    <div
      className={
        "w-full max-w-1/3  flex flex-col justify-start items-start gap-2 p-4 rounded-md border bg-card"
      }
    >
      <div className={"flex justify-between items-center w-full"}>
        <div
          className={
            "w-full flex  justify-start items-center gap-4 max-md:flex-wrap "
          }
        >
          <div className="w-10 h-10 min-h-10 min-w-10   max-h-10 max-w-10 rounded-full flex justify-center items-center overflow-hidden object-cover">
            <Image src={profile} width={40} height={40} alt="" />
          </div>
          <div className={"flex flex-col justify-start items-start gap-0"}>
            <h2 className="font-semibold text-lg">{name}</h2>
            <h5 className="text-sm text-muted">{position}</h5>
          </div>

          {isLogged &&
            (pending ? (
              <span className="ml-auto ">
                <Loader />
              </span>
            ) : (
              <button
                onClick={() => handleDeleteFeedback(id)}
                className="text-rose-500 hover:text-rose-700 ml-auto"
              >
                {" "}
                <LuTrash size={20} />
              </button>
            ))}
        </div>
      </div>

      <div className={"w-full p-2 rounded-md overflow-hidden"}>
        {feedback ? (
          <p className="text-start text-md line-clamp-5">{feedback}</p>
        ) : (
          <video
            className="w-full rounded-lg m-auto "
            src={video}
            autoPlay={true}
            controls
            controlsList="download"
            contentEditable={false}
          />
        )}
      </div>
    </div>
  );
}

export default TestimonialsCard;
