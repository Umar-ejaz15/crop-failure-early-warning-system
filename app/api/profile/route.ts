import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../lib/prisma';
import { auth, currentUser } from '@clerk/nextjs/server';

export async function GET(request: NextRequest) {
  try {
    const authData = await auth();
    const userId = authData.userId;
    
    if (!userId) {
        console.error("Profile API: No userId found in session");
        return NextResponse.json({ error: 'Unauthorized - Please login' }, { status: 401 });
    }

    let profile = await prisma.farmProfile.findUnique({
      where: { userId }
    });

    if (!profile) {
        const user = await currentUser();
        // Use name if possible, otherwise primary email or username
        const name = user?.firstName 
            ? `${user.firstName} ${user.lastName || ''}`.trim() 
            : user?.username 
            || user?.emailAddresses[0]?.emailAddress?.split('@')[0] 
            || 'New Farmer';

        try {
            profile = await prisma.farmProfile.create({
                data: {
                    userId,
                    farmerName: name,
                    location: 'Not Specified',
                }
            });
        } catch (createError: any) {
            // Handle race condition if profile was created between find and create
            if (createError.code === 'P2002') {
                profile = await prisma.farmProfile.findUnique({ where: { userId } });
            } else {
                throw createError;
            }
        }
    }

    return NextResponse.json({ profile });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to fetch profile' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await request.json();
    
    const profile = await prisma.farmProfile.upsert({
      where: { userId },
      update: {
        farmerName: body.farmerName,
        location: body.location,
        fieldSize: body.fieldSize ? parseFloat(body.fieldSize) : undefined,
        sowingDate: body.sowingDate ? new Date(body.sowingDate) : undefined,
      },
      create: {
        userId,
        farmerName: body.farmerName || 'Farmer',
        location: body.location,
        fieldSize: body.fieldSize ? parseFloat(body.fieldSize) : undefined,
        sowingDate: body.sowingDate ? new Date(body.sowingDate) : undefined,
      }
    });
    
    return NextResponse.json({ profile });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to save profile' }, { status: 500 });
  }
}
