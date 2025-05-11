import { NextRequest, NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import clientPromise from '@/lib/mongodb';

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db();
    const locations = await db.collection('locations').find({}).toArray();
    return NextResponse.json(locations);
  } catch (error) {
    console.error('Error fetching locations:', error);
    return NextResponse.json({ error: 'Failed to fetch locations' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const client = await clientPromise;
    const db = client.db();
    const data = await request.json();
    
    // Validate required fields
    const requiredFields = ['name', 'building', 'floor', 'type'];
    for (const field of requiredFields) {
      if (!data[field]) {
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }
    
    // Additional validation based on location type
    if (data.type === 'classroom' || data.type === 'lab') {
      if (!data.capacity) {
        return NextResponse.json(
          { error: 'Capacity is required for classrooms and labs' },
          { status: 400 }
        );
      }
    } else if (data.type === 'office' && !data.occupant) {
      return NextResponse.json(
        { error: 'Occupant is required for offices' },
        { status: 400 }
      );
    }
    
    // Insert location into MongoDB
    const result = await db.collection('locations').insertOne({
      ...data,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    
    return NextResponse.json({ 
      success: true, 
      id: result.insertedId,
      message: 'Location created successfully' 
    });
  } catch (error) {
    console.error('Error creating location:', error);
    return NextResponse.json(
      { error: 'Failed to create location' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const client = await clientPromise;
    const db = client.db();
    const data = await request.json();

    if (!data._id) {
      return NextResponse.json({ error: 'Location ID is required' }, { status: 400 });
    }

    const result = await db.collection('locations').updateOne(
      { _id: new ObjectId(data._id) },
      { 
        $set: {
          ...data,
          updatedAt: new Date()
        }
      }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: 'Location not found' }, { status: 404 });
    }

    return NextResponse.json({ 
      success: true,
      message: 'Location updated successfully' 
    });
  } catch (error) {
    console.error('Error updating location:', error);
    return NextResponse.json({ error: 'Failed to update location' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Location ID is required' }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db();

    const result = await db.collection('locations').deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: 'Location not found' }, { status: 404 });
    }

    return NextResponse.json({ 
      success: true,
      message: 'Location deleted successfully' 
    });
  } catch (error) {
    console.error('Error deleting location:', error);
    return NextResponse.json({ error: 'Failed to delete location' }, { status: 500 });
  }
}