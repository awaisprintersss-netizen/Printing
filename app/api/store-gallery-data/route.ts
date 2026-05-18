import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { GalleryItem } from '@/types/gallery';

const galleryItems: GalleryItem[] = [
  {
    id: 1,
    title: "Premium Leather Business Cards",
    category: "business",
    description: "Embossed leather business cards with gold foil stamping for luxury brand",
    tags: ["Business Cards", "Leather", "Foil Stamping", "Embossing"],
    year: "2024",
    client: "Luxury Watches Inc.",
    image: "/gallery/business-cards-1.jpg"
  },
  {
    id: 2,
    title: "Eco-Friendly Product Packaging",
    category: "packaging",
    description: "Sustainable packaging design with soy-based inks and recycled materials",
    tags: ["Packaging", "Eco-Friendly", "Sustainable", "Recycled"],
    year: "2024",
    client: "Green Beauty Co.",
    image: "/gallery/packaging-1.jpg"
  },
  {
    id: 3,
    title: "Custom Wine Label Collection",
    category: "labels",
    description: "Elegant wine labels with metallic inks and textured paper stock",
    tags: ["Labels", "Wine", "Metallic", "Premium"],
    year: "2023",
    client: "Vineyard Estates",
    image: "/gallery/labels-1.jpg"
  },
  {
    id: 4,
    title: "Corporate Brochure Series",
    category: "brochures",
    description: "Complete corporate identity brochure with gatefold design",
    tags: ["Brochures", "Corporate", "Gatefold", "Branding"],
    year: "2023",
    client: "Tech Innovations Ltd.",
    image: "/gallery/brochures-1.jpg"
  },
  {
    id: 5,
    title: "Large Format Event Banner",
    category: "banners",
    description: "20ft vinyl banner for international trade show exhibition",
    tags: ["Banners", "Large Format", "Vinyl", "Events"],
    year: "2023",
    client: "Global Expo 2023",
    image: "/gallery/banners-1.jpg"
  },
  {
    id: 6,
    title: "Thermal Sticker Collection",
    category: "labels",
    description: "Custom thermal stickers for product labeling and barcoding",
    tags: ["Stickers", "Thermal", "Barcode", "Product Labels"],
    year: "2024",
    client: "Logistics Solutions",
    image: "/gallery/stickers-1.jpg"
  },
  {
    id: 7,
    title: "Luxury Perfume Packaging",
    category: "packaging",
    description: "High-end perfume box with velvet finish and magnetic closure",
    tags: ["Packaging", "Luxury", "Perfume", "Magnetic Closure"],
    year: "2024",
    client: "Scents of Elegance",
    image: "/gallery/packaging-2.jpg"
  },
  {
    id: 8,
    title: "Embossed Letterhead Set",
    category: "specialty",
    description: "Corporate stationery with blind embossing and premium cotton paper",
    tags: ["Letterheads", "Embossing", "Stationery", "Corporate"],
    year: "2023",
    client: "Legal Associates LLP",
    image: "/gallery/letterheads-1.jpg"
  },
  {
    id: 9,
    title: "Retail Shopping Bags",
    category: "packaging",
    description: "Custom retail bags with reinforced handles and vibrant printing",
    tags: ["Packaging", "Retail", "Shopping Bags", "Vibrant Colors"],
    year: "2024",
    client: "Urban Fashion Store",
    image: "/gallery/bags-1.jpg"
  },
  {
    id: 10,
    title: "Interactive Brochure with QR",
    category: "brochures",
    description: "Interactive brochure with QR codes linking to digital content",
    tags: ["Brochures", "Interactive", "QR Code", "Digital Integration"],
    year: "2024",
    client: "Digital Marketing Agency",
    image: "/gallery/brochures-2.jpg"
  },
  {
    id: 11,
    title: "Window Decal Collection",
    category: "banners",
    description: "Perforated window decals for storefront advertising",
    tags: ["Decals", "Window", "Advertising", "Retail"],
    year: "2023",
    client: "Coffee Shop Chain",
    image: "/gallery/decals-1.jpg"
  },
  {
    id: 12,
    title: "Foiled Wedding Invitations",
    category: "specialty",
    description: "Luxury wedding invitations with rose gold foil and laser cut details",
    tags: ["Invitations", "Wedding", "Foil", "Laser Cut"],
    year: "2024",
    client: "Wedding Planners Elite",
    image: "/gallery/invitations-1.jpg"
  },
];

export async function POST(request: NextRequest) {
  try {
    const client = await clientPromise;
    const db = client.db('printingdata');
    const collection = db.collection('galleryItems');

    // Check if data already exists
    const existingCount = await collection.countDocuments();
    
    if (existingCount > 0) {
      return NextResponse.json(
        { 
          error: 'Data already exists in database. Clear existing data first.',
          count: existingCount 
        },
        { status: 400 }
      );
    }

    // Insert all items
    const result = await collection.insertMany(galleryItems);
    
    return NextResponse.json({
      success: true,
      count: result.insertedCount,
      message: `Successfully stored ${result.insertedCount} items in MongoDB`
    });

  } catch (error: any) {
    console.error('Error storing data:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to store data' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const action = searchParams.get('action');
    
    const client = await clientPromise;
    const db = client.db('printingdata');
    const collection = db.collection('galleryItems');

    if (action === 'clear') {
      const result = await collection.deleteMany({});
      
      return NextResponse.json({
        success: true,
        deletedCount: result.deletedCount,
        message: `Successfully cleared ${result.deletedCount} items from MongoDB`
      });
    }

    return NextResponse.json(
      { error: 'Invalid action' },
      { status: 400 }
    );

  } catch (error: any) {
    console.error('Error clearing data:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to clear data' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db('printingdata');
    const collection = db.collection('galleryItems');

    const count = await collection.countDocuments();
    const sampleItems = await collection.find().limit(5).toArray();

    return NextResponse.json({
      count,
      sampleItems,
      message: `Database contains ${count} gallery items`
    });

  } catch (error: any) {
    console.error('Error fetching data:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch data' },
      { status: 500 }
    );
  }
}