import Link from "next/link";

function ProjectCard({ id, title, description, thumbnail, userId, state }) {
  return (
    <div className="flex flex-col justify-start items-start gap-0 bg-card p-4 rounded-md border">
      <div className={"w-full h-[250px] overflow-hidden p-2 rounded-md "}>
        <img
          priority="true"
          width={250}
          height={250}
          src={
            !!thumbnail
              ? thumbnail
              : "https://www.its.ac.id/tmesin/wp-content/uploads/sites/22/2022/07/no-image.png"
          }
          alt="user project thumbnail image"
          className="w-full h-full max-w-full max-h-full rounded-md object-cover"
        />
      </div>
      <div className="flex-1 flex flex-col justify-start items-start gap-2 mt-4">
        <div className="mt-auto">
          {state ? (
            <h1 className="font-bold  duration-150">
              {title || "Project Title Name"}
            </h1>
          ) : (
            <Link
              href={`/${userId}/project/${id}`}
              className="font-bold hover:underline duration-150"
            >
              {title || "Project Title"}
            </Link>
          )}
          <p className={`line-clamp-3`}>
            {description || "project description"}
          </p>
        </div>
      </div>
    </div>
  );
}

export default ProjectCard;
