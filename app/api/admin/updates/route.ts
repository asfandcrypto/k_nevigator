import { NextRequest, NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import clientPromise from '@/lib/mongodb';

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db();
    const updates = await db.collection('updates').find({}).sort({ date: -1 }).toArray();
    return NextResponse.json(updates);
  } catch (error) {
    console.error('Error fetching updates:', error);
    return NextResponse.json({ error: 'Failed to fetch updates' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const client = await clientPromise;
    const db = client.db();
    const data = await request.json();

    // Validate required fields
    const requiredFields = ['title', 'description', 'date', 'type', 'priority'];
    for (const field of requiredFields) {
      if (!data[field]) {
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }

    const result = await db.collection('updates').insertOne({
      ...data,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    return NextResponse.json({ 
      success: true, 
      id: result.insertedId,
      message: 'Update added successfully' 
    });
  } catch (error) {
    console.error('Error adding update:', error);
    return NextResponse.json({ error: 'Failed to add update' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const client = await clientPromise;
    const db = client.db();
    const data = await request.json();

    if (!data._id) {
      return NextResponse.json({ error: 'Update ID is required' }, { status: 400 });
    }

    const result = await db.collection('updates').updateOne(
      { _id: new ObjectId(data._id) },
      { 
        $set: {
          ...data,
          updatedAt: new Date()
        }
      }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: 'Update not found' }, { status: 404 });
    }

    return NextResponse.json({ 
      success: true,
      message: 'Update modified successfully' 
    });
  } catch (error) {
    console.error('Error updating update:', error);
    return NextResponse.json({ error: 'Failed to modify update' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Update ID is required' }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db();

    const result = await db.collection('updates').deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: 'Update not found' }, { status: 404 });
    }

    return NextResponse.json({ 
      success: true,
      message: 'Update deleted successfully' 
    });
  } catch (error) {
    console.error('Error deleting update:', error);
    return NextResponse.json({ error: 'Failed to delete update' }, { status: 500 });
  }
}