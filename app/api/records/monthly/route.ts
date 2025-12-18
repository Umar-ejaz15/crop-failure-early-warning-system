
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const profileId = searchParams.get('profileId');
  if (!profileId) return NextResponse.json({ error: 'Profile ID required' }, { status: 400 });

  const records = await prisma.monthlyRecord.findMany({
    where: { profileId },
    orderBy: { monthDate: 'desc' }
  });
  return NextResponse.json({ records });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const record = await prisma.monthlyRecord.create({
      data: {
        monthDate: new Date(body.monthDate),
        growthStage: body.growthStage,
        fertilizer: body.fertilizer,
        yieldExpected: body.yieldExpected ? parseFloat(body.yieldExpected) : null,
        lossesFaced: body.lossesFaced,
        profileId: body.profileId
      }
    });
    return NextResponse.json({ record });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to save record' }, { status: 500 });
  }
}
