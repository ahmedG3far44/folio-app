import Link from "next/link";

function ProjectCardFour({ id, userId, title, description, thumbnail, tags }) {
  return (
    <div className="flex justify-center items-center gap-4 flex-col p-4 border rounded-md bg-card">
      <Link
        className="w-full line-clamp-2 text-2xl font-bold hover:text-secondary duration-150 hover:underline"
        href={`/${userId}/project/${id}`}
      >
        {title}
      </Link>
      <img
        className="m-auto rounded-md w-full object-cover h-1/2 min-h-1/2 max-h-1/2"
        src={thumbnail}
        alt="project thumbnail"
      />
      
      <p className="line-clamp-3">{description}</p>
      {tags && (
        <div>
          {tags.map((tag, index) => {
            return <span key={index}>#{tag}</span>;
          })}
        </div>
      )}
    </div>
  );
}

export default ProjectCardFour;
