import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");
    if (!file || typeof file === "string") {
      return NextResponse.json(
        { status: "error", message: "No file uploaded" },
        { status: 400 }
      );
    }
    const buffer = Buffer.from(await file.arrayBuffer());
    const fileName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.\-_]/g, "")}`;
    const uploadDir = path.join(process.cwd(), "public", "images", "projects");
    await fs.mkdir(uploadDir, { recursive: true });
    const filePath = path.join(uploadDir, fileName);
    await fs.writeFile(filePath, buffer);
    const fileUrl = `/images/projects/${fileName}`;
    return NextResponse.json({ status: "success", url: fileUrl });
  } catch (error) {
    console.error("File upload error:", error);
    return NextResponse.json(
      {
        status: "error",
        message: "File upload failed",
        error: (error as Error).message,
      },
      { status: 500 }
    );
  }
}
