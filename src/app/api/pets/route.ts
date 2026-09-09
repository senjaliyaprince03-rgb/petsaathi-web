import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { createPetSchema, validateBody } from "@/lib/validation";

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const pets = await prisma.pet.findMany({
      where: { ownerId: session.user.id },
    });

    return NextResponse.json(pets);
  } catch (error) {
    console.error("GET /api/pets error:", error);
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
    const validation = validateBody(createPetSchema, body);
    if (!validation.success) {
      return NextResponse.json(
        { error: "Validation failed", details: validation.errors },
        { status: 422 }
      );
    }

    const {
      name,
      species,
      breed,
      age,
      weight,
      vaccinationStatus,
      medicalConditions,
      behaviorNotes,
      biteHistory,
      escapeHistory,
      feedingInstructions,
      walkingInstructions,
      vetContact,
    } = validation.data;

    const pet = await prisma.pet.create({
      data: {
        name,
        species,
        breed,
        age,
        weight,
        vaccinationStatus,
        medicalConditions,
        behaviorNotes,
        biteHistory,
        escapeHistory,
        feedingInstructions,
        walkingInstructions,
        vetContact,
        ownerId: session.user.id,
      },
    });

    return NextResponse.json(pet, { status: 201 });
  } catch (error) {
    console.error("POST /api/pets error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
