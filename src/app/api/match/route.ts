import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const VALID_SERVICE_TYPES = ["WALKING", "SITTING", "BOARDING"] as const;
type ValidServiceType = (typeof VALID_SERVICE_TYPES)[number];

// GET /api/match?service=WALKING&area=Bandra
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const service = searchParams.get("service");
    const area = searchParams.get("area");

    if (!service) {
      return NextResponse.json({ error: "Service parameter is required" }, { status: 400 });
    }

    if (!(VALID_SERVICE_TYPES as readonly string[]).includes(service)) {
      return NextResponse.json({ error: "Invalid service parameter" }, { status: 400 });
    }
    const validServiceType = service as ValidServiceType;

    const matchedSitters = await prisma.sitterProfile.findMany({
      where: {
        isVerified: true,
        level: {
          in: ["L2", "L3"],
        },
        approvedServices: {
          has: validServiceType,
        },
        user: {
          status: "ACTIVE",
          ...(area ? { area: { contains: area, mode: "insensitive" as const } } : {}),
        },
      },
      include: {
        user: {
          select: {
            name: true,
            area: true,
            city: true,
          },
        },
      },
      orderBy: [{ rating: "desc" }, { cancellationRate: "asc" }],
      take: 10,
    });

    return NextResponse.json({ matches: matchedSitters });
  } catch (error) {
    console.error("Match Engine Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
