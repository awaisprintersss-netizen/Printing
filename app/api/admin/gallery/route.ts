import { ObjectId } from 'mongodb';
import { flagGalleryUploadForReview, getGalleryImageError, uploadToCloudinary } from '@/lib/cloudinary';
import { withGalleryAdmin } from '@/lib/gallery-admin';
import { publicGalleryImageUrl } from '@/lib/gallery-media';
import { readGalleryRequest } from '@/lib/gallery-request';
import { galleryImageSizeError, galleryJsonLimit } from '@/lib/gallery-upload-limits';
import { getGalleryCollection, toGalleryItem } from '@/lib/services/galleryService';

async function readGalleryInput(request: Request) {
  const result = await readGalleryRequest(request, galleryJsonLimit);
  if (result.status === 413) return reject('The request is too large. Choose a smaller image or shorten the project details.', 413);
  const input: unknown = result.status === 200 ? await result.body.json().catch(() => null) : null;
  if (!input || typeof input !== 'object' || Array.isArray(input)) return null;

  const data = input as Record<string, unknown>;
  const { _id, title, category, description, client, tags, year, image, imageFile } = data;

  if (typeof title !== 'string' || !title.trim() ||
      typeof category !== 'string' || !category.trim() ||
      typeof description !== 'string' || !description.trim() ||
      typeof client !== 'string' || !client.trim()) return null;
  if (tags !== undefined && (!Array.isArray(tags) || tags.some(tag => typeof tag !== 'string'))) return null;
  if (year !== undefined && typeof year !== 'string') return null;
  if (imageFile !== undefined) {
    if (typeof imageFile !== 'string') return null;
    const error = getGalleryImageError(imageFile);
    if (error === 413) return reject(galleryImageSizeError, 413);
    if (error) return null;
  }

  const imagePath = typeof image === 'string' ? publicGalleryImageUrl(image.trim()) : null;
  if (!imageFile && !imagePath) return null;

  return {
    id: typeof _id === 'string' && ObjectId.isValid(_id) ? new ObjectId(_id) : null,
    fields: {
      title: title.trim(),
      category: category.trim(),
      description: description.trim(),
      client: client.trim(),
      tags: (tags as string[] | undefined) ?? [],
      year: year?.trim() || String(new Date().getFullYear()),
    },
    imagePath: imagePath ?? '',
    imageFile,
  };
}

function reject(message: string, status = 400) {
  return Response.json({ success: false, error: message }, { status });
}

export const GET = withGalleryAdmin('Admin gallery read failed', async () => {
  const collection = await getGalleryCollection();
  const items = await collection.find({}).sort({ id: 1 }).toArray();
  return Response.json({
    success: true,
    items: items.map(item => ({
      ...toGalleryItem(item),
      _id: item._id.toHexString(),
      imagePublicId: item.imagePublicId ?? null,
      createdAt: item.createdAt,
      updatedAt: item.updatedAt,
    })),
    count: items.length,
  }, { headers: { 'Cache-Control': 'private, no-store' } });
});

export const POST = withGalleryAdmin('Gallery creation failed', async (request) => {
  const data = await readGalleryInput(request);
  if (data instanceof Response) return data;
  if (!data) return reject('Enter the required gallery fields and a valid image.');

  const collection = await getGalleryCollection();
  const uploaded = data.imageFile ? await uploadToCloudinary(data.imageFile) : null;
  const _id = new ObjectId();
  const now = new Date();
  const item = {
    _id,
    id: _id.toHexString(),
    ...data.fields,
    image: uploaded?.secure_url ?? data.imagePath,
    imagePublicId: uploaded?.public_id ?? null,
    createdAt: now,
    updatedAt: now,
  };

  try {
    await collection.insertOne(item);
  } catch (error) {
    // A failed acknowledgement may still mean the record was saved.
    if (uploaded) flagGalleryUploadForReview('Gallery create outcome uncertain', uploaded.public_id);
    throw error;
  }
  return Response.json({
    success: true,
    item: { ...item, _id: _id.toHexString() },
    message: 'Gallery item created successfully',
  });
});

export const PUT = withGalleryAdmin('Gallery update failed', async (request) => {
  const data = await readGalleryInput(request);
  if (data instanceof Response) return data;
  if (!data || !data.id) return reject('Enter a valid item ID, required gallery fields and a valid image.');

  const collection = await getGalleryCollection();
  const existing = await collection.findOne({ _id: data.id });
  if (!existing) return reject('Item not found', 404);

  const uploaded = data.imageFile ? await uploadToCloudinary(data.imageFile) : null;
  const image = uploaded?.secure_url ?? data.imagePath;
  const imagePublicId = uploaded?.public_id ?? (image === existing.image ? existing.imagePublicId ?? null : null);
  const previousTime = existing.updatedAt instanceof Date ? existing.updatedAt.getTime() : 0;
  const updatedAt = new Date(Math.max(Date.now(), previousTime + 1));
  try {
    const result = await collection.updateOne(
      { _id: data.id, updatedAt: existing.updatedAt ?? null },
      { $set: { ...data.fields, image, imagePublicId, updatedAt } },
    );
    if (!result.matchedCount) {
      if (uploaded) flagGalleryUploadForReview('Gallery edit conflicted', uploaded.public_id);
      return reject('This item changed. Refresh and try again.', 409);
    }
  } catch (error) {
    if (uploaded) flagGalleryUploadForReview('Gallery update outcome uncertain', uploaded.public_id);
    throw error;
  }
  // Stored URLs can be shared across records. Media retirement requires a separate ownership review.
  return Response.json({ success: true, message: 'Gallery item updated successfully' });
});

export const DELETE = withGalleryAdmin('Gallery deletion failed', async (request) => {
  const id = new URL(request.url).searchParams.get('id');
  if (!id || !ObjectId.isValid(id)) return reject('A valid item ID is required.');

  const collection = await getGalleryCollection();
  const item = await collection.findOneAndDelete({ _id: new ObjectId(id) });
  if (!item) return reject('Item not found', 404);

  return Response.json({ success: true, message: 'Gallery item deleted successfully' });
});
