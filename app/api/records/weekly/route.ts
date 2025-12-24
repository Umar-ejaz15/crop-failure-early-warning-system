
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const profileId = searchParams.get('profileId');
  if (!profileId) return NextResponse.json({ error: 'Profile ID required' }, { status: 400 });

  const records = await prisma.weeklyRecord.findMany({
    where: { profileId },
    orderBy: { date: 'desc' }
  });
  
  // Parse JSON strings back to objects
  const parsedRecords = records.map((r: any) => ({
    ...r,
    alerts: JSON.parse(r.alerts),
    suggestions: JSON.parse(r.suggestions)
  }));

  return NextResponse.json({ records: parsedRecords });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const record = await prisma.weeklyRecord.create({
      data: {
        date: new Date(body.date),
        rainfall: body.rainfall,
        irrigation: body.irrigation,
        cropCondition: body.cropCondition,
        pestSeen: body.pestSeen,
        notes: body.notes,
        avgTemp: body.avgTemp,
        ndviScore: body.ndviScore,
        riskScore: body.riskScore,
        riskLevel: body.riskLevel,
        alerts: JSON.stringify(body.alerts),
        suggestions: JSON.stringify(body.suggestions),
        profileId: body.profileId,
        responses: body.responses,
        cropType: body.cropType
      }
    });
    return NextResponse.json({ record });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to save record' }, { status: 500 });
  }
}
