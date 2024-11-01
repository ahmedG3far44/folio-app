import { Fragment } from "react";
import ProjectCard from "../ProjectCard";
import ProjectCardFive from "./ProjectCardFive";
import ProjectCardFour from "./ProjectCardFour";
import ProjectCardThree from "./ProjectCardThree";
import ProjectCardTwo from "./ProjectCardTwo";

function ProjectsLayoutWrapper({ projects, projectLayoutStyle }) {
  return (
    <section
      className={
        "grid grid-cols-4 gap-4 content-center max-md:grid-cols-2 max-sm:grid-cols-1 grid-flow-row"
      }
    >
      {projects?.map((project) => {
        return (
          <Fragment key={project.id}>
            {projectLayoutStyle === "1" ? (
              <ProjectCard
                id={project.id}
                layoutStyle={projectLayoutStyle}
                title={project.title}
                thumbnail={project.thumbnail}
                description={project.description}
                views={project.views}
                likes={project.likes}
                userId={project?.usersId}
              />
            ) : projectLayoutStyle === "2" ? (
              <ProjectCardTwo
                id={project.id}
                layoutStyle={projectLayoutStyle}
                title={project.title}
                thumbnail={project.thumbnail}
                description={project.description}
                views={project.views}
                likes={project.likes}
                userId={project?.usersId}
              />
            ) : projectLayoutStyle === "3" ? (
              <ProjectCardThree
                id={project.id}
                layoutStyle={projectLayoutStyle}
                title={project.title}
                thumbnail={project.thumbnail}
                description={project.description}
                views={project.views}
                likes={project.likes}
                userId={project?.usersId}
                tags={project?.tags}
              />
            ) : projectLayoutStyle === "4" ? (
              <ProjectCardFour
                id={project.id}
                layoutStyle={projectLayoutStyle}
                title={project.title}
                thumbnail={project.thumbnail}
                description={project.description}
                views={project.views}
                likes={project.likes}
                userId={project?.usersId}
              />
            ) : projectLayoutStyle === "5" ? (
              <ProjectCardFive
                id={project.id}
                layoutStyle={projectLayoutStyle}
                title={project.title}
                thumbnail={project.thumbnail}
                description={project.description}
                views={project.views}
                likes={project.likes}
                userId={project?.usersId}
              />
            ) : null}
          </Fragment>
        );
      })}
    </section>
  );
}

export default ProjectsLayoutWrapper;
