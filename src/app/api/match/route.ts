import type { NextRequest} from "next/server";
import { NextResponse } from "next/server";
import { PrismaClient, ServiceType } from "@prisma/client";

const prisma = new PrismaClient();

// GET /api/match?service=WALKING&area=Bandra
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const service = searchParams.get("service");
    const area = searchParams.get("area");

    if (!service) {
      return NextResponse.json({ error: "Service parameter is required" }, { status: 400 });
    }

    // Phase 3 Automated Matching Logic:
    // Only return Sitters who are L2 or L3 (Verified), support the requested service,
    // and ideally are in the same area.
    
    if (!Object.values(ServiceType).includes(service as ServiceType)) {
      return NextResponse.json({ error: "Invalid service parameter" }, { status: 400 });
    }
    const validServiceType = service as ServiceType;

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
          // If area is provided, prioritize it
          ...(area ? { area: { contains: area, mode: "insensitive" } } : {}),
        }
      },
      include: {
        user: {
          select: {
            name: true,
            area: true,
            city: true,
          }
        }
      },
      orderBy: [
        { rating: 'desc' },
        { cancellationRate: 'asc' }
      ],
      take: 10 // Top 10 matches
    });

    return NextResponse.json({ matches: matchedSitters });
  } catch (error) {
    console.error("Match Engine Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
