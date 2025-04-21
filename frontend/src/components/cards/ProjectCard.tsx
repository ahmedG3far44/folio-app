import { IProjectType } from "@/lib/types";
import { Card } from "../ui/card";
import { Link } from "react-router-dom";
import { useTheme } from "@/contexts/ThemeProvider";

function ProjectCard({ id, title, description, thumbnail }: IProjectType) {
  const { activeTheme } = useTheme();
  return (
    <Card
      style={{
        backgroundColor: activeTheme.cardColor,
        color: activeTheme.primaryText,
        border: `1px solid ${activeTheme.borderColor}`,
      }}
      className="p-4 shadow-xl"
    >
      <div className="w-full h-[250px] rounded-md overflow-hidden">
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
      <div className="flex flex-col justify-start items-start space-y-2">
        <Link
          to={`/project/${id}`}
          className="text-xl font-semibold hover:underline my-1 cursor-pointer duration-150"
        >
          {title}
        </Link>
        <p
          style={{ color: activeTheme.secondaryText }}
          className="line-clamp-3 text-sm "
        >
          {description}
        </p>
      </div>
    </Card>
  );
}

export default ProjectCard;
