import { NextRequest, NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import clientPromise from '@/lib/mongodb';

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db();
    const timetable = await db.collection('timetable').find({}).toArray();
    return NextResponse.json(timetable);
  } catch (error) {
    console.error('Error fetching timetable:', error);
    return NextResponse.json({ error: 'Failed to fetch timetable' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const client = await clientPromise;
    const db = client.db();
    const data = await request.json();

    // Validate required fields
    const requiredFields = ['course', 'title', 'day', 'time', 'room', 'teacher', 'semester'];
    for (const field of requiredFields) {
      if (!data[field]) {
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }

    const result = await db.collection('timetable').insertOne({
      ...data,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    return NextResponse.json({ 
      success: true, 
      id: result.insertedId,
      message: 'Timetable entry added successfully' 
    });
  } catch (error) {
    console.error('Error adding timetable entry:', error);
    return NextResponse.json({ error: 'Failed to add timetable entry' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const client = await clientPromise;
    const db = client.db();
    const data = await request.json();

    if (!data._id) {
      return NextResponse.json({ error: 'Timetable entry ID is required' }, { status: 400 });
    }

    const result = await db.collection('timetable').updateOne(
      { _id: new ObjectId(data._id) },
      { 
        $set: {
          ...data,
          updatedAt: new Date()
        }
      }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: 'Timetable entry not found' }, { status: 404 });
    }

    return NextResponse.json({ 
      success: true,
      message: 'Timetable entry updated successfully' 
    });
  } catch (error) {
    console.error('Error updating timetable entry:', error);
    return NextResponse.json({ error: 'Failed to update timetable entry' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Timetable entry ID is required' }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db();

    const result = await db.collection('timetable').deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: 'Timetable entry not found' }, { status: 404 });
    }

    return NextResponse.json({ 
      success: true,
      message: 'Timetable entry deleted successfully' 
    });
  } catch (error) {
    console.error('Error deleting timetable entry:', error);
    return NextResponse.json({ error: 'Failed to delete timetable entry' }, { status: 500 });
  }
}