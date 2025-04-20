import { IProjectType } from "@/lib/types";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useAuth } from "@/contexts/AuthProvider";

import { Card } from "./ui/card";
import { Button } from "./ui/button";
import Loader from "./loader";

import { ExternalLink, Undo2 } from "lucide-react";

const URL_SERVER = import.meta.env.VITE_URL_SERVER as string;

function ProjectDetails() {
  const [pending, setPending] = useState<boolean>(false);
  const [project, setProject] = useState<IProjectType | null>(null);
  const { user } = useAuth();
  const { projectId } = useParams();
  useEffect(() => {
    async function getProjectById(id: string) {
      try {
        setPending(true);
        const response = await fetch(`${URL_SERVER}/${user.id}/project/${id}`);
        if (!response.ok) {
          throw new Error("can't get project by id!!");
        }
        const project = await response.json();
        // set new project data;

        console.log(project);
        setProject({ ...project });
        return project;
      } catch (err) {
        console.log(err);
      } finally {
        setPending(false);
      }
    }

    getProjectById(projectId as string);
  }, [projectId, user.id]);
  return (
    <div className="w-full p-4 lg:w-3/4 m-auto  min-h-screen relative">
      {pending ? (
        <div className="w-full min-h-full flex-col flex items-center justify-center mt-8">
          <Loader size="md" />
        </div>
      ) : (
        <div className="w-full flex flex-col-reverse justify-start items-start gap-4 lg:flex-row lg:justify-start">
          <Link to={`/${user.id}`}>
            <Button
              className="w-[100px] fixed z-[9999] lg:sticky -left-30 top-20 cursor-pointer"
              type="button"
            >
              <Undo2 size={20} />
            </Button>
          </Link>{" "}
          <div className="w-full flex flex-col items-center justify-start lg:w-[60%]">
            {project?.ImagesList ? (
              <div className="w-full flex flex-col items-center justify-start gap-4">
                {project?.ImagesList.map((image) => {
                  return (
                    <Card
                      className="p-2 rounded-2xl overflow-hidden w-full"
                      key={image.id}
                    >
                      <img
                        className="w-full h-full object-cover rounded-2xl"
                        loading="lazy"
                        src={image.url}
                        alt={project.title}
                      />
                    </Card>
                  );
                })}
              </div>
            ) : (
              <>not project images!!</>
            )}
            <Link to={`/${user.id}`}>
              <Button className="w-[200px]  my-4 cursor-pointer" type="button">
                <Undo2 size={20} />
              </Button>
            </Link>{" "}
          </div>
          <Card className="w-full lg:w-[40%] lg:sticky right-0 top-0 px-4 py-8">
            <h2 className=" text-2xl font-semibold">{project?.title}</h2>
            <div className="w-full h-auto flex items-center justify-center">
              <img
                className="w-full h-full object-cover rounded-2xl"
                loading="lazy"
                src={project?.thumbnail}
                alt={project?.title}
              />
            </div>
            <div>
              {project?.tags && (
                <div className="flex items-center justify-start flex-wrap gap-2">
                  {project.tags.map((tag) => {
                    return (
                      <span
                        className="p-1 px-4 bg-zinc-50 border border-zinc-300 rounded-2xl "
                        key={tag.id}
                      >
                        {tag.tagName}
                      </span>
                    );
                  })}
                </div>
              )}
            </div>
            <div className="text-start text-sm text-zinc-700">
              <p>{project?.description}</p>
            </div>
            <Link
              className="w-full cursor-pointer "
              to={project?.source as string}
              target="_blank"
            >
              <Button className="w-full cursor-pointer" variant={"outline"}>
                <ExternalLink size={20} />
              </Button>
            </Link>
          </Card>
        </div>
      )}
    </div>
  );
}

export default ProjectDetails;
