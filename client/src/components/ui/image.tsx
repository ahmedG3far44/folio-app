import { useEffect, useRef, useState, CSSProperties } from "react";
import { cn } from "@/lib/utils";

interface ImageProps {
  src: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
  aspectRatio?: string;
  objectFit?: "contain" | "cover" | "fill" | "none" | "scale-down";
  priority?: boolean;
  onLoad?: () => void;
  onError?: () => void;
  role?: string;
  property?: string;
}

/**
 * Simplified Image Component with:
 * - Progressive loading with blur effect
 * - Lazy loading by default
 * - Proper aspect ratio handling
 */
export function Image({
  src,
  alt,
  className,
  width,
  height,
  aspectRatio,
  objectFit = "cover",
  priority = false,
  onLoad,
  onError,
  role,
  property,
}: ImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const img = imgRef.current;
    if (!img) return;

    const handleLoad = () => {
      setIsLoaded(true);
      setHasError(false);
      onLoad?.();
    };

    const handleError = () => {
      setHasError(true);
      setIsLoaded(true);
      onError?.();
    };

    if (img.complete && img.naturalHeight > 0) {
      handleLoad();
    }

    img.addEventListener("load", handleLoad);
    img.addEventListener("error", handleError);

    return () => {
      img.removeEventListener("load", handleLoad);
      img.removeEventListener("error", handleError);
    };
  }, [src, onLoad, onError]);

  const containerStyle: CSSProperties = {
    aspectRatio:
      aspectRatio || (width && height ? `${width}/${height}` : undefined),
    position: "relative",
    overflow: "hidden",
  };

  const imageStyle: CSSProperties = {
    objectFit,
    objectPosition: "center",
  };

  const ErrorFallback = () => (
    <div
      className={cn(
        "flex items-center justify-center bg-muted text-muted-foreground",
        className
      )}
      style={containerStyle}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="48"
        height="48"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
        <circle cx="9" cy="9" r="2" />
        <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
      </svg>
    </div>
  );

  if (hasError) {
    return <ErrorFallback />;
  }

  return (
    <div className={cn("relative", className)} style={containerStyle}>
      {!isLoaded && (
        <div
          className="absolute inset-0 bg-muted animate-pulse"
          aria-hidden="true"
        />
      )}

      <img
        ref={imgRef}
        src={src}
        alt={alt}
        width={width}
        height={height}
        loading={priority ? "eager" : "lazy"}
        decoding={priority ? "sync" : "async"}
        className={cn(
          "w-full h-full transition-opacity duration-500",
          isLoaded ? "opacity-100" : "opacity-0"
        )}
        style={imageStyle}
        role={role}
        property={property}
      />
    </div>
  );
}

export default Image;

// ============================================
// Advanced Image Component with Zoom
// ============================================

interface AdvancedImageProps extends ImageProps {
  zoomable?: boolean;
  showCaption?: boolean;
  caption?: string;
}

export function AdvancedImage({
  zoomable = false,
  showCaption = false,
  caption,
  ...imageProps
}: AdvancedImageProps) {
  const [isZoomed, setIsZoomed] = useState(false);

  const handleImageClick = () => {
    if (zoomable) {
      setIsZoomed(true);
    }
  };

  return (
    <>
      <figure className={cn("group relative", imageProps.className)}>
        <div
          className={cn(
            "overflow-hidden rounded-lg",
            zoomable && "cursor-zoom-in"
          )}
          onClick={handleImageClick}
        >
          <Image
            {...imageProps}
            className={cn(
              zoomable &&
                "group-hover:scale-105 transition-transform duration-300"
            )}
          />
        </div>

        {showCaption && caption && (
          <figcaption className="mt-2 text-sm text-muted-foreground text-center">
            {caption}
          </figcaption>
        )}

        {zoomable && (
          <div
            className={cn(
              "absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none",
              "bg-black/20 rounded-lg"
            )}
          >
            <div className="bg-background/90 rounded-full p-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.35-4.35" />
                <line x1="11" x2="11" y1="8" y2="14" />
                <line x1="8" x2="14" y1="11" y2="11" />
              </svg>
            </div>
          </div>
        )}
      </figure>

      {isZoomed && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 cursor-zoom-out"
          onClick={() => setIsZoomed(false)}
        >
          <div className="relative max-w-7xl max-h-full">
            <Image
              {...imageProps}
              priority
              className="max-w-full max-h-[90vh] object-contain"
            />
            <button
              className="absolute top-4 right-4 p-2 bg-background/80 rounded-full hover:bg-background transition-colors"
              onClick={() => setIsZoomed(false)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M18 6 6 18" />
                <path d="m6 6 12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </>
  );
}

// ============================================
// Avatar Image Component
// ============================================

interface AvatarImageProps {
  src: string;
  alt: string;
  size?: "xs" | "sm" | "md" | "lg" | "xl" | "2xl";
  fallback?: string;
  className?: string;
  onLoad?: () => void;
  onError?: () => void;
}

const avatarSizes = {
  xs: "h-6 w-6",
  sm: "h-8 w-8",
  md: "h-10 w-10",
  lg: "h-12 w-12",
  xl: "h-16 w-16",
  "2xl": "h-24 w-24",
};

export function AvatarImage({
  src,
  alt,
  size = "md",
  fallback,
  className,
  onLoad,
  onError,
}: AvatarImageProps) {
  const [hasError, setHasError] = useState(false);

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const handleError = () => {
    setHasError(true);
    onError?.();
  };

  if (hasError && fallback) {
    return (
      <div
        className={cn(
          "flex items-center justify-center rounded-full bg-muted text-muted-foreground font-semibold",
          avatarSizes[size],
          className
        )}
      >
        {getInitials(fallback)}
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      className={cn("rounded-full", avatarSizes[size], className)}
      objectFit="cover"
      priority
      onLoad={onLoad}
      onError={handleError}
    />
  );
}
