import Link from "next/link";

function ProjectCard({
  id,
  title,
  description,
  thumbnail,
  views,
  likes,
  userId,
  state,
}) {
  return (
    <div className="flex flex-col justify-start items-start gap-0 bg-card p-4 rounded-md border">
      <div
        className={"w-full h-3/4 object-cover overflow-hidden p-2 rounded-md "}
      >
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
          className="w-full h-full object-cover"
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
          <p>{description || "project description"}</p>
        </div>

        {/* {!state && (
          <div className="w-full flex justify-start items-center gap-4  pt-2">
            <span  className="flex justify-center items-center gap-2 text-muted">
              {isLike ? <AiFillLike size={20} /> : <AiOutlineLike size={20} />}
              {likes}
            </span>
            <span className="flex justify-center items-center gap-2 text-muted">
              <MdRemoveRedEye size={20} />
              {parseInt(views / 10000000000000) || 0.0}K
            </span>
          </div>
        )} */}
      </div>
    </div>
  );
}

export default ProjectCard;
