"use client";
import { useParams } from "next/navigation";
import { feedBackSchema } from "@lib/schema";
import { useState, useRef } from "react";
import { useToast } from "@shadcn/use-toast";
import Loader from "@loaders/Loader";
import TestimonialsCard from "@cards/TestimonialsCard";
import { LiaBirthdayCakeSolid } from "react-icons/lia";

function FeedBackPage() {
  const [success, setSuccess] = useState(null);
  const { userId } = useParams();
  const [loading, setLoading] = useState(false);
  const [feedbackState, setFeedbackState] = useState("text");
  const { toast } = useToast();
  const feedbackFormRef = useRef(null);
  const [clientFeedbackCard, setClientFeedbackCard] = useState({
    profile: "https://uploads.concordia.net/2016/09/12124923/profile-icon.jpg",
    clientName: "client name....",
    position: "client position...",
    video: "",
    feedback: "add your feedback pls...",
  });

  const handleFeedbacks = async (formData) => {
    setLoading(true);
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
    try {
      if (profileImage.size > 10000000) {
        throw new Error(
          `this file size is too large ${profileImage.size / 1024 / 1024}MB`
        );
      }

      const validData = feedBackSchema.safeParse(feedback);
      if (!validData.success) {
        console.log(validData.error.flatten().fieldErrors);
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
      toast({
        title: "added success",
        description: "Your feedback was added successfully",
      });
      setSuccess("Your feedback was added successfully");
      setTimeout(() => {
        setTimeout(null);
      }, 3000);
      setLoading(false);
      return data;
    } catch (error) {
      toast({
        variant: "destructive",
        title: "can't add feedback",
        description: error.message,
      });
      setLoading(false);
      return error;
    }
  };
  return (
    <section
      className={
        "w-screen h-screen p-4 rounded-md flex flex-col justify-center items-center "
      }
    >
      {success === null ? (
        <>
          <h1 className={"p-4 my-8 text-2xl font-bold"}>Add Your Feedback</h1>
          <div className="w-1/2 grid grid-cols-2 grid-rows-1 grid-flow-row  gap-4 bg-card p-4 border rounded-md">
            <form
              ref={feedbackFormRef}
              action={async (formData) => {
                await handleFeedbacks(formData)
                  .then((data) => {
                    console.log(data);
                  })
                  .catch((error) => {
                    toast({
                      variant: "destructive",
                      title: "can't add feedback",
                      description: error.message,
                    });
                  });
              }}
              className={
                "flex-1  p-4 rounded-md border flex flex-col justify-start items-start gap-4"
              }
            >
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
                accept={
                  "image/png , image/jpeg, image/jpg, image/gif, video/mp4"
                }
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
              />
              <div className="w-full p-2 flex justify-start items-center gap-4">
                <button
                  type="button"
                  className={`min-w-24 border px-4 py-2 rounded-md hover:bg-secondary duration-150 ${
                    feedbackState === "video" ? "bg-secondary" : "bg-card "
                  }`}
                  onClick={() => setFeedbackState("video")}
                >
                  Video
                </button>
                <button
                  type="button"
                  className={`min-w-24 border px-4 py-2 rounded-md hover:bg-secondary duration-150 ${
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
                      "w-full h-full p-2 rounded-md bg-secondary border"
                    }
                    name="feedback"
                    id="clientFeedback"
                    placeholder={"enter your feedback here"}
                  ></textarea>
                )}
              </div>
              <>
                {loading && (
                  <div className="flex justify-start items-center gap-4 p-2 w-full">
                    {" "}
                    <Loader /> uploading...
                  </div>
                )}
              </>
              <input
                type="submit"
                className={
                  "w-full px-4 py-2 rounded-md border hover:bg-secondary cursor-pointer disabled:bg-secondary disabled:cursor-not-allowed"
                }
                disabled={loading}
                value={loading ? "adding..." : "Add Feedback"}
              />
            </form>
            <div className="flex-1 rounded-md min-h-full">
              <TestimonialsCard
                profile={clientFeedbackCard.profile}
                name={clientFeedbackCard.clientName}
                video={clientFeedbackCard.video}
                position={clientFeedbackCard.position}
                feedback={clientFeedbackCard.feedback}
                feedbackState={feedbackState}
                isLogged={false}
              />
            </div>
          </div>
        </>
      ) : (
        <div className="flex justify-center items-center flex-col gap-2">
          <span>
            <LiaBirthdayCakeSolid size={50} color="green" />
          </span>
          <p className="p-2 rounded-md  text-green-500 text-xl">{success}</p>
        </div>
      )}
    </section>
  );
}

export default FeedBackPage;
