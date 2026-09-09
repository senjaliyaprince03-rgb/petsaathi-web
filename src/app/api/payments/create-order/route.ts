import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import Razorpay from "razorpay";
import { createPaymentOrderSchema, validateBody } from "@/lib/validation";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (session.user.role !== "PARENT" && session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await req.json();
    const validation = validateBody(createPaymentOrderSchema, body);
    if (!validation.success) {
      return NextResponse.json(
        { error: "Validation failed", details: validation.errors },
        { status: 422 }
      );
    }

    const { bookingId, amount } = validation.data;
    const numAmount = amount;

    // Fetch booking and ensure it exists and belongs to user (or user is admin)
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
    });

    if (!booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    if (booking.parentId !== session.user.id && session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden: Not your booking" }, { status: 403 });
    }

    const keyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "";
    const keySecret = process.env.RAZORPAY_KEY_SECRET || "";

    let order: { id: string; amount: number; currency: string };

    try {
      if (keyId && keySecret) {
        const razorpay = new Razorpay({
          key_id: keyId,
          key_secret: keySecret,
        });

        // Razorpay receipt limit is 40 chars
        const receipt = (booking.referenceId || booking.id).substring(0, 40);

        const rzpOrder = await razorpay.orders.create({
          amount: Math.round(numAmount * 100), // amount in paise
          currency: "INR",
          receipt,
        });

        order = {
          id: rzpOrder.id,
          amount: Number(rzpOrder.amount),
          currency: rzpOrder.currency || "INR",
        };
      } else {
        throw new Error("Razorpay credentials not provided");
      }
    } catch (rzpError) {
      console.warn("Razorpay API order creation failed or unavailable, using mock order:", rzpError);
      order = {
        id: `order_mock_${Date.now()}`,
        amount: Math.round(numAmount * 100),
        currency: "INR",
      };
    }

    // Create or update Payment record in Prisma for this booking
    const existingPayment = await prisma.payment.findFirst({
      where: { bookingId: booking.id },
      orderBy: { createdAt: "desc" },
    });

    if (existingPayment) {
      await prisma.payment.update({
        where: { id: existingPayment.id },
        data: {
          amount: numAmount,
          paymentLinkId: order.id,
          status: "PENDING",
        },
      });
    } else {
      await prisma.payment.create({
        data: {
          bookingId: booking.id,
          amount: numAmount,
          paymentLinkId: order.id,
          status: "PENDING",
        },
      });
    }

    // Update booking totalPrice if necessary
    await prisma.booking.update({
      where: { id: booking.id },
      data: {
        totalPrice: numAmount,
      },
    });

    return NextResponse.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId,
    });
  } catch (error) {
    console.error("POST /api/payments/create-order error:", error);
    return NextResponse.json(
      { error: "Internal server error creating payment order" },
      { status: 500 }
    );
  }
}
