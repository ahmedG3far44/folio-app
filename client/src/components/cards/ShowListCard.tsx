import { useState } from "react";
import { useTheme } from "@/contexts/ThemeProvider";
import { useAuth } from "@/contexts/AuthProvider";

import { Button } from "../ui/button";
import { Link } from "react-router-dom";

import Loader from "../loader";
import toast from "react-hot-toast";

import { deleteById } from "@/lib/handlers";
import { useUser } from "@/contexts/UserProvider";
import Image from "../ui/image";
import { isVideoUrl } from "@/lib/utils";
import { Pencil, Trash2 } from "lucide-react";

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
      const deleteResult = await deleteById({ id, token, deleteRoute: sectionName });
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
      className={`w-full flex p-3 rounded-xl border gap-3 ${
        vertical
          ? "flex-col"
          : "lg:flex-row lg:items-center flex-col"
      }`}
    >
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <div
          className={`shrink-0 overflow-hidden flex items-center justify-center ${
            vertical ? "w-10 h-10 rounded-full" : "w-12 h-12 rounded-lg"
          }`}
        >
          {isVideoUrl(image) ? (
            <video
              className={`w-full h-full object-cover ${
                vertical ? "rounded-full" : "rounded-lg"
              }`}
              src={image}
              muted
              autoPlay
              loop
              playsInline
            />
          ) : (
            <Image
              className={`w-full h-full object-cover ${
                vertical ? "rounded-full" : "rounded-lg"
              }`}
              src={image}
              alt={title}
            />
          )}
        </div>
        <div className="min-w-0">
          <h1 className="text-base font-semibold truncate">
            {sectionName === "project" ? (
              <Link className="hover:underline" to={`/project/${id}`}>
                {title}
              </Link>
            ) : (
              title
            )}
          </h1>
          {position && (
            <p className="text-xs truncate mt-0.5" style={{ color: activeTheme.secondaryText }}>
              {position}
            </p>
          )}
        </div>
      </div>
      {feedback && <p className="text-sm line-clamp-2 leading-relaxed">{feedback}</p>}
      {video && (
        <div className="w-full rounded-lg overflow-hidden">
          <video src={video} className="w-full object-cover" muted autoPlay loop playsInline />
        </div>
      )}
      <div className="flex items-center gap-2 shrink-0 lg:self-center">
        {setUpdate && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={pending}
            onClick={setUpdate}
            className="cursor-pointer"
          >
            <Pencil size={14} />
          </Button>
        )}
        <Button
          type="button"
          variant="destructive"
          size="sm"
          disabled={pending}
          onClick={() => handleDelete(id)}
          className="cursor-pointer"
        >
          {pending ? <Loader size="sm" /> : <Trash2 size={14} />}
        </Button>
      </div>
    </div>
  );
}

export default ShowListCard;
