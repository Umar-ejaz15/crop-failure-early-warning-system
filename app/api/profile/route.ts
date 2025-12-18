
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../lib/prisma';

export async function GET() {
  try {
    // For MVP transparency, just get the first profile or the most recently updated one
    const profile = await prisma.farmProfile.findFirst({
      orderBy: { updatedAt: 'desc' }
    });
    return NextResponse.json({ profile });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch profile' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Check if profile exists, if so update it, else create
    let profile = await prisma.farmProfile.findFirst();
    
    if (profile) {
      profile = await prisma.farmProfile.update({
        where: { id: profile.id },
        data: {
          farmerName: body.farmerName,
          location: body.location,
          cropType: body.cropType,
          fieldSize: parseFloat(body.fieldSize),
          sowingDate: new Date(body.sowingDate),
        }
      });
    } else {
      profile = await prisma.farmProfile.create({
        data: {
          farmerName: body.farmerName,
          location: body.location,
          cropType: body.cropType,
          fieldSize: parseFloat(body.fieldSize),
          sowingDate: new Date(body.sowingDate),
        }
      });
    }
    
    return NextResponse.json({ profile });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to save profile' }, { status: 500 });
  }
}
