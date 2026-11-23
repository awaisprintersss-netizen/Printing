import { getGalleryItems } from '@/lib/services/galleryService';
import { logServerError } from '@/lib/server-error';

export async function GET() {
  try {
    const items = await getGalleryItems();
    return Response.json({ success: true, items, count: items.length });
  } catch (error) {
    logServerError('Public gallery read failed', error);
    return Response.json(
      { success: false, error: 'The gallery is temporarily unavailable.', items: [], count: 0 },
      { status: 503 },
    );
  }
}

export const dynamic = 'force-dynamic';
