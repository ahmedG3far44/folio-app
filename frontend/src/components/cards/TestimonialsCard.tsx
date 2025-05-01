import { ITestimonialType } from "@/lib/types";
import { Card } from "../ui/card";
import { useTheme } from "@/contexts/ThemeProvider";

function TestimonialsCard({
  profile,
  name,
  position,
  feedback,
  video,
}: ITestimonialType) {
  const { activeTheme } = useTheme();
  // const date = new Date(createdAt);
  
  return (
    <Card
      className="p-4 flex flex-col items-start justify-start gap-2"
      style={{
        backgroundColor: activeTheme.cardColor,
        border: `1px solid ${activeTheme.borderColor}`,
        color: activeTheme.primaryText,
      }}
    >
      <div className="flex items-center space-x-2">
        <div className="w-10 h-10 rounded-full overflow-hidden">
          <img
            loading="lazy"
            className="w-full h-full object-cover"
            src={profile}
            alt={position}
          />
        </div>
        <div className="flex flex-col items-start justify-start ">
          <h2 className="font-bold">{name}</h2>
          <h3 style={{ color: activeTheme.secondaryText }} className="text-[12px] ">
            {position}
          </h3>
        </div>
      </div>
      <div className="w-full">
        {feedback && (
          <p className="text-sm line-clamp-4" style={{ color: activeTheme.secondaryText }}>
            {feedback}
          </p>
        )}
        {video && (
          <video
            className="w-full h-full rounded-xl"
            src={video}
            autoPlay
            muted
            loop
          />
        )}
      </div>
    </Card>
  );
}

export default TestimonialsCard;
