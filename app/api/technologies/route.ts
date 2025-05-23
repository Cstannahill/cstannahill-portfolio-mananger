import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import dbConnect from "@/lib/db/mongodb";
import Technology from "@/models/Technology";

const TechnologySchema = z.object({
  name: z.string().min(1, "Technology name is required"),
  color: z.string().nullable().optional(),
});

export async function GET() {
  await dbConnect();
  const technologies = await Technology.find().sort({ name: 1 });
  return NextResponse.json(technologies);
}

export async function POST(req: NextRequest) {
  await dbConnect();
  try {
    const body = await req.json();
    const parsed = TechnologySchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { message: parsed.error.message },
        { status: 400 }
      );
    }
    const { name, color } = parsed.data;
    // Check for existing technology
    const existing = await Technology.findOne({ name });
    if (existing) {
      return NextResponse.json(
        { message: "Technology already exists" },
        { status: 409 }
      );
    }
    const technology = await Technology.create({ name, color: color ?? null });
    return NextResponse.json(technology, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { message: (error as Error).message },
      { status: 500 }
    );
  }
}
