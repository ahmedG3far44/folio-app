import { useTheme } from "@/contexts/ThemeProvider";
import { Card, CardContent, CardFooter } from "./ui/card";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { feedbackSchema } from "@/lib/schemas";
import { z } from "zod";
import ErrorMessage from "./ErrorMessage";
import { ChangeEvent, useState } from "react";
import { Button } from "./ui/button";
import { PartyPopper, XIcon } from "lucide-react";
import UploadHere from "./cards/UploadHere";
import SubmitButton from "./submit-button";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";

const URL_SERVER = import.meta.env.VITE_URL_SERVER as string;

function UserFeedBack() {
  const { activeTheme } = useTheme();
  const { userId } = useParams();
  const [profile, setProfile] = useState<File | null>(null);
  const [isFeedBackAdded, setSuccess] = useState<boolean>(false);
  const [feedbackType, setFeedBackType] = useState<string>("text");
  const [video, setFeedBackVideo] = useState<File | null>(null);
  const {
    register,
    reset,
    getValues,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<z.infer<typeof feedbackSchema>>({
    resolver: zodResolver(feedbackSchema),
  });
  return (
    <div
      style={{
        backgroundColor: activeTheme.backgroundColor,
        color: activeTheme.primaryText,
      }}
      className="w-full flex flex-col items-center justify-center min-h-screen lg:p-24 p-4"
    >
      {isFeedBackAdded ? (
        <Card
          className="flex flex-col items-center border shadow-md justify-center gap-2"
          style={{
            color: activeTheme.primaryText,
            backgroundColor: activeTheme.backgroundColor,
            borderColor: activeTheme.borderColor,
          }}
        >
          <div className=" p-2">
            <PartyPopper size={60} />
          </div>

          <CardContent>
            <h2 className="text-lg lg:text-2xl font-bold text-center ">
              Your feedback is Added Successfull.
            </h2>
          </CardContent>
          <CardFooter>
            <p
              style={{ color: activeTheme.secondaryText }}
              className="w-3/4 m-auto text-center text-sm"
            >
              Congrates your feedback is created success to user {userId}
            </p>
          </CardFooter>
        </Card>
      ) : (
        <Card className="w-full lg:w-1/2">
          <form
            className="flex flex-col justify-start items-center gap-4 p-4"
            onSubmit={handleSubmit(async () => {
              try {
                const values = getValues();
                const { name, position, feedback } = values;
                const formData = new FormData();
                formData.append("profile", profile!);
                formData.append("name", name);
                formData.append("position", position);
                if (video) {
                  formData.append("video", video);
                } else {
                  formData.append("feedback", feedback);
                }
                const response = await fetch(
                  `${URL_SERVER}/feedback/${userId}`,
                  {
                    method: "POST",
                    body: formData,
                  }
                );
                if (!response.ok) throw new Error("can't add feedback");

                const data = await response.json();
                console.log(data);
                setProfile(null);
                setFeedBackVideo(null);
                reset();
                setSuccess(true);
                toast.success("your feedback is added sucess!!");
                return data;
              } catch (err) {
                console.log((err as Error).message);
                toast.error((err as Error).message);
                return;
              }
            })}
          >
            <Card className="w-full p-4">
              <div className="w-full flex items-center justify-center flex-col">
                {profile ? (
                  <div
                    style={{ borderColor: activeTheme.borderColor }}
                    className="relative w-30 h-30 rounded-full border p-2 flex items-center justify-center"
                  >
                    <img
                      className="w-full h-full object-cover rounded-full"
                      src={profile ? URL.createObjectURL(profile) : ""}
                      alt="compnay logo image"
                    />
                    {!isSubmitting && (
                      <Button
                        variant={"destructive"}
                        className="cursor-pointer duration-150 absolute -top-2 -right-4 p-2 rounded-2xl flex items-center justify-center "
                        onClick={() => setProfile(null)}
                      >
                        <XIcon size={20} />
                      </Button>
                    )}
                  </div>
                ) : (
                  <UploadHere inputId="profile" />
                )}
                <input
                  readOnly={isSubmitting}
                  id="profile"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    setProfile(e.target.files ? e.target.files[0] : null)
                  }
                />
              </div>
            </Card>

            <div className="w-full ">
              <input
                style={{
                  backgroundColor: activeTheme.backgroundColor,
                  color: activeTheme.primaryText,
                  borderColor: activeTheme.borderColor,
                }}
                readOnly={isSubmitting}
                className="p-2 border w-full rounded-md"
                type="text"
                id="name"
                placeholder="client name"
                {...register("name")}
              />
              {errors.name && (
                <ErrorMessage
                  message={errors.name.message?.toString() as string}
                />
              )}
            </div>

            <div className="w-full ">
              <input
                style={{
                  backgroundColor: activeTheme.backgroundColor,
                  color: activeTheme.primaryText,
                  borderColor: activeTheme.borderColor,
                }}
                readOnly={isSubmitting}
                className="p-2 border w-full rounded-md"
                type="text"
                id="position"
                placeholder="client position"
                {...register("position")}
              />
              {errors.position && (
                <ErrorMessage
                  message={errors.position.message?.toString() as string}
                />
              )}
            </div>

            <div className="w-full space-x-2">
              <Button
                type="button"
                className={`${feedbackType === "video" && "opacity-50"}`}
                onClick={() => setFeedBackType("video")}
              >
                Video
              </Button>
              <Button
                type="button"
                className={`${feedbackType === "text" && "opacity-50"}`}
                onClick={() => setFeedBackType("text")}
              >
                Text
              </Button>
            </div>
            <div className="w-full flex flex-col items-center justify-center ">
              {feedbackType === "text" ? (
                <div className="w-full ">
                  <textarea
                    style={{
                      backgroundColor: activeTheme.backgroundColor,
                      color: activeTheme.primaryText,
                      borderColor: activeTheme.borderColor,
                    }}
                    readOnly={isSubmitting}
                    className="p-2 border w-full rounded-md h-44"
                    id="feedback"
                    placeholder="client feedback"
                    {...register("feedback")}
                  />
                  {errors.feedback && (
                    <ErrorMessage
                      message={errors.feedback.message?.toString() as string}
                    />
                  )}
                </div>
              ) : (
                <div className="w-full flex  items-center justify-center my-4 ">
                  {video ? (
                    <div className="w-1/2 rounded-2xl  relative">
                      <video
                        autoPlay
                        loop
                        muted
                        className="w-full h-full rounded-2xl"
                        src={URL.createObjectURL(video)}
                      ></video>
                      <Button
                        onClick={() => setFeedBackVideo(null)}
                        className="absolute -top-2 -right-2"
                        type="button"
                      >
                        <XIcon size={20}></XIcon>
                      </Button>
                    </div>
                  ) : (
                    <div className="w-full flex items-center justify-center">
                      <UploadHere inputId="feedbackVideo" />
                      <input
                        id="feedbackVideo"
                        type="file"
                        accept="video/*"
                        className="hidden"
                        readOnly={isSubmitting}
                        onChange={(e: ChangeEvent<HTMLInputElement>) =>
                          setFeedBackVideo(
                            e.target.files ? e.target.files[0] : null
                          )
                        }
                      />
                    </div>
                  )}
                </div>
              )}
            </div>
            <SubmitButton
              className="w-full mt-4"
              type="submit"
              loading={isSubmitting}
            >
              create feedback
            </SubmitButton>
          </form>
        </Card>
      )}
    </div>
  );
}

export default UserFeedBack;
