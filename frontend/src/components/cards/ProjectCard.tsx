import { IProjectType } from "@/lib/types";
import { Card } from "../ui/card";
import { Link } from "react-router-dom";

function ProjectCard({ id, title, description, thumbnail }: IProjectType) {
  return (
    <Card className="p-4">
      <div className="w-full h-[250px] rounded-md overflow-hidden border border-zinc-200">
        <img
          property="true"
          loading="lazy"
          className="w-full h-full max-w-full max-h-full object-cover rounded-md"
          src={thumbnail}
          alt={`${title}-${id}`}
        />
      </div>
      {/* <div>
        {tags &&
          tags?.map((tag) => {
            return <span key={tag?.id}>{tag?.tagName}</span>;
          })}
      </div> */}
      <div>
        <Link
          to={`/project/${id}`}
          className="text-xl font-semibold hover:underline my-1 cursor-pointer duration-150"
        >
          {title}
        </Link>
        <p className="line-clamp-3">{description}</p>
        {/* <span>{id}</span> */}
      </div>
    </Card>
  );
}

export default ProjectCard;
