import { IProjectType } from "@/lib/types";

import ProjectCard from "../cards/ProjectCard";
import { useAuth } from "@/contexts/AuthProvider";
import { Link } from "react-router-dom";
import { Button } from "../ui/button";

function ProjectSection({ projects }: { projects: IProjectType[] }) {
  const { isLogged } = useAuth();
  return (
    <>
      {projects.length > 0 ? (
        <div className="w-full grid grid-cols-1 sm:md:grid-cols-2 lg:grid-cols-4 grid-flow-row gap-2 p-4">
          {projects.map((project: IProjectType) => {
            return (
              <ProjectCard
                source={project.source}
                key={project.id}
                id={project.id}
                title={project.title}
                description={project.description}
                thumbnail={project.thumbnail}
                ImagesList={project.ImagesList}
                tags={project.tags}
              />
            );
          })}
        </div>
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
