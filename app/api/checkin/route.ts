import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const { checkIn, assessment, suggestions } = await request.json();

    // Save weather first
    const weather = await prisma.weather.create({
      data: {
        avgTemp: checkIn.weatherConditions.avgTemp,
        rainfall: checkIn.weatherConditions.rainfall,
        humidity: checkIn.weatherConditions.humidity,
      },
    });

    // Save check-in
    const savedCheckIn = await prisma.checkIn.create({
      data: {
        farmerId: checkIn.farmerId || 'default', // Assuming default for now
        cropType: checkIn.cropType,
        currentStage: checkIn.currentStage,
        date: new Date(checkIn.date),
        responses: checkIn.responses,
        weatherId: weather.id,
        riskScore: assessment.overallRisk,
        alerts: assessment.alerts || [],
        suggestions: suggestions || '',
      },
      include: {
        weather: true,
      },
    });

    return NextResponse.json(savedCheckIn);
  } catch (error) {
    console.error('Error saving check-in:', error);
    return NextResponse.json({ error: 'Failed to save check-in' }, { status: 500 });
  }
}

export async function GET() {
  try {
    const checkIns = await prisma.checkIn.findMany({
      include: {
        weather: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(checkIns);
  } catch (error) {
    console.error('Error fetching check-ins:', error);
    return NextResponse.json({ error: 'Failed to fetch check-ins' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { id } = await request.json();

    await prisma.checkIn.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting check-in:', error);
    return NextResponse.json({ error: 'Failed to delete check-in' }, { status: 500 });
  }
}