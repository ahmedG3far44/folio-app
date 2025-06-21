import { useEffect, useRef, useState } from "react";

function Image({
  width,
  height,
  src,
  className,
  alt,
  property,
  role,
  onLoad,
  onError,
}: {
  width?: number;
  height?: number;
  src: string;
  property?: string;
  className?: string;
  alt: string;
  role?: string;
  onLoad?: () => void;
  onError?: () => void;
}) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isError, setIsError] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const img = imgRef.current;
    console.log(isError);
    if (!img) return;

    const handleLoad = () => {
      setIsLoaded(true);
      onLoad?.();
    };

    const handleError = () => {
      setIsError(true);
      onError?.();
    };

    // Check if image is already loaded (cached)
    if (img.complete) {
      handleLoad();
    }

    // Add event listeners
    img.addEventListener("load", handleLoad);
    img.addEventListener("error", handleError);

    return () => {
      if (img) {
        img.removeEventListener("load", handleLoad);
        img.removeEventListener("error", handleError);
      }
    };
  }, [src, onLoad, onError]);
  return (
    <picture>
      <source
        type="image/avif"
        srcSet={`${src}?width=100 100w, ${src}?width=200 200w, ${src}?width=400 400w, ${src}?width=800 800w`}
      />
      <source
        type="image/webp"
        srcSet={`${src}?width=100 100w, ${src}?width=200 200w, ${src}?width=400 400w, ${src}?width=800 800w`}
      />
      <img
        ref={imgRef}
        style={{ backgroundImage: `url(${src})`, backgroundPosition: "center" }}
        height={height}
        width={width}
        role={role}
        property={property}
        src={src}
        srcSet={`${src}?width=100 100w, ${src}?width=200 200w, ${src}?width=400 400w, ${src}?width=800 800w`}
        sizes="(max-width: 800px) 100vw, 50vw"
        loading="lazy"
        decoding="async"
        className={`${className} ${!isLoaded && "blur-md opacity-80"}`}
        alt={alt}
      />
    </picture>
  );
}

export default Image;
