import { IProjectType } from "@/lib/types";

import { useAuth } from "@/contexts/AuthProvider";

import { Link } from "react-router-dom";
import { Button } from "../ui/button";

import ProjectCard from "../cards/ProjectCard";
import { ApplyLayout, ChangeLayoutForm } from "../layouts/Layouts";


function ProjectSection({ projects }: { projects: IProjectType[] }) {
  const { isLogged } = useAuth();

  return (
    <>
      {isLogged && <ChangeLayoutForm sectionName="projectsLayout" />}

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
