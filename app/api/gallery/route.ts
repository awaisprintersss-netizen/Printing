import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export async function GET() {
  try {
    console.log('Starting gallery data fetch...');
    
    const client = await clientPromise;
    console.log('MongoDB client connected');
    
    const db = client.db('printingdata');
    const collection = db.collection('galleryItems');
    
    console.log('Attempting to find gallery items...');
    const items = await collection.find({}).toArray();
    console.log(`Found ${items.length} gallery items`);
    
    // Format the response
    const formattedItems = items.map(item => ({
      id: item.id || item._id.toString(),
      title: item.title,
      category: item.category,
      description: item.description,
      tags: item.tags,
      year: item.year,
      client: item.client,
      image: item.image
    }));
    
    return NextResponse.json({
      success: true,
      items: formattedItems,
      count: formattedItems.length
    });
    
  } catch (error: any) {
    console.error('Error fetching gallery data:', error);
    
    let errorMessage = error.message || 'Failed to fetch gallery data';
    if (error.name === 'MongoServerSelectionError' || error.name === 'MongoNetworkError') {
      errorMessage = 'Database connection error. Please ensure your IP is whitelisted in MongoDB Atlas and check your connection.';
    }

    return NextResponse.json(
      { 
        success: false, 
        error: errorMessage,
        details: error.name,
        stack: error.stack,
        items: [],
        count: 0
      },
      { status: 500 }
    );
  }
}

export const dynamic = 'force-dynamic';

