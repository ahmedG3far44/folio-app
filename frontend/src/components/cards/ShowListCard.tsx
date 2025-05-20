import { useState } from "react";
import { useTheme } from "@/contexts/ThemeProvider";
import { useAuth } from "@/contexts/AuthProvider";

import { Button } from "../ui/button";
import { Link } from "react-router-dom";

import Loader from "../loader";
import toast from "react-hot-toast";

import { deleteById } from "@/lib/handlers";
import { useUser } from "@/contexts/UserProvider";

function ShowListCard({
  id,
  sectionName,
  image,
  title,
  position,
  feedback,
  vertical,
  video,
  setUpdate,
}: {
  sectionName: string;
  id: string;
  image: string;
  title: string;
  position?: string;
  feedback?: string;
  vertical?: boolean;
  video?: string;
  setUpdate?: () => void;
}) {
  const { activeTheme } = useTheme();
  const { token } = useAuth();
  const { setExperiences, setProjects, setSkills, setTestimonials } = useUser();
  const [pending, setPending] = useState<boolean>(false);
  const handleDelete = async (id: string) => {
    try {
      setPending(true);
      const deleteResult = await deleteById({
        id,
        token,
        deleteRoute: sectionName,
      });
      switch (sectionName) {
        case "experiences":
          setExperiences(deleteResult.data);
          break;
        case "project":
          setProjects(deleteResult.data);
          break;
        case "skills":
          setSkills(deleteResult.data);
          break;
        case "feedback":
          setTestimonials(deleteResult.data);
          break;
        default:
          break;
      }
      toast.success(deleteResult.message);
      return deleteResult;
    } catch (err) {
      toast.error((err as Error).message as string);
      return;
    } finally {
      setPending(false);
    }
  };
  return (
    <div
      style={{
        backgroundColor: activeTheme.cardColor,
        borderColor: activeTheme.borderColor,
      }}
      className={`w-full flex p-2 rounded-2xl border  ${
        vertical
          ? "flex-col justify-start items-start gap-1"
          : "lg:justify-between lg:items-center  lg:flex-row flex-col justify-start items-start  gap-1"
      }`}
    >
      <div className="flex justify-center items-center gap-4">
        <div
          className={` overflow-hidden flex items-center justify-center ${
            vertical ? "w-10 h-10 rounded-full" : "w-14 h-14 rounded-2xl "
          }`}
        >
          <img
            className={` w-full h-full object-cover ${
              vertical ? "rounded-full" : " rounded-2xl"
            }`}
            loading="lazy"
            src={image}
            alt={title}
          />
        </div>
        <div className="flex flex-col justify-start items-start gap-0">
          <h1 className="text-lg font-bold">
            {sectionName === "project" ? (
              <Link className="hover:underline" to={`/project/${id}`}>
                {title}
              </Link>
            ) : (
              title
            )}
          </h1>
          {position && (
            <h3
              className="text-sm"
              style={{ color: activeTheme.secondaryText }}
            >
              {position}
            </h3>
          )}
        </div>
      </div>
      {feedback && <p className="line-clamp-3 my-2">{feedback}</p>}
      {video && (
        <div className="w-full  flex justify-center items-center my-2">
          <video
            src={video}
            className="w-full h-full object-cover rounded-2xl"
          />
        </div>
      )}
      <div className="space-x-2 lg:space-x-4">
        {sectionName !== "feedback" && (
          <Button
            className="disabled:cursor-not-allowed"
            type="button"
            disabled={pending}
            onClick={setUpdate}
          >
            {sectionName === "project" ? (
              <Link to={`update/${id}`}>update</Link>
            ) : (
              "update"
            )}
          </Button>
        )}
        <Button
          className="disabled:cursor-not-allowed"
          type="button"
          disabled={pending}
          onClick={() => handleDelete(id)}
        >
          {pending ? <Loader size="sm" /> : "delete"}
        </Button>
      </div>
    </div>
  );
}

export default ShowListCard;
