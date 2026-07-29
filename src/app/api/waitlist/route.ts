import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email || typeof email !== "string") {
      return NextResponse.json({ error: "Invalid email" }, { status: 400 });
    }

    // In a real scenario, we would use Prisma to save this to the DB:
    // await prisma.lead.create({ data: { email } })

    return NextResponse.json({ success: true, message: "Added to waitlist" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to process request" }, { status: 500 });
  }
}
