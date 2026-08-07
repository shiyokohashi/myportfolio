const VIDEO_EXTENSION = /\.(mov|mp4|webm)(\?.*)?$/i;

export function isVideoSrc(src?: string): boolean {
  if (!src) return false;
  return VIDEO_EXTENSION.test(src);
}

const OPTIMIZABLE_HOSTS = new Set(["www.shiyoohashi.com", "i-p.rmcdn.net"]);

export function isOptimizableRemote(src: string): boolean {
  try {
    return OPTIMIZABLE_HOSTS.has(new URL(src).hostname);
  } catch {
    return false;
  }
}

/** Skip Next.js optimizer only for remote hosts outside `remotePatterns`. */
export function shouldUseUnoptimized(src: string, unoptimized = false): boolean {
  if (unoptimized) return true;
  if (!src.startsWith("http")) return false;
  return !isOptimizableRemote(src);
}

export function getVideoPoster(slugOrId?: string): string | undefined {
  if (!slugOrId) return undefined;
  if (slugOrId.includes("deskkeeper")) {
    return "/images/projects/deskkeeper/icon.png";
  }
  if (slugOrId.includes("aeon")) {
    return "/images/projects/aeon/interaction-design.png";
  }
  if (slugOrId.includes("graduaid")) {
    return "/images/projects/graduaid/hero-light.png";
  }
  if (slugOrId.includes("imployed")) {
    return "/images/projects/imployed/poster.png";
  }
  if (slugOrId.includes("portfolio-sketchbook")) {
    return "/images/projects/portfolio-book.png";
  }
  return undefined;
}

/** Static image for carousel cards — videos use posters instead of full files. */
export function getCarouselDisplaySrc(
  thumbnail?: string,
  cardId?: string,
): string | undefined {
  if (!thumbnail) return undefined;
  if (isVideoSrc(thumbnail)) {
    return getVideoPoster(cardId);
  }
  return thumbnail;
}
