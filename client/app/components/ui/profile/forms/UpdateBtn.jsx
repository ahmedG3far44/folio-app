"use client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@shadcn/dialog";
import { useState } from "react";
import { useToast } from "@shadcn/use-toast";
// import {
//   experienceSchema,
//   projectSchema,
//   skillsSchema,
// } from "@lib/schema";

import {
  handleUpdateExperience,
  handleUpdateProject,
  handleUpdateSkill,
} from "@actions/update/actions";
// import { useRouter } from "next/navigation";
import { LuFileEdit } from "react-icons/lu";

function UpdateBtn({ initialUpdate, sectionName }) {
  const [updateItem, setUpdatedItem] = useState(initialUpdate);
  const [updatedImg, setExpUpdatedImg] = useState(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  // const router = useRouter();
  const handelUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      switch (sectionName) {
        case "experiences":
          const experienceUpdateResult = await handleUpdateExperience(
            updateItem
          );
          experienceUpdateResult.success
            ? toast({
                title: "success",
                description: "experience info was updated successfully",
              })
            : toast({
                variant: "destructive",
                title: "error",
                description: experienceUpdateResult.message,
              });
          break;
        case "projects":
          const projectUpdateResult = await handleUpdateProject(updateItem);
          projectUpdateResult.success
            ? toast({
                title: "success",
                description: "project info was updated successfully",
              })
            : toast({
                variant: "destructive",
                title: "error",
                description: projectUpdateResult.message,
              });
          break;
        case "skills":
          const skillUpdateResult = await handleUpdateSkill(updateItem);
          skillUpdateResult.success
            ? toast({
                title: "success",
                description: "skill info was updated successfully",
              })
            : toast({
                variant: "destructive",
                title: "error",
                description: skillUpdateResult.message,
              });
          break;
        default:
          break;
      }
      switch (sectionName) {
        case "experiences":
          const experienceUpdateResult = await handleUpdateExperience(
            updateItem
          );
          experienceUpdateResult.success
            ? toast({
                title: "success",
                description: "experience info was updated successfully",
              })
            : toast({
                variant: "destructive",
                title: "error",
                description: experienceUpdateResult.message,
              });
          break;
        case "projects":
          const projectUpdateResult = await handleUpdateProject(updateItem);
          projectUpdateResult.success
            ? toast({
                title: "success",
                description: "project info was updated successfully",
              })
            : toast({
                variant: "destructive",
                title: "error",
                description: projectUpdateResult.message,
              });
          break;
        case "skills":
          const skillUpdateResult = await handleUpdateSkill(updateItem);
          skillUpdateResult.success
            ? toast({
                title: "success",
                description: "skill info was updated successfully",
              })
            : toast({
                variant: "destructive",
                title: "error",
                description: skillUpdateResult.message,
              });
          break;
        default:
          break;
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "error",
        description: error.message,
      });
      return;
    } finally {
      setLoading(false);
      return;
    }
  };
  return (
    <>
      <Dialog>
        <DialogTrigger>
          <span className=" hover:text-zinc-800 duration-150">
            <LuFileEdit size={20} />
          </span>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>update experience form</DialogTitle>
            <DialogDescription>
              updating item with ID: {initialUpdate.id}
            </DialogDescription>
          </DialogHeader>

          {sectionName === "experiences" && (
            <form
              onSubmit={handelUpdate}
              className="w-full sm:w-full flex flex-col justify-start items-start gap-2 p-4 rounded-md border"
            >
              <input
                className="p-2 w-full rounded-md "
                type="text"
                name="cName"
                placeholder="company name"
                defaultValue={initialUpdate.cName}
                onChange={(e) =>
                  setUpdatedItem({ ...updateItem, cName: e.target.value })
                }
              />
              <img
                src={
                  updatedImg === null
                    ? updateItem.cLogo
                    : URL.createObjectURL(updatedImg)
                }
                width={40}
                height={40}
                alt="new updated Img form"
              />
              <input
                className="p-2 w-full rounded-md "
                type="file"
                accept="image/*"
                name="file"
                placeholder="company logo url"
                // defaultValue={initialUpdate.cLogo}
                onChange={(e) => {
                  setExpUpdatedImg(e.target.files[0]);
                  setUpdatedItem({ ...updateItem, file: e.target.value });
                }}
              />
              <input
                className="p-2 w-full rounded-md"
                type="text"
                name="position"
                placeholder="your position or Job-title"
                defaultValue={initialUpdate.position}
                onChange={(e) =>
                  setUpdatedItem({ ...updateItem, position: e.target.value })
                }
              />
              <textarea
                className="w-full  p-2 rounded-md"
                placeholder="my role "
                name="role"
                id="role"
                defaultValue={initialUpdate.role}
                onChange={(e) =>
                  setUpdatedItem({ ...updateItem, role: e.target.value })
                }
              ></textarea>
              <div className="w-full flex justify-start items-center gap-4 mb-1 sm:flex-wrap">
                <label className="w-full text-sm">
                  Start Date
                  <input
                    className="p-2 w-full rounded-md "
                    type="date"
                    name="start"
                    placeholder="start date"
                    defaultValue={initialUpdate.start}
                    onChange={(e) =>
                      setUpdatedItem({ ...updateItem, start: e.target.value })
                    }
                  />
                </label>
                <label className="w-full text-sm ">
                  End Date
                  <input
                    className="p-2 w-full rounded-md "
                    type="date"
                    name="end"
                    placeholder="end date"
                    defaultValue={initialUpdate.end}
                    onChange={(e) =>
                      setUpdatedItem({ ...updateItem, end: e.target.value })
                    }
                  />
                </label>
              </div>
              <input
                className="p-2 w-full rounded-md "
                type="text"
                name="location"
                placeholder="enter the job location"
                defaultValue={initialUpdate.location}
                onChange={(e) =>
                  setUpdatedItem({ ...updateItem, location: e.target.value })
                }
              />
              <input
                type="submit"
                className="w-full py-2 rounded-md border  hover:bg-zinc-900 duration-150 cursor-pointer disabled:bg-zinc-600 disabled:cursor-not-allowed"
                value={loading ? "updating..." : "update"}
                disabled={loading}
              />
            </form>
          )}
          {sectionName === "projects" && (
            <form
              onSubmit={handelUpdate}
              className="w-full sm:w-full flex flex-col justify-start items-start gap-2 p-4 rounded-md border"
            >
              <input
                className="p-2 w-full rounded-md "
                type="text"
                name="title"
                placeholder="project title"
                defaultValue={initialUpdate?.title}
                onChange={(e) =>
                  setUpdatedItem({ ...updateItem, title: e.target.value })
                }
              />
              <input
                className="p-2 w-full rounded-md "
                type="url"
                name="thumbnail"
                placeholder="thumbnail logo url"
                defaultValue={initialUpdate.thumbnail}
                onChange={(e) =>
                  setUpdatedItem({ ...updateItem, thumbnail: e.target.value })
                }
              />

              <textarea
                className="w-full  p-2 rounded-md"
                placeholder="project description"
                name="description"
                defaultValue={initialUpdate.description}
                onChange={(e) =>
                  setUpdatedItem({ ...updateItem, description: e.target.value })
                }
              ></textarea>
              <input
                type="submit"
                className="w-full py-4 rounded-md border hover:bg-zinc-900 duration-150 cursor-pointer disabled:bg-zinc-600 disabled:cursor-not-allowed"
                value={loading ? "updating..." : "update"}
                disabled={loading}
              />
            </form>
          )}
          {sectionName === "skills" && (
            <form
              onSubmit={handelUpdate}
              className="w-full sm:w-full flex flex-col justify-start items-start gap-2 p-4 rounded-md"
            >
              <input
                className="p-2 w-full rounded-md "
                type="text"
                name="skillName"
                placeholder="skill name"
                defaultValue={initialUpdate.skillName}
                // onChange={(e) =>
                //   setUpdatedItem({ ...updateItem, skillName: e.target.value })
                // }
              />
              <img
                width={40}
                height={40}
                src={
                  !updatedImg
                    ? initialUpdate.skillLogo
                    : URL.createObjectURL(updatedImg)
                }
                alt="new updated skill img"
              />
              <input
                className="p-2 w-full rounded-md "
                type="file"
                name="file"
                accept="image/*"
                // placeholder="skill logo url"
                // defaultValue={initialUpdate.skillLogo}
                onChange={(e) => {
                  setExpUpdatedImg(e.target.files[0]);
                  setUpdatedItem({ ...updateItem, skillLogo: e.target.value });
                }}
              />
              <input
                type="submit"
                className="w-full py-2 rounded-md border  hover:bg-zinc-900 duration-150 cursor-pointer disabled:bg-zinc-600 disabled:cursor-not-allowed"
                value={loading ? "updating..." : "update"}
                disabled={loading}
              />
            </form>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}

export default UpdateBtn;
