import { ITestimonialType } from "@/lib/types";
import { Card } from "../ui/card";

function TestimonialsCard({
  profile,
  name,
  position,
  text,
  video,
}: ITestimonialType) {
  return (
    <Card>
      <div className="flex items-center space-x-2">
        <div className="w-12 h-12 overflow-hidden">
          <img
            className="w-full h-full object-cover"
            src={profile}
            alt={position}
          />
        </div>
        <div className="flex flex-col items-start justify-start ">
          <h2>{name}</h2>
          <h3>{position}</h3>
        </div>
      </div>
      <div>
        {text && <p>{text}</p>}
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
