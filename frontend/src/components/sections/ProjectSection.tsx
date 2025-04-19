import { IProjectType } from "@/lib/types";

import ProjectCard from "../cards/ProjectCard";

function ProjectSection({ projects }: { projects: IProjectType[] }) {
  return (
    <div className="grid grid-cols-1 sm:md:grid-cols-2 lg:grid-cols-4 grid-flow-row gap-2">
      {projects.map((project: IProjectType) => {
        return (
          <ProjectCard
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
  );
}

export default ProjectSection;
