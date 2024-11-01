import { MdErrorOutline } from "react-icons/md";
import ProjectsLayoutWrapper from "../cards/projectsLayouts/ProjectsLayoutWrapper";
import { ChangeProjectsLayoutForm } from "../profile/forms/LayoutsForm";
import Link from "next/link";
import { LuPlus } from "react-icons/lu";
import ProjectCard from "../cards/ProjectCard";
import { useParams } from "next/navigation";

function ProjectsLayout({ ProjectsList, layouts, setLayouts, isLogged }) {
  // const { userId } = useParams();
  return (
    <>
      {!!ProjectsList?.length ? (
        <section id="projects" className="w-full min-h-full  m-auto ">
          {isLogged && (
            <ChangeProjectsLayoutForm
              setLayouts={setLayouts}
              layouts={layouts}
            />
          )}
          <ProjectsLayoutWrapper
            projectLayoutStyle={layouts?.projectsLayout}
            projects={ProjectsList}
          />
        </section>
      ) : (
        <>
          {isLogged && (
            <div className="w-full p-4 flex flex-col-reverse justify-center items-center rounded-md border gap-2">
              <h2 className="flex gap-2 justify-center items-center">
                <MdErrorOutline size={15} />{" "}
                <span>no projects added yet!!</span>
              </h2>
              <div className="w-40 h-40 border bg-card flex justify-center items-center rounded-md hover:bg-secondary duration-150">
                <Link href={`/${layouts?.usersId}/profile/projects`}>
                  <span>
                    <LuPlus size={50} />
                  </span>
                </Link>
              </div>
            </div>
          )}
        </>
      )}
    </>
  );
}

export default ProjectsLayout;
