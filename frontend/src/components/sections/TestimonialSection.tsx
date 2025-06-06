import { ITestimonialType } from "@/lib/types";

import TestimonialsCard from "../cards/TestimonialsCard";

function TestimonialSection({
  testimonials,
}: {
  testimonials: ITestimonialType[];
}) {
  return (
    <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 grid-flow-row my-24">
      {testimonials.length > 0 &&
        testimonials.map(
          ({
            id,
            profile,
            name,
            position,
            feedback,
            video,
            createdAt,
          }: ITestimonialType) => {
            return (
              <TestimonialsCard
                key={id}
                id={id}
                profile={profile}
                name={name}
                position={position}
                feedback={feedback}
                video={video}
                createdAt={createdAt}
              />
            );
          }
        )}
    </div>
  );
}

export default TestimonialSection;
