import { randomUUID } from 'node:crypto';
import { v2 as cloudinary, type UploadApiResponse } from 'cloudinary';
import { galleryImageLimit } from '@/lib/gallery-upload-limits';

export function flagGalleryUploadForReview(operation: string, publicId: string) {
  console.warn(operation, { publicId });
}

export async function uploadToCloudinary(image: string): Promise<UploadApiResponse> {
  const cloud_name = process.env.CLOUDINARY_CLOUD_NAME;
  const api_key = process.env.CLOUDINARY_API_KEY;
  const api_secret = process.env.CLOUDINARY_API_SECRET;
  if (!cloud_name?.trim() || !api_key?.trim() || !api_secret?.trim()) throw new Error('Cloudinary is not configured');
  cloudinary.config({ cloud_name, api_key, api_secret });

  const publicId = `printing-gallery/${randomUUID()}`;
  try {
    return await cloudinary.uploader.upload(image, {
      public_id: publicId,
      overwrite: false,
      resource_type: 'image',
      tags: ['awais-gallery-upload'],
    });
  } catch {
    flagGalleryUploadForReview('Cloudinary upload outcome uncertain', publicId);
    throw new Error('Cloudinary could not complete the gallery upload');
  }
}

export function getGalleryImageError(value: string) {
  const data = /^data:image\/[\w.+-]+;base64,([A-Za-z0-9+/]+={0,2})$/.exec(value)?.[1];
  if (!data || data.length % 4 !== 0) return 400;
  if (Buffer.byteLength(data, 'base64') > galleryImageLimit) return 413;
  return null;
}
