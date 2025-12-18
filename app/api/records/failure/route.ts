
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const profileId = searchParams.get('profileId');
  if (!profileId) return NextResponse.json({ error: 'Profile ID required' }, { status: 400 });

  const records = await prisma.failureRecord.findMany({
    where: { profileId },
    orderBy: { date: 'desc' }
  });
  return NextResponse.json({ records });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const record = await prisma.failureRecord.create({
      data: {
        date: new Date(body.date),
        failureType: body.failureType,
        lossPercentage: parseFloat(body.lossPercentage),
        notes: body.notes,
        profileId: body.profileId
      }
    });
    return NextResponse.json({ record });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to save record' }, { status: 500 });
  }
}
