import Link from "next/link";
import "../../../../globals.css";

function ProjectCardTwo({
  id,
  title,
  description,
  thumbnail,
  views,
  likes,
  userId,
  state,
  layoutStyle,
}) {
  return (
    <>
      <div className="border rounded-md p-4 bg-card relative">
        <img
          loading="lazy"
          src={thumbnail}
          alt="user project thumbnail image"
          className="w-full h-full object-cover rounded-md"
        />
        <div className="hover:opacity-100 opacity-0 duration-150 w-full p-4 absolute left-[50%] top-[50%] -translate-x-1/2 -translate-y-1/2 bg-card text-center h-full flex justify-center items-center flex-col ">
          <Link
            className="hover:underline duration-150 font-bold"
            href={`/${userId}/project/${id}`}
          >
            {title}
          </Link>
          <p className={"group line-clamp-4"}>{description}</p>
        </div>
        {/* <p className="transition-all hover:scale-110 cursor-pointer group-hover:flex min-w-80 absolute top-0 left-[350px] p-4 rounded-md border-1 bg-secondary border-gray-100">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Molestias,
          nesciunt illo asperiores facere ipsum fugit libero quam, nostrum
          veritatis exercitationem possimus natus assumenda dolores architecto
          harum quaerat hic ab atque.
        </p> */}
      </div>
    </>
  );
}

export default ProjectCardTwo;
