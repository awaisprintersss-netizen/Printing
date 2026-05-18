import clientPromise from '@/lib/mongodb';
import { GalleryItem } from '@/types/gallery';

export async function getGalleryItems(): Promise<GalleryItem[]> {
  try {
    const client = await clientPromise;
    const db = client.db('printingdata');
    const collection = db.collection('galleryItems');
    
    const items = await collection.find({}).toArray();
    
    // Convert MongoDB _id to id and ensure proper typing
    return items.map(item => ({
      id: item._id.toString(),
      title: item.title,
      category: item.category,
      description: item.description,
      tags: item.tags,
      year: item.year,
      client: item.client,
      image: item.image
    })) as GalleryItem[];
  } catch (error) {
    console.error('Error fetching gallery items:', error);
    return [];
  }
}

export async function getGalleryItem(id: string): Promise<GalleryItem | null> {
  try {
    const client = await clientPromise;
    const db = client.db('printingdata');
    const collection = db.collection('galleryItems');
    
    const item = await collection.findOne({ id: parseInt(id) });
    
    if (!item) return null;
    
    return {
      id: item.id,
      title: item.title,
      category: item.category,
      description: item.description,
      tags: item.tags,
      year: item.year,
      client: item.client,
      image: item.image
    } as GalleryItem;
  } catch (error) {
    console.error('Error fetching gallery item:', error);
    return null;
  }
}

export async function getGalleryStats() {
  try {
    const client = await clientPromise;
    const db = client.db('printingdata');
    const collection = db.collection('galleryItems');
    
    const totalItems = await collection.countDocuments();
    
    // Get category counts
    const categoryCounts = await collection.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } }
    ]).toArray();
    
    return {
      totalItems,
      categoryCounts: categoryCounts.reduce((acc, curr) => {
        acc[curr._id] = curr.count;
        return acc;
      }, {} as Record<string, number>)
    };
  } catch (error) {
    console.error('Error fetching gallery stats:', error);
    return { totalItems: 0, categoryCounts: {} };
  }
}