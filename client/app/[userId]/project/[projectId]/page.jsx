"use client";

import Link from "next/link";
import { LiaLongArrowAltLeftSolid } from "react-icons/lia";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Loader from "@/app/components/loaders/Loader";

function ProjectDetailsPage() {
  const { userId, projectId } = useParams();
  // const router = useRouter();
  const [project, setProject] = useState();
  const [pending, setPending] = useState(false);
  useEffect(() => {
    setPending(true);
    async function getProjectDetails(userId, projectId) {
      try {
        const request = await fetch(
          `http://localhost:4000/api/${userId}/project/${projectId}`
        );
        if (!request.status === 200) {
          throw new Error("can't get a project ifo, check your connection.");
        }
        const data = await request.json();
        return data;
      } catch (error) {
        return {
          error: "can't get project details",
          message: error.message,
        };
      }
    }

    getProjectDetails(userId, projectId)
      .then((data) => {
        console.log(data);
        setProject(data);
        setPending(false);
      })
      .catch((error) => {
        console.error(error.message);
        setPending(false);
      });
  }, []);
  return (
    <section
      className={
        "w-3/4 flex justify-center items-start max-md:flex-wrap   gap-4 m-auto my-20 max-md:my-4 relative max-md:flex-col-reverse max-md:w-full p-8"
      }
    >
      <Link
        className="absolute -left-28 top-0 hover:bg-secondary duration-150 p-2 rounded-md"
        href={`/${userId}`}
      >
        <LiaLongArrowAltLeftSolid size={30} />
      </Link>
      {pending ? (
        <Loader large={true} />
      ) : (
        <>
          <div className="w-[60%] max-md:w-full flex flex-col justify-center items-center gap-8 ">
            {project?.ImagesList.map((image) => {
              return (
                <div
                  key={image?.id}
                  className={
                    "w-full h-full  overflow-hidden border shadow-sm rounded-xl p-4 bg-card"
                  }
                >
                  <img
                    loading="lazy"
                    preload={"true"}
                    className="w-full max-w-full min-w-full object-cover h-full max-h-full min-h-full bg-secondary rounded-xl"
                    src={image?.url}
                    width={200}
                    height={200}
                  />
                </div>
              );
            })}
            <Link
              className={
                "flex justify-center items-center gap-2 px-4 py-2 rounded-xl hover:bg-secondary duration-150 border bg-card"
              }
              href={`/${userId}`}
            >
              <LiaLongArrowAltLeftSolid size={30} />
              Back Home
            </Link>
          </div>
          <div className="max-md:w-full w-[40%] min-w-[30%] flex flex-col justify-start items-start gap-4  bg-card p-4 py-8 rounded-md border max-md:static sticky top-0 right-0">
            <h1 className={"text-2xl font-bold"}>{project?.title}</h1>
            <div className="border rounded-md w-full overflow-hidden bg-secondary">
              <img
                loading="lazy"
                preload="true"
                src={project?.thumbnail}
                width={150}
                height={150}
                alt={"projects thumbnail"}
                className={"w-full h-full object-cover"}
              />
            </div>
            <div className="text-sm text-start text-muted-foreground">
              <p>{project?.description}</p>
            </div>
            <>
              {!!project?.tags.length ? (
                <div
                  className={
                    "w-full flex justify-start items-start gap-x-2 gap-y-4 flex-wrap mt-4"
                  }
                >
                  {project?.tags.map((tag) => {
                    return (
                      <div key={tag.id}>
                        {tag.tagName !== "" && (
                          <span
                            className={
                              "px-3 py-1 rounded-3xl border bg-secondary"
                            }
                            key={tag.id}
                          >
                            {tag.tagName}
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              ) : (
                <></>
              )}
            </>
          </div>
        </>
      )}
    </section>
  );
}

export default ProjectDetailsPage;
