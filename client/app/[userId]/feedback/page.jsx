"use client";
import { useParams } from "next/navigation";
import { feedBackSchema } from "@lib/schema";
import { useState, useRef } from "react";
import { useToast } from "@shadcn/use-toast";
import Loader from "@loaders/Loader";
import TestimonialsCard from "@cards/TestimonialsCard";
import { LiaBirthdayCakeSolid } from "react-icons/lia";
import SubmitBtn from "@/app/components/ui/profile/forms/SubmitBtn";

function FeedBackPage() {
  const { userId } = useParams();
  const { toast } = useToast();
  const [success, setSuccess] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [pending, setPending] = useState(false);
  const [feedbackState, setFeedbackState] = useState("text");
  const feedbackFormRef = useRef(null);
  const [clientFeedbackCard, setClientFeedbackCard] = useState({
    profile: "/images/unUser.png",
    clientName: "client name....",
    position: "client position...",
    video: "",
    feedback: "lorem ipsum dolor sit amet consectetur adipisicing elit ...",
  });

  const handleFeedbacks = async (formData) => {
    try {
      const profileImage = formData.get("profile");
      const videoFeedback = formData.get("video");
      if (!videoFeedback) {
        formData.delete("video");
        const text = formData.get("feedback");
        if (text.length > 300) {
          throw new Error("feedback text is too long ");
        }
      } else {
        formData.delete("feedback");
      }
      console.log(formData);
      const feedback = {
        name: formData.get("name"),
        position: formData.get("position"),
      };
      if (profileImage.size > 10000000) {
        throw new Error(
          `this file size is too large ${profileImage.size / 1024 / 1024}MB`
        );
      }

      const validData = feedBackSchema.safeParse(feedback);
      if (!validData.success) {
        // console.log(validData.error.flatten().fieldErrors);
        throw new Error("not valid data");
      }
      const request = await fetch(
        `http://localhost:4000/api/${userId}/feedback`,
        {
          method: "POST",
          body: formData,
        }
      );
      if (!request.status === 201) {
        throw new Error("network error check your connection");
      }
      const data = await request.json();

      feedbackFormRef?.current.reset();
      setSuccess("Your feedback was added successfully");
      return data;
    } catch (error) {
      setErrorMsg(error.message);
      return error;
    }
  };
  return (
    <section
      className={
        "min-h-screen w-screen p-4 rounded-md flex flex-col justify-center items-center gap-4 "
      }
    >
      {success === null ? (
        <>
          <h1 className={"p-4 my-8 text-2xl font-bold"}>Add Your Feedback</h1>
          <div className="w-1/3 max-md:w-full max-sm:w-full">
            <TestimonialsCard
              profile={clientFeedbackCard.profile}
              feedback={clientFeedbackCard.feedback}
              position={clientFeedbackCard.position}
              name={clientFeedbackCard.clientName}
              video={clientFeedbackCard.video}
              isLogged={false}
              feedbackState={feedbackState}
            />
          </div>
          <div className="w-1/3 max-md:w-full max-sm:w-full">
            <form
              ref={feedbackFormRef}
              action={async (formData) => {
                try {
                  setPending(true);
                  await handleFeedbacks(formData);
                  toast({
                    title: "added success",
                    description: "Your feedback was added successfully",
                  });
                } catch (error) {
                  toast({
                    variant: "destructive",
                    title: "can't add feedback check your connection",
                    description: error.message,
                  });
                } finally {
                  setPending(false);
                }
              }}
              className={
                "flex-1  p-4 rounded-md border flex flex-col justify-start items-start gap-4"
              }
            >
              {errorMsg && (
                <div className="w-full p-2 rounded-md bg-red-500 text-white">
                  {errorMsg}
                </div>
              )}
              <input
                onChange={(e) => {
                  setClientFeedbackCard({
                    ...clientFeedbackCard,
                    profile: URL.createObjectURL(e.target.files[0]),
                  });
                }}
                className={"p-2 rounded-md w-full bg-secondary  border"}
                type="file"
                name={"profile"}
                placeholder={"enter your title"}
                accept={"image/*, video/mp4"}
                required
              />

              <input
                onChange={(e) => {
                  setClientFeedbackCard({
                    ...clientFeedbackCard,
                    clientName: e.target.value,
                  });
                }}
                className={"p-2 rounded-md w-full bg-secondary  border"}
                type="text"
                name={"name"}
                placeholder={"enter your name"}
                required
              />
              <input
                onChange={(e) => {
                  setClientFeedbackCard({
                    ...clientFeedbackCard,
                    position: e.target.value,
                  });
                }}
                className={"p-2 rounded-md w-full bg-secondary  border"}
                type="text"
                name={"position"}
                placeholder={"enter your position "}
                required
              />
              <div className="w-full p-2 flex justify-start items-center gap-4">
                <button
                  type="button"
                  className={`w-full border px-4 py-2 rounded-md hover:bg-secondary duration-150 ${
                    feedbackState === "video" ? "bg-secondary" : "bg-card "
                  }`}
                  onClick={() => setFeedbackState("video")}
                >
                  Video
                </button>
                <button
                  type="button"
                  className={`w-full border px-4 py-2 rounded-md hover:bg-secondary duration-150 ${
                    feedbackState === "text" ? "bg-secondary" : "bg-card "
                  }`}
                  onClick={() => setFeedbackState("text")}
                >
                  Text
                </button>
              </div>
              <div className="w-full min-h-24">
                {feedbackState === "video" ? (
                  <input
                    onChange={(e) => {
                      setClientFeedbackCard({
                        ...clientFeedbackCard,
                        video: URL.createObjectURL(e.target.files[0]),
                      });
                    }}
                    className={
                      "w-full h-full p-2 rounded-md  bg-secondary  border"
                    }
                    type="file"
                    name={"video"}
                    placeholder={"enter your title"}
                    accept={
                      "image/png , image/jpeg, image/jpg, image/gif, video/mp4"
                    }
                  />
                ) : (
                  <textarea
                    onChange={(e) => {
                      setClientFeedbackCard({
                        ...clientFeedbackCard,
                        feedback: e.target.value,
                      });
                    }}
                    className={
                      "w-full h-full min-h-[100px] p-2 rounded-md bg-secondary border"
                    }
                    name="feedback"
                    id="clientFeedback"
                    placeholder={"enter your feedback here"}
                  ></textarea>
                )}
              </div>
              <>
                {pending && (
                  <div className="flex justify-start items-center gap-4 p-2 w-full">
                    <Loader /> uploading...
                  </div>
                )}
              </>
              <SubmitBtn
                defaultBtnText={"Create Feedback"}
                loadingText={"Feedback creating..."}
              />
            </form>
          </div>
        </>
      ) : (
        <div className="flex flex-col justify-center items-center mt-20">
          <span>
            <LiaBirthdayCakeSolid size={50} color="text-green-500" />
          </span>
          <p className="p-2 rounded-md  text-green-500 text-xl">{success}</p>
        </div>
      )}
    </section>
  );
}

export default FeedBackPage;
