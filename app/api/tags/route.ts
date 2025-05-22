import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import dbConnect from "@/lib/db/mongodb";
import Tag from "@/models/Tag";

const TagSchema = z.object({
  name: z.string().min(1, "Tag name is required"),
  color: z.string().nullable().optional(),
});

export async function GET() {
  await dbConnect();
  const tags = await Tag.find().sort({ name: 1 });
  return NextResponse.json(tags);
}

export async function POST(req: NextRequest) {
  await dbConnect();
  try {
    const body = await req.json();
    const parsed = TagSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { message: parsed.error.message },
        { status: 400 }
      );
    }
    const { name, color } = parsed.data;
    // Check for existing tag
    const existing = await Tag.findOne({ name });
    if (existing) {
      return NextResponse.json(
        { message: "Tag already exists" },
        { status: 409 }
      );
    }
    const tag = await Tag.create({ name, color: color ?? null });
    return NextResponse.json(tag, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { message: (error as Error).message },
      { status: 500 }
    );
  }
}
