"use client";
import { useParams, useRouter } from "next/navigation";
import { LuTrash } from "react-icons/lu";
import { useToast } from "@shadcn/use-toast";

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

  const handleDeleteFeedback = async () => {
    try {
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

      router.prefetch(`http://localhost:4000/api/${userId}/feedback`);

      toast({
        title: "delete  success",
        description: "the feedback is deleted successful",
      });
      return data;
    } catch (error) {
      toast({
        variant: "destructive",
        title: "can't delete feedback",
        description: error.message,
      });
      return;
    }
  };
  return (
    <div
      className={
        "w-full flex flex-col justify-start items-start gap-4 p-4 rounded-md border bg-card"
      }
    >
      <div className={"flex justify-between items-center w-full"}>
        <div
          className={
            "w-full flex  justify-start items-start gap-2 max-md:flex-wrap "
          }
        >
          <img
            className="rounded-full min-w-10 min-h-10 overflow-hidden object-cover border p-1"
            src={profile}
            width={40}
            height={40}
            alt="client profile picture"
          />
          <div className={"flex flex-col justify-start items-start gap-0"}>
            <h2 className="font-semibold">{name}</h2>
            <h5 className="text-sm">{position}</h5>
          </div>

          {isLogged && (
            <button
              onClick={handleDeleteFeedback}
              className={"ml-auto p-2 hover:text-rose-500 duration-150"}
            >
              <LuTrash size={20} />
            </button>
          )}
        </div>
      </div>

      <div className={"w-full p-2 rounded-md overflow-hidden"}>
        {feedback ? (
          <p className="text-start text-md">{feedback}</p>
        ) : (
          <video
            controls
            width={200}
            height={200}
            className="rounded-lg m-auto "
            src={video}
          />
        )}
      </div>
    </div>
  );
}

export default TestimonialsCard;
