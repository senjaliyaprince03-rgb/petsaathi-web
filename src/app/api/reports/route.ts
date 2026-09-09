import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { sendServiceReportEmail } from "@/lib/email";
import { createReportSchema, validateBody } from "@/lib/validation";

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const where: any = {};

    if (session.user.role === "PARENT") {
      where.booking = { parentId: session.user.id };
    } else if (session.user.role === "SITTER") {
      where.booking = { sitterId: session.user.id };
    } else if (session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const reports = await prisma.report.findMany({
      where,
      include: {
        booking: {
          include: {
            parent: {
              select: { id: true, name: true, email: true },
            },
            sitter: {
              select: { id: true, name: true, email: true },
            },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(reports);
  } catch (error) {
    console.error("GET /api/reports error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const validation = validateBody(createReportSchema, body);
    if (!validation.success) {
      return NextResponse.json(
        { error: "Validation failed", details: validation.errors },
        { status: 422 }
      );
    }

    const {
      bookingId,
      foodAndWater,
      toiletInfo,
      mood,
      behavior,
      healthConcern,
      sitterNote,
      actualStartTime,
      actualEndTime,
      distance,
    } = validation.data;

    // Verify booking and permissions
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: {
        parent: {
          include: {
            pets: true,
          },
        },
        sitter: {
          select: { id: true, name: true, email: true },
        },
      },
    });

    if (!booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    // User must be the assigned sitter or admin
    if (session.user.role !== "ADMIN" && booking.sitterId !== session.user.id) {
      return NextResponse.json(
        { error: "Forbidden: You must be the assigned sitter to file this report" },
        { status: 403 }
      );
    }

    // Create Report
    const report = await prisma.report.create({
      data: {
        bookingId: booking.id,
        foodAndWater: foodAndWater || null,
        toiletInfo: toiletInfo || null,
        mood: mood || null,
        behavior: behavior || null,
        healthConcern: healthConcern || null,
        sitterNote: sitterNote || null,
        actualStartTime: actualStartTime ? new Date(actualStartTime) : null,
        actualEndTime: actualEndTime ? new Date(actualEndTime) : new Date(),
        distance:
          typeof distance === "number"
            ? distance
            : distance
            ? parseFloat(distance)
            : null,
      },
    });

    // Update Booking status to SERVICE_COMPLETED
    await prisma.booking.update({
      where: { id: booking.id },
      data: {
        status: "SERVICE_COMPLETED",
      },
    });

    // Send email notification to parent asynchronously
    if (booking.parent?.email) {
      const petName =
        booking.parent.pets?.[0]?.name || "your pet";
      const summaryLines = [
        `Service: ${booking.serviceType}`,
        `Mood: ${mood || "Happy & Calm"}`,
        `Bathroom: ${toiletInfo || "Normal"}`,
        distance ? `Distance Walked: ${distance} km` : null,
        sitterNote ? `Sitter's Note: "${sitterNote}"` : null,
      ]
        .filter(Boolean)
        .join("\n");

      sendServiceReportEmail({
        to: booking.parent.email,
        customerName: booking.parent.name || "Pet Parent",
        petName,
        reportSummary: summaryLines,
      }).catch((err) =>
        console.error("Error triggering service report email:", err)
      );
    }

    return NextResponse.json(report, { status: 201 });
  } catch (error) {
    console.error("POST /api/reports error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
