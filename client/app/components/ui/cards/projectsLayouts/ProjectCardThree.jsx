import Link from "next/link";

function ProjectCardThree({
  id,
  title,
  description,
  thumbnail,
  tags,
  userId,
}) {
  console.log(tags);
  return (
    <div className="w-full bg-card p-4 rounded-md border flex justify-start items-center gap-4">
      <div className="flex-1 rounded-md overflow-hidden ">
        <img src={thumbnail} alt="project user thumbnail image" />
      </div>
      <div className="flex-1">
        <Link className={"font-bold"} href={`/${userId}/project/${id}`}>
          {title}
        </Link>
        <div>
        </div>
        <p className={`line-clamp-3`}>{description}</p>
      </div>
    </div>
  );
}

export default ProjectCardThree;
