import Link from "next/link";

function ProjectCardThree({
  id,
  title,
  description,
  thumbnail,
  tags,
  views,
  likes,
  userId,
  state,
  layoutStyle,
}) {
  console.log(tags);
  return (
    <div className="w-full bg-card p-4 rounded-md border flex justify-start items-center gap-4">
      <div className="flex-1">
        <img src={thumbnail} alt="project user thumbnail image" />
      </div>
      <div className="flex-1">
        <Link className={"font-bold"} href={`/${userId}/project/${id}`}>
          {title}
        </Link>
        <div>
          {/* {tags.map((tag, index) => {
            return <span key={index}>{tag.tagName}</span>;
          })} */}
        </div>
        <h1></h1>
      </div>
    </div>
  );
}

export default ProjectCardThree;
