import { IProjectType } from "@/lib/types";

import { useEffect, useState } from "react";
import { useTheme } from "@/contexts/ThemeProvider";
import { Link, useNavigate, useParams } from "react-router-dom";

import { Card } from "./ui/card";
import { Button } from "./ui/button";
import Loader from "./loader";
import { ExternalLink, Undo2 } from "lucide-react";
import Image from "./ui/image";

const URL_SERVER = import.meta.env.VITE_URL_SERVER as string;

function ProjectDetails() {
  const navigate = useNavigate();
  const { activeTheme } = useTheme();
  const { projectId } = useParams();

  const [pending, setPending] = useState<boolean>(false);
  const [project, setProject] = useState<IProjectType | null>(null);
  useEffect(() => {
    async function getProjectById(id: string) {
      try {
        setPending(true);
        const response = await fetch(`${URL_SERVER}/project/${id}`);
        if (!response.ok) {
          throw new Error("can't get project by id!!");
        }
        const project = await response.json();
        setProject({ ...project });
        return project;
      } catch (err) {
        return err;
      } finally {
        setPending(false);
      }
    }

    getProjectById(projectId as string);
  }, [projectId]);

  const handelNavigateBack = () => {
    return navigate(-1);
  };
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
          <div className="w-full min-h-[700px] flex-col flex items-center justify-center mt-8">
            <Loader size="md" />
          </div>
        ) : (
          <div className="w-full flex flex-col-reverse justify-start items-start gap-4 lg:flex-row lg:justify-start">
            <Button
              className="w-[100px] fixed z-[9999] lg:sticky -left-30 top-20 cursor-pointer"
              type="button"
              onClick={handelNavigateBack}
            >
              <Undo2 size={20} />
            </Button>

            <div className="w-full flex flex-col items-center justify-center lg:w-[65%] relative">
              {project?.ImagesList ? (
                <div className="w-full flex flex-col items-center justify-center gap-4">
                  {project?.ImagesList.map((image) => {
                    return (
                      <Card
                        style={{
                          backgroundColor: activeTheme.cardColor,
                          border: `1px solid ${activeTheme.borderColor}`,
                        }}
                        className="p-4 rounded-2xl overflow-hidden w-full"
                        key={image.id}
                      >
                        <Image
                          property="true"
                          width={280}
                          height={350}
                          className="w-full h-full object-cover rounded-lg"
                          src={image?.url}
                          alt={project?.title}
                        />
                      </Card>
                    );
                  })}
                </div>
              ) : (
                <>not project images!!</>
              )}

              <Button
                className="w-[200px]  my-4 cursor-pointer"
                type="button"
                onClick={handelNavigateBack}
              >
                <Undo2 size={20} />
              </Button>
            </div>
            <Card
              style={{
                backgroundColor: activeTheme.cardColor,
                border: `1px solid ${activeTheme.borderColor}`,
              }}
              className="w-full lg:w-[35%] lg:sticky right-0 lg:top-20 px-4 py-8 gap-4"
            >
              <h2
                style={{
                  color: activeTheme.primaryText,
                }}
                className="w-3/4 text-start text-2xl font-bold "
              >
                {project?.title}
              </h2>
              <div
                style={{ borderColor: activeTheme.borderColor }}
                className="w-full h-auto flex items-center justify-center border rounded-2xl"
              >
                <picture className="w-full h-full object-cover rounded-2xl">
                  <source
                    srcSet={project?.thumbnail.replace(".jpg", ".avif")}
                    type="image/avif"
                  />
                  <source
                    srcSet={project?.thumbnail.replace(".jpg", ".webp")}
                    type="image/webp"
                  />
                  <Image
                    property="true"
                    className="w-full h-full object-cover rounded-lg"
                    src={project?.thumbnail as string}
                    alt={project?.title as string}
                  />
                </picture>
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
                style={{ color: activeTheme.secondaryText }}
                className="w-full  flex items-center justify-center"
              >
                <p
                  className="editor-content"
                  dangerouslySetInnerHTML={{
                    __html: project?.description as string,
                  }}
                />
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
