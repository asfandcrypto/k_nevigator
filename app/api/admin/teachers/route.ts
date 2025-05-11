import { NextRequest, NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import clientPromise from '@/lib/mongodb';

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db();
    const teachers = await db.collection('teachers').find({}).toArray();
    return NextResponse.json(teachers);
  } catch (error) {
    console.error('Error fetching teachers:', error);
    return NextResponse.json({ error: 'Failed to fetch teachers' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const client = await clientPromise;
    const db = client.db();
    const data = await request.json();

    // Validate required fields
    const requiredFields = ['name', 'designation', 'department', 'subjects', 'email', 'office', 'officeHours'];
    for (const field of requiredFields) {
      if (!data[field]) {
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }

    // Ensure subjects is an array
    if (!Array.isArray(data.subjects)) {
      data.subjects = [data.subjects];
    }

    // Check if a teacher with the same email already exists
    const existingTeacher = await db.collection('teachers').findOne({ email: data.email });
    if (existingTeacher) {
      return NextResponse.json(
        { error: 'A teacher with this email already exists' },
        { status: 400 }
      );
    }

    const result = await db.collection('teachers').insertOne({
      ...data,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    return NextResponse.json({ 
      success: true, 
      id: result.insertedId,
      message: 'Teacher added successfully' 
    });
  } catch (error) {
    console.error('Error adding teacher:', error);
    return NextResponse.json({ error: 'Failed to add teacher' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const client = await clientPromise;
    const db = client.db();
    const data = await request.json();

    if (!data._id) {
      return NextResponse.json({ error: 'Teacher ID is required' }, { status: 400 });
    }

    // Ensure subjects is an array
    if (!Array.isArray(data.subjects)) {
      data.subjects = [data.subjects];
    }

    const result = await db.collection('teachers').updateOne(
      { _id: new ObjectId(data._id) },
      { 
        $set: {
          ...data,
          updatedAt: new Date()
        }
      }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: 'Teacher not found' }, { status: 404 });
    }

    return NextResponse.json({ 
      success: true,
      message: 'Teacher updated successfully' 
    });
  } catch (error) {
    console.error('Error updating teacher:', error);
    return NextResponse.json({ error: 'Failed to update teacher' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Teacher ID is required' }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db();

    const result = await db.collection('teachers').deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: 'Teacher not found' }, { status: 404 });
    }

    return NextResponse.json({ 
      success: true,
      message: 'Teacher deleted successfully' 
    });
  } catch (error) {
    console.error('Error deleting teacher:', error);
    return NextResponse.json({ error: 'Failed to delete teacher' }, { status: 500 });
  }
}