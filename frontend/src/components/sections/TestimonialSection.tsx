import { ITestimonialType } from "@/lib/types";
import TestimonialsCard from "../cards/TestimonialsCard";

function TestimonialSection({
  testimonials,
}: {
  testimonials: ITestimonialType[];
}) {
  return (
    <div>
      <div>
        {testimonials.map((testimonial: ITestimonialType) => {
          return (
            <TestimonialsCard
              key={testimonial.id}
              id={testimonial.id}
              profile={testimonial.profile}
              name={testimonial.name}
              position={testimonial.position}
              text={testimonial.text}
              video={testimonial.video}
            />
          );
        })}
      </div>
    </div>
  );
}

export default TestimonialSection;
