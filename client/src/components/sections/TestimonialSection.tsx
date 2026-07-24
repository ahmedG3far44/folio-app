import { ITestimonialType } from "@/lib/types";
import TestimonialsCard from "../cards/TestimonialsCard";

function TestimonialSection({
  testimonials,
}: {
  testimonials: ITestimonialType[];
}) {
  if (testimonials.length === 0) return null;

  return (
    <div className="relative w-full my-24 overflow-hidden">
      <div
        className="flex gap-4 overflow-x-auto pb-2 snap-x snap-mandatory scrollbar-none"
        style={{ scrollbarWidth: "none" }}
      >
        {testimonials.map((testimonial) => {
          const { id, profile, name, position, feedback, video, createdAt } =
            testimonial;

          return (
            <div
              key={id}
              className="flex-shrink-0 w-72 md:w-80 snap-start"
            >
              <TestimonialsCard
                id={id}
                profile={profile}
                name={name}
                position={position}
                feedback={feedback}
                video={video}
                createdAt={createdAt}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default TestimonialSection;
