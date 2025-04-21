import { ITestimonialType } from "@/lib/types";
import { Card } from "../ui/card";
import { useTheme } from "@/contexts/ThemeProvider";

function TestimonialsCard({
  profile,
  name,
  position,
  text,
  video,
}: ITestimonialType) {
  const { activeTheme } = useTheme();
  return (
    <Card
      style={{
        backgroundColor: activeTheme.cardColor,
        border: `1px solid ${activeTheme.borderColor}`,
        color: activeTheme.primaryText,
      }}
    >
      <div className="flex items-center space-x-2">
        <div className="w-12 h-12 overflow-hidden">
          <img
            className="w-full h-full object-cover"
            src={profile}
            alt={position}
          />
        </div>
        <div className="flex flex-col items-start justify-start ">
          <h2 className="font-bold">{name}</h2>
          <h3 style={{ color: activeTheme.secondaryText }} className="text-sm">
            {position}
          </h3>
        </div>
      </div>
      <div>
        {text && <p style={{ color: activeTheme.secondaryText }}>{text}</p>}
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
