import { IProjectType } from "@/lib/types";

import { useAuth } from "@/contexts/AuthProvider";

import ProjectCard from "../cards/ProjectCard";
import { ApplyLayout, ChangeLayoutForm } from "../layouts/Layouts";

function ProjectSection({ projects }: { projects: IProjectType[] }) {
  const { isLogged } = useAuth();

  return (
    <div className="relative">
      {isLogged && (
        <div className="absolute -top-8 right-0 z-10">
          <ChangeLayoutForm sectionName="projectsLayout" />
        </div>
      )}

      {projects.length > 0 ? (
        <ApplyLayout type="parent" sectionName="projectsLayout">
          {projects.map((project: IProjectType) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </ApplyLayout>
      ) : null}
    </div>
  );
}

export default ProjectSection;
