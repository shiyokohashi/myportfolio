import Image from "next/image";

import { shouldUseUnoptimized } from "@/lib/media";
import { cn } from "@/lib/utils";

type PortfolioImageProps = {
  src: string;
  alt?: string;
  sizes: string;
  priority?: boolean;
  objectFit?: "cover" | "contain";
  containPadding?: boolean;
  imageClassName?: string;
};

/** Server-rendered cover image — avoids client hydration before fetch starts. */
export function PortfolioImage({
  src,
  alt = "",
  sizes,
  priority = false,
  objectFit = "cover",
  containPadding = false,
  imageClassName,
}: PortfolioImageProps) {
  return (
    <Image
      src={src}
      alt={alt}
      fill
      priority={priority}
      loading={priority ? undefined : "lazy"}
      sizes={sizes}
      unoptimized={shouldUseUnoptimized(src)}
      className={cn(
        objectFit === "contain" ? "object-contain object-center" : "object-cover",
        containPadding && "p-1",
        imageClassName,
      )}
    />
  );
}
