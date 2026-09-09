import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { sendSitterAssignedEmail } from "@/lib/email";
import { updateBookingSchema, validateBody } from "@/lib/validation";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    const booking = await prisma.booking.findUnique({
      where: { id },
      include: {
        payments: true,
        reports: true,
        reviews: true,
        incidents: true,
        parent: {
          select: { id: true, name: true, email: true, phone: true },
        },
        sitter: {
          select: { id: true, name: true, email: true, phone: true },
        },
      },
    });

    if (!booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    if (
      session.user.role !== "ADMIN" &&
      booking.parentId !== session.user.id &&
      booking.sitterId !== session.user.id
    ) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    return NextResponse.json(booking);
  } catch (error) {
    console.error("GET /api/bookings/[id] error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    const booking = await prisma.booking.findUnique({
      where: { id },
    });

    if (!booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    const body = await req.json();
    const validation = validateBody(updateBookingSchema, body);
    if (!validation.success) {
      return NextResponse.json(
        { error: "Validation failed", details: validation.errors },
        { status: 422 }
      );
    }

    const { status, sitterId, totalPrice, sitterPayout } = validation.data;

    let updateData: any = {};

    if (session.user.role === "ADMIN") {
      updateData = { status, sitterId, totalPrice, sitterPayout };
    } else if (session.user.role === "PARENT") {
      if (booking.parentId !== session.user.id) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
      }
      if (status === "CANCELLED") {
        updateData.status = "CANCELLED";
      } else {
        return NextResponse.json(
          { error: "Parents can only cancel bookings" },
          { status: 400 }
        );
      }
    } else if (session.user.role === "SITTER") {
      if (booking.sitterId !== session.user.id) {
        return NextResponse.json({ error: "Forbidden: Not assigned to this booking" }, { status: 403 });
      }
      if (status === "SERVICE_STARTED") {
        updateData.status = "SERVICE_STARTED";
      } else {
        return NextResponse.json(
          { error: "Sitters can only update status to SERVICE_STARTED" },
          { status: 400 }
        );
      }
    } else {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const updatedBooking = await prisma.booking.update({
      where: { id },
      data: updateData,
      include: {
        parent: { select: { name: true, email: true } },
        sitter: { select: { name: true, email: true } },
      },
    });

    // If a sitter was newly assigned or updated to SITTER_ASSIGNED, send email notification
    if (
      sitterId &&
      (status === "SITTER_ASSIGNED" || updatedBooking.status === "SITTER_ASSIGNED") &&
      updatedBooking.parent?.email &&
      updatedBooking.sitter?.name
    ) {
      sendSitterAssignedEmail({
        to: updatedBooking.parent.email,
        customerName: updatedBooking.parent.name || "Customer",
        sitterName: updatedBooking.sitter.name,
        referenceId: updatedBooking.referenceId || updatedBooking.id.substring(0, 8),
      }).catch((err) =>
        console.error("Error triggering sitter assigned email:", err)
      );
    }

    return NextResponse.json(updatedBooking);
  } catch (error) {
    console.error("PATCH /api/bookings/[id] error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
