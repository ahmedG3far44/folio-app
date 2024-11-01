import Link from "next/link";
import React from "react";

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
      <div className="border rounded-md p-4 bg-card overflow-hidden relative">
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
          <p>{description}</p>
        </div>
      </div>
    </>
  );
}

export default ProjectCardTwo;
