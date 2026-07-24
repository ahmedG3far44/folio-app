import { IProjectType } from "@/lib/types";

import { useTheme } from "@/contexts/ThemeProvider";
import { useUser } from "@/contexts/UserProvider";

import { Link } from "react-router-dom";

import LayoutJson from "@/lib/layouts.json";
import Image from "../ui/image";
import { isVideoUrl } from "@/lib/utils";

function ProjectCard({
  project,
}: {
  project: IProjectType;
  className?: string;
}) {
  const { id, title, description, thumbnail, tags } = project;
  const { activeTheme } = useTheme();
  const { layouts } = useUser();
  const { projectsLayout } = LayoutJson;
  const { child } = projectsLayout;

  const isVideo = isVideoUrl(thumbnail);

  return (
    <div
      style={{
        backgroundColor: activeTheme.cardColor,
        borderColor: activeTheme.borderColor,
      }}
      className={`flex flex-col overflow-hidden
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
            : ""
        }`}
    >
      <div className="w-full aspect-[4/3] overflow-hidden">
        {isVideo ? (
          <video
            className="w-full h-full object-cover"
            src={thumbnail}
            muted
            autoPlay
            loop
            playsInline
            onMouseEnter={(e) => e.currentTarget.play()}
            onMouseLeave={(e) => { e.currentTarget.pause(); e.currentTarget.currentTime = 0; }}
          />
        ) : (
          <Image
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
            src={thumbnail}
            alt={`project: ${title}`}
          />
        )}
      </div>

      <div className="p-4 md:p-5 flex flex-col gap-2 flex-1">
        {tags && tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {tags.slice(0, 3).map((tag) => (
              <span
                key={tag.id}
                className="text-[10px] md:text-xs px-2 py-0.5 rounded-full border"
                style={{
                  borderColor: activeTheme.borderColor,
                  color: activeTheme.secondaryText,
                }}
              >
                {tag.tagName}
              </span>
            ))}
          </div>
        )}

        <Link
          to={`/project/${id}`}
          style={{ color: activeTheme.primaryText }}
          className="font-semibold text-base md:text-lg hover:underline cursor-pointer transition-opacity"
        >
          {title}
        </Link>

        {description && (
          <p
            style={{ color: activeTheme.secondaryText }}
            className="text-sm line-clamp-3 leading-relaxed mt-auto"
            dangerouslySetInnerHTML={{ __html: description }}
          />
        )}
      </div>
    </div>
  );
}

export default ProjectCard;
