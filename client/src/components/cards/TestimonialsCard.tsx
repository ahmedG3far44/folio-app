import { ITestimonialType } from "@/lib/types";
import { Card } from "../ui/card";
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
    <Card
      className="p-4 flex flex-col h-full items-start justify-start gap-2"
      style={{
        backgroundColor: activeTheme.cardColor,
        border: `1px solid ${activeTheme.borderColor}`,
        color: activeTheme.primaryText,
      }}
    >
      <div className="flex items-center space-x-2">
        <div className="w-10 h-10 rounded-full overflow-hidden">
          <Image
            className="w-full h-full object-cover "
            src={profile}
            alt={`${name} ${position} feedback`}
          />
        </div>
        <div className="flex flex-col items-start justify-start ">
          <h2 className="font-bold">{name}</h2>
          <h3
            style={{ color: activeTheme.secondaryText }}
            className="text-[12px] "
          >
            {position}
          </h3>
        </div>
      </div>
      <div className="w-full mx-auto">
        {feedback ? (
          <p
            className="text-sm line-clamp-4"
            style={{ color: activeTheme.secondaryText }}
          >
            {feedback}
          </p>
        ) : (
          <div>
            <video
              width={200}
              height={200}
              className="w-full h-full rounded-xl"
              autoPlay
              muted
              loop
              controls
            >
              <source src={video} type="video/mp4" />
            </video>
          </div>
        )}
      </div>
    </Card>
  );
}

export default TestimonialsCard;
