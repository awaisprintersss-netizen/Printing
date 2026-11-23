import { publicGalleryImageUrl } from '@/lib/gallery-media';
import { getMongoDatabase } from '@/lib/mongodb';
import type { GalleryItem } from '@/types/gallery';
import type { WithId } from 'mongodb';

type GalleryRecord = Omit<GalleryItem, 'id' | 'imagePublicId'> & {
  id?: GalleryItem['id'];
  imagePublicId?: string | null;
  createdAt?: Date;
  updatedAt?: Date | null;
};

export async function getGalleryCollection() {
  const db = await getMongoDatabase();
  return db.collection<GalleryRecord>('galleryItems');
}

export function toGalleryItem(item: WithId<GalleryRecord>): GalleryItem {
  const id = typeof item.id === 'number' || (typeof item.id === 'string' && item.id)
    ? String(item.id)
    : item._id.toHexString();

  return {
    id,
    title: typeof item.title === 'string' ? item.title : '',
    category: typeof item.category === 'string' ? item.category : '',
    description: typeof item.description === 'string' ? item.description : '',
    tags: Array.isArray(item.tags) ? item.tags.filter(tag => typeof tag === 'string') : [],
    year: typeof item.year === 'number' || typeof item.year === 'string' ? String(item.year) : '',
    client: typeof item.client === 'string' ? item.client : '',
    image: typeof item.image === 'string' ? item.image : '',
  };
}

export async function getGalleryItems(): Promise<GalleryItem[]> {
  const collection = await getGalleryCollection();
  const items = await collection.find({}, {
    projection: { _id: 1, id: 1, title: 1, category: 1, description: 1, tags: 1, year: 1, client: 1, image: 1 },
  }).toArray();
  return items.map(item => {
    const galleryItem = toGalleryItem(item);
    return { ...galleryItem, image: publicGalleryImageUrl(galleryItem.image) ?? '' };
  });
}
