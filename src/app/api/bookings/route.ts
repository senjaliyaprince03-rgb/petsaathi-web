import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { createBookingSchema, validateBody } from "@/lib/validation";

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const searchParams = req.nextUrl.searchParams;
    const status = searchParams.get("status");
    const limit = searchParams.get("limit") ? parseInt(searchParams.get("limit")!) : undefined;

    const where: any = {};
    if (status) {
      where.status = status;
    }

    if (session.user.role === "PARENT") {
      where.parentId = session.user.id;
    } else if (session.user.role === "SITTER") {
      where.sitterId = session.user.id;
    } else if (session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const bookings = await prisma.booking.findMany({
      where,
      include: {
        parent: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            pets: {
              select: {
                id: true,
                name: true,
                species: true,
                breed: true,
                vetContact: true,
                behaviorNotes: true,
                walkingInstructions: true,
                feedingInstructions: true,
              },
            },
          },
        },
        sitter: {
          select: { id: true, name: true, email: true, phone: true },
        },
        payments: true,
        reports: {
          orderBy: { createdAt: "desc" },
        },
      },
      orderBy: { createdAt: "desc" },
      take: limit,
    });

    return NextResponse.json(bookings);
  } catch (error) {
    console.error("GET /api/bookings error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (session.user.role !== "PARENT" && session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Only parents can create bookings" }, { status: 403 });
    }

    const body = await req.json();
    const validation = validateBody(createBookingSchema, body);
    if (!validation.success) {
      return NextResponse.json(
        { error: "Validation failed", details: validation.errors },
        { status: 422 }
      );
    }

    const { serviceType, startDate, endDate, location, totalPrice } = validation.data;

    const referenceId = `BK-${Date.now().toString(36).toUpperCase()}-${serviceType.substring(0, 4).toUpperCase()}`;

    const booking = await prisma.booking.create({
      data: {
        referenceId,
        serviceType,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        location,
        parentId: session.user.id,
        status: "NEW_LEAD",
        totalPrice: typeof totalPrice === "number" ? totalPrice : 0,
      },
    });

    return NextResponse.json(booking, { status: 201 });
  } catch (error) {
    console.error("POST /api/bookings error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
