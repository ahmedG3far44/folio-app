import { ITestimonialType } from "@/lib/types";
import TestimonialsCard from "../cards/TestimonialsCard";
import { useEffect, useRef, useState } from "react";

function TestimonialSection({
  testimonials,
}: {
  testimonials: ITestimonialType[];
}) {
  const [isPaused, setIsPaused] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container || testimonials.length === 0) return;

    const scroll = () => {
      if (isPaused) return;

      const maxScroll = container.scrollWidth / 2;

      if (container.scrollLeft >= maxScroll) {
        container.scrollLeft = 0;
      } else {
        container.scrollLeft += 1;
      }
    };

    const intervalId = setInterval(scroll, 20);

    return () => clearInterval(intervalId);
  }, [isPaused, testimonials.length]);

  if (testimonials.length === 0) return null;

  return (
    <div className="relative w-full my-24 overflow-hidden">
      {/* Left blur gradient */}
      <div className="absolute left-0 top-0 bottom-0 w-24 md:w-32 blur-1 z-10 pointer-events-none" />

      {/* Right blur gradient */}
      <div className="absolute right-0 top-0 bottom-0 w-24 blur-2xl md:w-32 z-10 pointer-events-none" />

      <div
        ref={scrollContainerRef}
        className="flex gap-4 overflow-x-hidden"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        style={{ scrollBehavior: "auto" }}
      >
        {testimonials.map((testimonial) => {
          const { id, profile, name, position, feedback, video, createdAt } =
            testimonial;

          return (
            <div key={id} className="flex-shrink-0 w-72 md:w-80 min-h-full">
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

        {/* Duplicate set for infinite scroll */}
        {testimonials.map((testimonial) => {
          const { id, profile, name, position, feedback, video, createdAt } =
            testimonial;

          return (
            <div key={`duplicate-${id}`} className="flex-shrink-0 w-72 md:w-80">
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
