import { IProjectType } from "@/lib/types";
import { useEffect, useCallback, useState } from "react";

import { useTheme } from "@/contexts/ThemeProvider";
import { useNavigate, useParams } from "react-router-dom";

import { Button } from "./ui/button";
import { ArrowLeft, ExternalLink, X, ChevronLeft, ChevronRight } from "lucide-react";

import Loader from "./loader";
import Image from "./ui/image";
import { isVideoUrl } from "@/lib/utils";

const URL_SERVER = import.meta.env.VITE_API_URL as string;

function ProjectDetails() {
  const navigate = useNavigate();
  const { activeTheme } = useTheme();
  const { projectId } = useParams();

  const [pending, setPending] = useState<boolean>(false);
  const [project, setProject] = useState<IProjectType | null>(null);
  const [fullscreenSrc, setFullscreenSrc] = useState<string | null>(null);
  const [fullscreenType, setFullscreenType] = useState<"image" | "video">("image");
  const [fullscreenIndex, setFullscreenIndex] = useState<number>(-1);

  const closeFullscreen = useCallback(() => {
    setFullscreenSrc(null);
    setFullscreenIndex(-1);
  }, []);

  const goToMedia = useCallback((index: number) => {
    if (!project?.ImagesList) return;
    const media = project.ImagesList[index];
    if (!media) return;
    setFullscreenSrc(media.url);
    setFullscreenType("image");
    setFullscreenIndex(index);
  }, [project]);

  const goNext = useCallback(() => {
    if (!project?.ImagesList || fullscreenIndex < 0) return;
    const next = (fullscreenIndex + 1) % project.ImagesList.length;
    goToMedia(next);
  }, [project, fullscreenIndex, goToMedia]);

  const goPrev = useCallback(() => {
    if (!project?.ImagesList || fullscreenIndex < 0) return;
    const prev = (fullscreenIndex - 1 + project.ImagesList.length) % project.ImagesList.length;
    goToMedia(prev);
  }, [project, fullscreenIndex, goToMedia]);

  useEffect(() => {
    if (!fullscreenSrc) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeFullscreen();
      if (e.key === "ArrowRight") goNext();
      if (e.key === "ArrowLeft") goPrev();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [fullscreenSrc, closeFullscreen, goNext, goPrev]);
  useEffect(() => {
    async function getProjectById(id: string) {
      try {
        setPending(true);
        const response = await fetch(`${URL_SERVER}/project/${id}`);
        if (!response.ok) {
          throw new Error("can't get project by id!!");
        }
        const project = await response.json();
        setProject({ ...project });
        return project;
      } catch (err) {
        return err;
      } finally {
        setPending(false);
      }
    }

    getProjectById(projectId as string);
  }, [projectId]);

  return (
    <div
      style={{
        backgroundColor: activeTheme.backgroundColor,
      }}
      className="min-h-screen"
    >
      {pending ? (
        <div className="w-full min-h-[700px] flex items-center justify-center">
          <Loader size="md" />
        </div>
      ) : (
        <div className="mx-auto max-w-6xl">
          <div className="sticky top-0 z-40 flex items-center px-4 lg:px-8 h-16">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate(-1)}
              style={{
                color: activeTheme.primaryText,
                borderColor: activeTheme.borderColor,
                backgroundColor: activeTheme.cardColor,
              }}
              className="cursor-pointer rounded-full px-3 gap-1.5 shadow-sm"
            >
              <ArrowLeft size={16} />
              <span className="hidden sm:inline">Back</span>
            </Button>
          </div>

          <div className="px-4 lg:px-8 pb-16 -mt-4">
            <div className="mx-auto max-w-3xl space-y-10">
              <div className="space-y-4">
                <h1
                  style={{ color: activeTheme.primaryText }}
                  className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight"
                >
                  {project?.title}
                </h1>

                {project?.tags && project.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {project.tags.map((tag) => (
                      <span
                        key={tag.id}
                        style={{
                          color: activeTheme.secondaryText,
                          borderColor: activeTheme.borderColor,
                          backgroundColor: activeTheme.cardColor,
                        }}
                        className="px-3 py-1 text-sm rounded-full border"
                      >
                        {tag.tagName}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div
                className="w-full overflow-hidden rounded-2xl cursor-pointer group"
                style={{
                  border: `1px solid ${activeTheme.borderColor}`,
                  backgroundColor: activeTheme.cardColor,
                }}
                onClick={() => {
                  if (!project?.thumbnail) return;
                  setFullscreenSrc(project.thumbnail);
                  setFullscreenType(isVideoUrl(project.thumbnail) ? "video" : "image");
                  setFullscreenIndex(-1);
                }}
              >
                {project?.thumbnail && isVideoUrl(project.thumbnail) ? (
                  <video
                    className="w-full max-h-[70vh] object-cover"
                    src={project.thumbnail}
                    muted
                    autoPlay
                    loop
                    playsInline
                  />
                ) : (
                  <picture>
                    <source
                      srcSet={project?.thumbnail?.replace(".jpg", ".avif")}
                      type="image/avif"
                    />
                    <source
                      srcSet={project?.thumbnail?.replace(".jpg", ".webp")}
                      type="image/webp"
                    />
                    <Image
                      property="true"
                      className="w-full max-h-[70vh] object-cover"
                      src={project?.thumbnail as string}
                      alt={project?.title as string}
                    />
                  </picture>
                )}
              </div>

              {project?.description && (
                <div
                  style={{ color: activeTheme.secondaryText }}
                  className="text-base md:text-lg leading-relaxed max-w-prose"
                >
                  <div
                    className="editor-content"
                    dangerouslySetInnerHTML={{
                      __html: project.description,
                    }}
                  />
                </div>
              )}

              {project?.source && (
                <a
                  href={project.source}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block"
                >
                  <Button
                    style={{
                      color: activeTheme.primaryText,
                      borderColor: activeTheme.borderColor,
                      backgroundColor: activeTheme.cardColor,
                    }}
                    variant="outline"
                    className="cursor-pointer gap-2"
                  >
                    <ExternalLink size={16} />
                    View Source
                  </Button>
                </a>
              )}

              {project?.ImagesList && project.ImagesList.length > 0 && (
                <div className="pt-6 space-y-4">
                  <h2
                    style={{ color: activeTheme.primaryText }}
                    className="text-xl font-semibold"
                  >
                    Gallery
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {project.ImagesList.map((image, index) => (
                      <div
                        key={image.id}
                        className="overflow-hidden rounded-xl cursor-pointer group"
                        style={{
                          border: `1px solid ${activeTheme.borderColor}`,
                          backgroundColor: activeTheme.cardColor,
                        }}
                        onClick={() => goToMedia(index)}
                      >
                        <Image
                          property="true"
                          className="w-full aspect-[4/3] object-cover"
                          src={image?.url}
                          alt={project?.title}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {fullscreenSrc && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 animate-in fade-in duration-300"
          onClick={closeFullscreen}
        >
          <button
            className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors cursor-pointer"
            onClick={closeFullscreen}
          >
            <X size={24} className="text-white" />
          </button>

          {fullscreenType === "video" ? (
            <video
              className="max-w-[98vw] max-h-[98vh] w-auto h-auto object-contain rounded-2xl animate-in zoom-in-95 duration-300"
              src={fullscreenSrc}
              controls
              autoPlay
              playsInline
              onClick={(e) => e.stopPropagation()}
            />
          ) : (
            <img
              className="max-w-[98vw] max-h-[98vh] w-auto h-auto object-contain rounded-2xl animate-in zoom-in-95 duration-300"
              src={fullscreenSrc}
              alt=""
              onClick={(e) => e.stopPropagation()}
            />
          )}

          {fullscreenIndex >= 0 && project?.ImagesList && project.ImagesList.length > 1 && (
            <>
              <button
                className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors cursor-pointer"
                onClick={(e) => { e.stopPropagation(); goPrev(); }}
              >
                <ChevronLeft size={28} className="text-white" />
              </button>
              <button
                className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors cursor-pointer"
                onClick={(e) => { e.stopPropagation(); goNext(); }}
              >
                <ChevronRight size={28} className="text-white" />
              </button>
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 px-3 py-1.5 rounded-full bg-white/10 text-white text-sm">
                {fullscreenIndex + 1} / {project.ImagesList.length}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default ProjectDetails;
