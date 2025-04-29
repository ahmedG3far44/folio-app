import { IProjectType } from "@/lib/types";
import { useAuth } from "@/contexts/AuthProvider";
import { Link } from "react-router-dom";
import { Button } from "../ui/button";

import { ChangeEvent, FormEvent, useState } from "react";

import SubmitButton from "../submit-button";
import { useTheme } from "@/contexts/ThemeProvider";
import { useUser } from "@/contexts/UserProvider";

import toast from "react-hot-toast";

import ProjectCard from "../cards/ProjectCard";
import { ApplyLayout } from "./SkillSection";

const URL_SERVER = import.meta.env.VITE_URL_SERVER as string;

function ProjectSection({ projects }: { projects: IProjectType[] }) {
  const { isLogged } = useAuth();

  return (
    <>
      {isLogged && <ChagneLayoutForm sectionName="projectsLayout" />}

      {projects.length > 0 ? (
        <ApplyLayout type="parent" sectionName={"projectsLayout"}>
          {projects.map((project: IProjectType) => {
            return <ProjectCard key={project.id} project={project} />;
          })}
        </ApplyLayout>
      ) : (
        <div className="w-full flex items-center  justify-center">
          {isLogged && (
            <Link to={"/profile/projects"}>
              <Button>add projects</Button>
            </Link>
          )}
        </div>
      )}
    </>
  );
}

export default ProjectSection;

export const ChagneLayoutForm = ({ sectionName }: { sectionName: string }) => {
  const { token } = useAuth();
  const { activeTheme } = useTheme();
  const [pending, setPending] = useState<boolean>(false);
  const { layouts, setLayouts } = useUser();
  const { heroLayout, expLayout, projectsLayout, skillsLayout } = layouts;
  const handleChangeLayout = async (e: FormEvent) => {
    e.preventDefault();
    try {
      if (!layouts) return;
      if (!token) return;
      setPending(true);
      const response = await fetch(`${URL_SERVER}/layouts/${layouts?.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(layouts),
      });
      if (!response.ok) {
        throw new Error("change layout failed");
      }
      const data = await response.json();
      toast.success("layout changed success");
      return data;
    } catch (err) {
      console.log((err as Error).message);
      toast.error((err as Error).message);
      return;
    } finally {
      console.log("finall");
      setPending(false);
    }
  };
  return (
    <form
      onSubmit={handleChangeLayout}
      className="w-[30%] ml-auto flex items-center gap-2  "
    >
      <select
        defaultValue={
          layouts && sectionName === "heroLayout"
            ? heroLayout
            : sectionName === "projectsLayout"
            ? projectsLayout
            : sectionName === "expLayout"
            ? expLayout
            : sectionName === "skillsLayout"
            ? skillsLayout
            : "1"
        }
        onChange={(e: ChangeEvent<HTMLSelectElement>) => {
          if (e.target) {
            const { name, value } = e.target;
            if (layouts) {
              setLayouts({ ...layouts, [name]: value });
            }
            console.log(layouts);
          }
        }}
        name={sectionName}
        id={sectionName}
        style={{
          backgroundColor: activeTheme.cardColor,
          borderColor: activeTheme.borderColor,
        }}
        className="appearance-none w-full py-1 px-4 rounded-md  border focus:border-blue-500 focus:ring focus:ring-blue-500/20 focus:outline-none cursor-pointer relative pr-10 shadow-sm hover:opacity-65 transition-colors duration-200"
      >
        <option value="1">Default</option>
        <option value="2">Medium</option>
        <option value="3">Minimal</option>
        <option value="4">Wizzard</option>
        <option value="5">Accent</option>
      </select>
      <SubmitButton loading={pending} type="submit">
        save
      </SubmitButton>
    </form>
  );
};
