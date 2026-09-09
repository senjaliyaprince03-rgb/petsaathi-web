import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const [
      totalBookings,
      pendingBookings,
      activeBookings,
      completedBookings,
      paidPayments,
      totalSitters,
      verifiedSitters,
      totalPets,
      totalUsers,
      sittersToAssign,
    ] = await Promise.all([
      prisma.booking.count(),
      prisma.booking.count({
        where: {
          status: {
            in: ["NEW_LEAD", "CONTACTED", "PET_DETAILS_PENDING", "SITTER_MATCHING"],
          },
        },
      }),
      prisma.booking.count({
        where: {
          status: {
            in: ["CONFIRMED", "SERVICE_STARTED"],
          },
        },
      }),
      prisma.booking.count({
        where: {
          status: {
            in: ["SERVICE_COMPLETED", "REPORT_SENT", "REVIEW_REQUESTED", "CLOSED"],
          },
        },
      }),
      prisma.payment.aggregate({
        where: { status: "PAID" },
        _sum: { amount: true },
      }),
      prisma.sitterProfile.count(),
      prisma.sitterProfile.count({
        where: { isVerified: true },
      }),
      prisma.pet.count(),
      prisma.user.count(),
      prisma.booking.count({
        where: {
          sitterId: null,
          status: {
            notIn: ["CANCELLED", "REFUNDED", "CLOSED", "SERVICE_COMPLETED"],
          },
        },
      }),
    ]);

    return NextResponse.json({
      totalBookings,
      pendingBookings,
      activeBookings,
      completedBookings,
      totalRevenue: paidPayments._sum.amount || 0,
      totalSitters,
      verifiedSitters,
      totalPets,
      totalUsers,
      sittersToAssign,
    });
  } catch (error) {
    console.error("GET /api/admin/analytics error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
