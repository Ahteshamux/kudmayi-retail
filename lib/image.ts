/** Longest edge, in pixels, that we keep. Plenty for a full-bleed detail shot. */
const MAX_EDGE = 1600;
const JPEG_QUALITY = 0.82;

/**
 * Shrinks a camera photo before upload. A modern phone shoots 3–8 MB; this
 * lands around 200–400 KB, so uploading over mobile data takes a moment
 * rather than a minute.
 *
 * Browser-only — needs a canvas.
 */
export async function compressImage(file: File): Promise<Blob> {
  const bitmap = await createImageBitmap(file);

  try {
    const scale = Math.min(1, MAX_EDGE / Math.max(bitmap.width, bitmap.height));
    const width = Math.round(bitmap.width * scale);
    const height = Math.round(bitmap.height * scale);

    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Could not process this image.");

    ctx.drawImage(bitmap, 0, 0, width, height);

    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve, "image/jpeg", JPEG_QUALITY),
    );
    if (!blob) throw new Error("Could not process this image.");

    return blob;
  } finally {
    bitmap.close();
  }
}

/**
 * Recovers the storage object path from a public URL, so deleting a product
 * can delete its photo too. Returns null if the URL isn't one of ours.
 */
export function storagePathFromPublicUrl(
  url: string | null,
  bucket: string,
): string | null {
  if (!url) return null;
  const marker = `/storage/v1/object/public/${bucket}/`;
  const index = url.indexOf(marker);
  if (index === -1) return null;

  const path = url.slice(index + marker.length).split("?")[0];
  return path ? decodeURIComponent(path) : null;
}
