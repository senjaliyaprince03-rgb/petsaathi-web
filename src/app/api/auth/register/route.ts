import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";
import { Role } from "@prisma/client";
import { registerSchema, validateBody } from "@/lib/validation";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validation = validateBody(registerSchema, body);
    if (!validation.success) {
      return NextResponse.json(
        { error: "Validation failed", details: validation.errors },
        { status: 422 }
      );
    }

    const { name, email, password, phone, role } = validation.data;
    const normalizedEmail = email.trim().toLowerCase();

    // Check if user with email already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "User already exists with this email" },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Determine role (default PARENT, allow SITTER, prevent ADMIN self-assignment)
    const assignedRole: Role = role === "SITTER" ? Role.SITTER : Role.PARENT;

    // Create user in Prisma
    const user = await prisma.user.create({
      data: {
        name: name.trim(),
        email: normalizedEmail,
        password: hashedPassword,
        phone: phone ? String(phone).trim() : null,
        role: assignedRole,
        status: "ACTIVE",
      },
    });

    // If role === 'SITTER', create default SitterProfile
    if (assignedRole === Role.SITTER) {
      await prisma.sitterProfile.create({
        data: {
          userId: user.id,
          bio: "",
          level: "L1",
          approvedServices: [],
          baseRate: 0,
          isVerified: false,
          rating: 5.0,
          cancellationRate: 0,
        },
      });
    }

    return NextResponse.json(
      {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST /api/auth/register error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
