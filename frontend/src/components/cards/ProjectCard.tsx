import { IProjectType } from "@/lib/types";
import { Card } from "../ui/card";

function ProjectCard({ id, title, description, thumbnail }: IProjectType) {
  return (
    <Card className="p-4">
      <div className="w-full rounded-md overflow-hidden">
        <img
          loading="lazy"
          className="w-full h-full object-cover rounded-md"
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
        <h1 className="text-xl font-semibold hover:underline my-1 cursor-pointer duration-150">
          {title}
        </h1>
        <p className="line-clamp-3">{description}</p>
        {/* <span>{id}</span> */}
      </div>
    </Card>
  );
}

export default ProjectCard;
