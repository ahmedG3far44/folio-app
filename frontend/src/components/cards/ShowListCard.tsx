import { useState } from "react";
import { Button } from "../ui/button";
import { useTheme } from "@/contexts/ThemeProvider";
import Loader from "../loader";
import { useAuth } from "@/contexts/AuthProvider";
import { deleteById } from "@/lib/handlers";
import toast from "react-hot-toast";
// import { ISkillType } from "@/lib/types";
// import { useNavigate } from "react-router-dom";

function ShowListCard({
  id,
  sectionName,
  image,
  title,
  position,
  feedback,
  vertical,
  setUpdate,
}: {
  sectionName: string;
  id: string;
  image: string;
  title: string;
  position?: string;
  feedback?: string;
  vertical?: boolean;
  setUpdate?: () => void;
}) {
  const { activeTheme } = useTheme();
  const { token } = useAuth();
  // const navigate = useNavigate();
  const [pending, setPending] = useState<boolean>(false);
  const handleDelete = async (id: string) => {
    try {
      setPending(true);
      const deleteResult = await deleteById({
        id,
        token,
        deleteRoute: sectionName,
      });
      toast.success(deleteResult.message);
      return;
    } catch (err) {
      console.log((err as Error).message);
      return;
    } finally {
      setPending(false);
    }
  };
  // const handleUpdate = async (id: string) => {
  //   try {
  //     setPending(true);
  //     switch (sectionName) {
  //       case "experiences":
  //         console.log("update experience ", id);
  //         break;
  //       case "projects":
  //         console.log("update project ", id);
  //         break;
  //       case "skills":
  //         console.log("update skills ", id);
  //         break;
  //       case "testimonials":
  //         console.log("update testimonials ", id);
  //         break;
  //       default:
  //         break;
  //     }
  //   } catch (err) {
  //     console.log((err as Error).message);
  //   } finally {
  //     setPending(false);
  //   }
  // };
  return (
    <div
      style={{
        backgroundColor: activeTheme.cardColor,
        borderColor: activeTheme.borderColor,
      }}
      className={`w-full flex p-2 rounded-2xl border  ${
        vertical
          ? "flex-col justify-start items-start gap-2"
          : "lg:justify-between lg:items-center  lg:flex-row flex-col justify-start items-start  gap-2"
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
          <h1 className="text-lg font-bold">{title}</h1>
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
      <div className="space-x-2 lg:space-x-4">
        {sectionName !== "feedback" && (
          <Button
            className="disabled:cursor-not-allowed"
            type="button"
            disabled={pending}
            onClick={setUpdate}
          >
            update
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
