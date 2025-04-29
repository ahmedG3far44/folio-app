import { IProjectType } from "@/lib/types";
import { Link } from "react-router-dom";
import { useTheme } from "@/contexts/ThemeProvider";
import { ApplyLayout } from "../sections/SkillSection";
import { Card } from "../ui/card";

function ProjectCard({
  project,
}: {
  project: IProjectType;
  className?: string;
}) {
  const { id, title, description, thumbnail } = project;
  const { activeTheme } = useTheme();

  return (
    <Card>
      <ApplyLayout type="child" sectionName="projectsLayout">
        <div className="w-full h-[250px] rounded-md overflow-hidden">
          <img
            property="true"
            loading="lazy"
            className="w-full h-full max-w-full max-h-full object-cover rounded-md"
            src={thumbnail}
            alt={`${title}-${id}`}
          />
        </div>

        <div className="flex flex-col justify-start items-start space-y-2">
          <Link
            to={`/project/${id}`}
            className="text-xl font-semibold hover:underline my-1 cursor-pointer duration-150"
          >
            {title}
          </Link>
          <p
            style={{ color: activeTheme.secondaryText }}
            className="line-clamp-3 text-sm"
          >
            {description}
          </p>
        </div>
      </ApplyLayout>
    </Card>
  );
}

export default ProjectCard;
