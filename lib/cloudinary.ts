import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function uploadToCloudinary(
  file: Buffer | string, 
  folder: string = 'printing-gallery'
): Promise<UploadApiResponse> {
  try {
    // If file is a base64 string
    if (typeof file === 'string') {
      const result = await cloudinary.uploader.upload(file, {
        folder,
        resource_type: 'auto',
      });
      return result;
    }
    
    // If file is a Buffer, convert to base64 first
    const base64String = `data:image/jpeg;base64,${file.toString('base64')}`;
    const result = await cloudinary.uploader.upload(base64String, {
      folder,
      resource_type: 'auto',
    });
    
    return result;
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    throw error;
  }
}

export async function deleteFromCloudinary(publicId: string): Promise<any> {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return result;
  } catch (error) {
    console.error('Cloudinary delete error:', error);
    throw error;
  }
}

export function getCloudinaryUrl(publicId: string, options?: any): string {
  return cloudinary.url(publicId, {
    width: 1200,
    height: 800,
    crop: 'fill',
    quality: 'auto',
    fetch_format: 'auto',
    ...options,
  });
}

// Helper function to check if string is base64
export function isBase64(str: string): boolean {
  if (str.startsWith('data:image')) {
    return true;
  }
  try {
    return btoa(atob(str)) === str;
  } catch (err) {
    return false;
  }
}