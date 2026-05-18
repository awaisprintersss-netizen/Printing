import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import { GalleryFormData } from '@/types/gallery';
import { uploadToCloudinary, deleteFromCloudinary, isBase64 } from '@/lib/cloudinary';

export async function GET(request: NextRequest) {
  try {
    const client = await clientPromise;
    const db = client.db('printingdata');
    const collection = db.collection('galleryItems');
    
    const items = await collection.find({}).sort({ id: 1 }).toArray();
    
    return NextResponse.json({
      success: true,
      items: items.map(item => ({
        _id: item._id.toString(),
        id: item.id,
        title: item.title,
        category: item.category,
        description: item.description,
        tags: item.tags,
        year: item.year,
        client: item.client,
        image: item.image,
        imagePublicId: item.imagePublicId || null,
        createdAt: item.createdAt,
        updatedAt: item.updatedAt
      })),
      count: items.length
    });
    
  } catch (error: any) {
    console.error('Error fetching gallery data:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch gallery data' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const data: GalleryFormData & { imageFile?: string } = await request.json();
    
    // Validate required fields
    if (!data.title || !data.category || !data.description || !data.client) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    const client = await clientPromise;
    const db = client.db('printingdata');
    const collection = db.collection('galleryItems');
    
    // Get the next ID
    const lastItem = await collection.find().sort({ id: -1 }).limit(1).toArray();
    const nextId = lastItem.length > 0 ? lastItem[0].id + 1 : 1;
    
    let imageUrl = data.image || '/gallery/placeholder.jpg';
    let imagePublicId = null;
    
    // If there's a base64 image file, upload to Cloudinary
    if (data.imageFile && isBase64(data.imageFile)) {
      try {
        const cloudinaryResult = await uploadToCloudinary(data.imageFile, 'printing-gallery');
        imageUrl = cloudinaryResult.secure_url;
        imagePublicId = cloudinaryResult.public_id;
      } catch (uploadError) {
        console.error('Cloudinary upload failed:', uploadError);
        // Continue with the provided image URL if upload fails
      }
    }
    
    const newItem = {
      id: nextId,
      title: data.title,
      category: data.category,
      description: data.description,
      tags: data.tags || [],
      year: data.year || new Date().getFullYear().toString(),
      client: data.client,
      image: imageUrl,
      imagePublicId: imagePublicId,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    const result = await collection.insertOne(newItem);
    
    return NextResponse.json({
      success: true,
      item: { _id: result.insertedId.toString(), ...newItem },
      message: 'Gallery item created successfully'
    });
    
  } catch (error: any) {
    console.error('Error creating gallery item:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to create gallery item' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const data = await request.json();
    
    if (!data._id) {
      return NextResponse.json(
        { success: false, error: 'Item ID is required' },
        { status: 400 }
      );
    }
    
    const client = await clientPromise;
    const db = client.db('printingdata');
    const collection = db.collection('galleryItems');
    
    // Get existing item to check for image deletion
    const existingItem = await collection.findOne({ _id: new ObjectId(data._id) });
    
    let imageUrl = data.image;
    let imagePublicId = data.imagePublicId;
    
    // Handle image upload if there's a new base64 image
    if (data.imageFile && isBase64(data.imageFile)) {
      try {
        // Delete old image from Cloudinary if exists
        if (existingItem?.imagePublicId) {
          await deleteFromCloudinary(existingItem.imagePublicId).catch(err => 
            console.error('Error deleting old image:', err)
          );
        }
        
        // Upload new image
        const cloudinaryResult = await uploadToCloudinary(data.imageFile, 'printing-gallery');
        imageUrl = cloudinaryResult.secure_url;
        imagePublicId = cloudinaryResult.public_id;
      } catch (uploadError) {
        console.error('Cloudinary upload failed:', uploadError);
        // Keep existing image if upload fails
        imageUrl = existingItem?.image;
        imagePublicId = existingItem?.imagePublicId;
      }
    }
    
    // Remove _id and imageFile from update data
    const { _id, imageFile, ...updateData } = data;
    updateData.image = imageUrl;
    updateData.imagePublicId = imagePublicId;
    updateData.updatedAt = new Date();
    
    const result = await collection.updateOne(
      { _id: new ObjectId(_id) },
      { $set: updateData }
    );
    
    if (result.matchedCount === 0) {
      return NextResponse.json(
        { success: false, error: 'Item not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      message: 'Gallery item updated successfully'
    });
    
  } catch (error: any) {
    console.error('Error updating gallery item:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to update gallery item' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Item ID is required' },
        { status: 400 }
      );
    }
    
    const client = await clientPromise;
    const db = client.db('printingdata');
    const collection = db.collection('galleryItems');
    
    // Get item first to delete image from Cloudinary
    const item = await collection.findOne({ _id: new ObjectId(id) });
    
    // Delete image from Cloudinary if exists
    if (item?.imagePublicId) {
      await deleteFromCloudinary(item.imagePublicId).catch(err => 
        console.error('Error deleting image from Cloudinary:', err)
      );
    }
    
    const result = await collection.deleteOne({
      _id: new ObjectId(id)
    });
    
    if (result.deletedCount === 0) {
      return NextResponse.json(
        { success: false, error: 'Item not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      message: 'Gallery item deleted successfully'
    });
    
  } catch (error: any) {
    console.error('Error deleting gallery item:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to delete gallery item' },
      { status: 500 }
    );
  }
}