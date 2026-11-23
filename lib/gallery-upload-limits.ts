// 3 MiB encodes to 4 MiB of base64, leaving room under Vercel's 4.5 MB request limit.
export const galleryImageLimit = 3 * 1024 * 1024;
export const galleryImageLimitLabel = '3 MiB';
export const galleryImageSizeError = `Choose an image ${galleryImageLimitLabel} or smaller.`;
export const galleryImageTypeError = 'Choose a nonempty image file.';

export const galleryJsonLimit = 4 * Math.ceil(galleryImageLimit / 3) + 64 * 1024;
export const galleryMultipartLimit = galleryImageLimit + 64 * 1024;

export function getGalleryFileError(file: Pick<File, 'size' | 'type'>) {
  if (!file.size || !/^image\/[\w.+-]+$/i.test(file.type)) return galleryImageTypeError;
  if (file.size > galleryImageLimit) return galleryImageSizeError;
  return null;
}
