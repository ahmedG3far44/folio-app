import { ITestimonialType } from "@/lib/types";

import TestimonialsCard from "../cards/TestimonialsCard";

function TestimonialSection({
  testimonials,
}: {
  testimonials: ITestimonialType[];
}) {
  return (
    <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 grid-flow-row mb-18">
      {testimonials.length > 0 &&
        testimonials.map((testimonial: ITestimonialType) => {
          return (
            <TestimonialsCard
              key={testimonial.id}
              id={testimonial.id}
              profile={testimonial.profile}
              name={testimonial.name}
              position={testimonial.position}
              feedback={testimonial.feedback}
              video={testimonial.video}
              createdAt={testimonial.createdAt}
            />
          );
        })}
    </div>
  );
}

export default TestimonialSection;
