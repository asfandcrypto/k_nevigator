import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export async function GET(req: NextRequest) {
  try {
    const client = await clientPromise;
    const db = client.db();

    // Get query parameters for filtering
    const url = new URL(req.url);
    const type = url.searchParams.get('type');
    const building = url.searchParams.get('building');
    const floor = url.searchParams.get('floor');
    const search = url.searchParams.get('search');

    // Build filter object based on query parameters
    const filter: any = {};
    if (type) filter.type = type;
    if (building) filter.building = building;
    if (floor) filter.floor = floor;
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { occupant: { $regex: search, $options: 'i' } }
      ];
    }

    // Get locations data from MongoDB
    const locations = await db.collection('locations').find(filter).toArray();

    return NextResponse.json(locations);
  } catch (error) {
    console.error('Error fetching locations:', error);
    return NextResponse.json(
      { error: 'Failed to fetch locations data' },
      { status: 500 }
    );
  }
}