import { withGalleryAdmin } from '@/lib/gallery-admin';
import { uploadToCloudinary } from '@/lib/cloudinary';
import { readGalleryRequest } from '@/lib/gallery-request';
import { galleryImageSizeError, galleryImageTypeError, galleryMultipartLimit, getGalleryFileError } from '@/lib/gallery-upload-limits';
import { getDatabaseName } from '@/lib/mongodb';

export const runtime = 'nodejs';

export const POST = withGalleryAdmin('Gallery upload failed', async (request) => {
  const upload = await readGalleryRequest(request, galleryMultipartLimit);
  if (upload.status === 413) {
    return Response.json({ success: false, error: galleryImageSizeError }, { status: 413 });
  }
  const formData = upload.status === 200 ? await upload.body.formData().catch(() => null) : null;
  const file = formData?.get('file');

  const fileError = file instanceof File ? getGalleryFileError(file) : galleryImageTypeError;
  if (fileError || !(file instanceof File)) {
    return Response.json({ success: false, error: fileError }, { status: fileError === galleryImageSizeError ? 413 : 400 });
  }

  getDatabaseName();
  const base64 = Buffer.from(await file.arrayBuffer()).toString('base64');
  const result = await uploadToCloudinary(`data:${file.type};base64,${base64}`);
  return Response.json({
    success: true,
    url: result.secure_url,
    publicId: result.public_id,
    format: result.format,
    width: result.width,
    height: result.height,
    bytes: result.bytes,
  });
});
