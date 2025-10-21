import { IProjectType } from "@/lib/types";

import { useTheme } from "@/contexts/ThemeProvider";
import { useUser } from "@/contexts/UserProvider";

import { Link } from "react-router-dom";
import { Card } from "../ui/card";

import LayoutJson from "@/lib/layouts.json";
import Image from "../ui/image";

function ProjectCard({
  project,
}: {
  project: IProjectType;
  className?: string;
}) {
  const { id, title, description, thumbnail } = project;
  const { activeTheme } = useTheme();
  const { layouts } = useUser();
  const { projectsLayout } = LayoutJson;
  const { child } = projectsLayout;

  return (
    <Card
      style={{
        backgroundColor: activeTheme.cardColor,
        borderColor: activeTheme.borderColor,
      }}
      className={`
          p-4  
        ${
          layouts.projectsLayout === "1"
            ? child?.default
            : layouts.projectsLayout === "2"
            ? child?.medium
            : layouts.projectsLayout === "3"
            ? child.minimal
            : layouts.projectsLayout === "4"
            ? child?.wizard
            : layouts.projectsLayout === "5"
            ? child?.accent
            : "1"
        }`}
    >
      <div className="w-full h-[250px] max-h-[250px] rounded-md border">
        <Image
          property="true"
          className="w-full h-full max-w-full max-h-full object-cover rounded-md"
          src={thumbnail}
          alt={`project name: ${title}`}
        />
      </div>

      <div className="flex flex-col justify-end items-start gap-1">
        <Link
          to={`/project/${id}`}
          style={{ color: activeTheme.primaryText }}
          className="font-semibold hover:underline my-1 cursor-pointer duration-150"
        >
          {title}
        </Link>
        <p
          style={{ color: activeTheme.secondaryText }}
          className="line-clamp-3 text-sm mt-auto"
          dangerouslySetInnerHTML={{ __html: description }}
        />
      </div>
    </Card>
  );
}

export default ProjectCard;
