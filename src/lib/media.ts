const VIDEO_EXTENSION = /\.(mov|mp4|webm)(\?.*)?$/i;

export function isVideoSrc(src?: string): boolean {
  if (!src) return false;
  return VIDEO_EXTENSION.test(src);
}
