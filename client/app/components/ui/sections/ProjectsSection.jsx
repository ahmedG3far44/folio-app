"use client";
import { useState } from "react";
import ProjectsForm from "@profileForms/ProjectsForm";
import ProjectCard from "@cards/ProjectCard";

function ProjectsSection() {
  const [project, setProject] = useState({
    title: "",
    thumbnail: "",
    Images: [],
    tags: ["nextjs", "react.js", "nodejs", "express"],
    description: "",
    sourceLink: "",
  });
  return (
    <section className="w-full flex justify-start items-center gap-8 flex-wrap-reverse max-h-1/2 max-sm:flex-col-reverse max-sm:justify-center max-sm:items-center max-md:flex-col-reverse max-md:justify-center max-md:items-center px-4">
      <ProjectsForm project={project} setProject={setProject} />
      <div className=" bg-secondary flex-1 flex-col border-2 min-w-1/2  p-8 h-full max-sm:py-8 border-dashed rounded-md flex justify-center items-center max-sm:w-full max-md:w-full ">
        <ProjectCard
          id={project?.id}
          title={project?.title}
          thumbnail={project?.thumbnail}
          description={project?.description}
          layoutStyle={"2"}
          state={"preview"}
        />
      </div>
    </section>
  );
}

export default ProjectsSection;
