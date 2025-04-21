import { IProjectType } from "@/lib/types";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useAuth } from "@/contexts/AuthProvider";

import { Card } from "./ui/card";
import { Button } from "./ui/button";
import Loader from "./loader";

import { ExternalLink, Undo2 } from "lucide-react";
import { useTheme } from "@/contexts/ThemeProvider";

const URL_SERVER = import.meta.env.VITE_URL_SERVER as string;

function ProjectDetails() {
  const { user } = useAuth();
  const { activeTheme } = useTheme();
  const { projectId } = useParams();
  const [pending, setPending] = useState<boolean>(false);
  const [project, setProject] = useState<IProjectType | null>(null);
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
    <div
      style={{
        backgroundColor: activeTheme.backgroundColor,
        color: activeTheme.primaryText,
      }}
      className="w-full p-4 lg:full m-auto  min-h-screen relative"
    >
      <div className="lg:w-3/4 md:w-[90%] m-auto w-full">
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
            <div className="w-full flex flex-col items-center justify-center lg:w-[60%]">
              {project?.ImagesList ? (
                <div className="w-full flex flex-col items-center justify-center gap-4">
                  {project?.ImagesList.map((image) => {
                    return (
                      <Card
                        style={{
                          backgroundColor: activeTheme.cardColor,
                          border: `1px solid ${activeTheme.borderColor}`,
                        }}
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
                <Button
                  className="w-[200px]  my-4 cursor-pointer"
                  type="button"
                >
                  <Undo2 size={20} />
                </Button>
              </Link>{" "}
            </div>
            <Card
              style={{
                backgroundColor: activeTheme.cardColor,
                border: `1px solid ${activeTheme.borderColor}`,
              }}
              className="w-full lg:w-[40%] lg:sticky right-0 lg:top-20 px-4 py-8"
            >
              <h2
                style={{
                  color: activeTheme.primaryText,
                }}
                className=" text-2xl font-bold"
              >
                {project?.title}
              </h2>
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
                          style={{
                            backgroundColor: activeTheme.backgroundColor,
                            color: activeTheme.secondaryText,
                            border: `1px solid ${activeTheme.borderColor}`,
                          }}
                          className="p-1 px-4  border rounded-2xl "
                          key={tag.id}
                        >
                          {tag.tagName}
                        </span>
                      );
                    })}
                  </div>
                )}
              </div>
              <div
                style={{
                  color: activeTheme.secondaryText,
                }}
                className="text-start text-sm"
              >
                <p>{project?.description}</p>
              </div>
              {project?.source && (
                <Link
                  className="w-full cursor-pointer "
                  to={project?.source as string}
                  target="_blank"
                >
                  <Button
                    style={{
                      backgroundColor: activeTheme.backgroundColor,
                      color: activeTheme.primaryText,
                      border: `1px solid ${activeTheme.borderColor}`,
                    }}
                    className="w-full cursor-pointer hover:opacity-75 duration-150"
                    variant={"outline"}
                  >
                    <ExternalLink size={20} />
                  </Button>
                </Link>
              )}
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}

export default ProjectDetails;
