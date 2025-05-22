import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";
import connectToDatabase from "@/lib/db/mongodb";
import User from "@/models/User";

export async function POST(request: NextRequest) {
  try {
    await connectToDatabase();

    const { name, email, password } = await request.json();

    // Validate inputs
    if (!name || !email || !password) {
      return NextResponse.json(
        {
          status: "error",
          message: "Missing required fields: name, email, and password",
        },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        {
          status: "error",
          message: "User with this email already exists",
        },
        { status: 409 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create new user
    // For the first user in the system, assign the admin role
    const isFirstUser = (await User.countDocuments({})) === 0;

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: isFirstUser ? "admin" : "viewer",
    });

    // Return user (excluding password)
    const { password: _, ...userWithoutPassword } = user.toObject();

    return NextResponse.json(
      {
        status: "success",
        message: "User created successfully",
        data: userWithoutPassword,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating user:", error);
    return NextResponse.json(
      {
        status: "error",
        message: "Failed to create user",
        error: (error as Error).message,
      },
      { status: 500 }
    );
  }
}
