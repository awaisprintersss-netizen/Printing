export interface GalleryItem {
  id: string | number;
  title: string;
  category: string;
  description: string;
  tags: string[];
  year: string;
  client: string;
  image: string;
  imagePublicId?: string; // For Cloudinary
}

export interface GalleryData {
  items: GalleryItem[];
}

export interface GalleryStats {
  totalItems: number;
  categoryCounts: Record<string, number>;
}

export interface GalleryCategory {
  id: string;
  name: string;
  count: number;
}

export interface GalleryFormData {
  title: string;
  category: string;
  description: string;
  tags: string[];
  year: string;
  client: string;
  image: string;
}

export interface AdminGalleryItem extends GalleryItem {
  _id?: string;
  imagePublicId?: string; // For Cloudinary
  createdAt?: Date;
  updatedAt?: Date;
}