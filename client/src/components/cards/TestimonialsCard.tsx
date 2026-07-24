import { ITestimonialType } from "@/lib/types";
import { useTheme } from "@/contexts/ThemeProvider";
import Image from "../ui/image";

function TestimonialsCard({
  profile,
  name,
  position,
  feedback,
  video,
}: ITestimonialType) {
  const { activeTheme } = useTheme();
  return (
    <div
      className="p-4 md:p-5 flex flex-col gap-3 rounded-xl border h-full"
      style={{
        backgroundColor: activeTheme.cardColor,
        borderColor: activeTheme.borderColor,
        color: activeTheme.primaryText,
      }}
    >
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full overflow-hidden shrink-0">
          <Image
            className="w-full h-full object-cover rounded-full"
            src={profile}
            alt={`${name}'s feedback`}
          />
        </div>
        <div className="min-w-0">
          <p className="font-semibold text-sm truncate">{name}</p>
          <p className="text-xs truncate" style={{ color: activeTheme.secondaryText }}>
            {position}
          </p>
        </div>
      </div>

      {feedback ? (
        <p
          className="text-sm leading-relaxed line-clamp-5"
          style={{ color: activeTheme.secondaryText }}
        >
          {feedback}
        </p>
      ) : video ? (
        <div className="rounded-lg overflow-hidden">
          <video
            className="w-full h-auto max-h-48 object-cover"
            autoPlay
            muted
            loop
            controls
          >
            <source src={video} type="video/mp4" />
          </video>
        </div>
      ) : null}
    </div>
  );
}

export default TestimonialsCard;
