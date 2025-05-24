import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import { ApiResponseSuccess, ApiResponseError } from "@/lib/api/response";

// Ensure the upload directory exists
const UPLOAD_DIR = path.join(
  process.cwd(),
  "public",
  "uploads",
  "projects_temp"
);

const ensureUploadDirExists = async (): Promise<void> => {
  try {
    await mkdir(UPLOAD_DIR, { recursive: true });
  } catch (error: any) {
    if (error.code !== "EEXIST") {
      console.error("Failed to create upload directory:", error);
      throw new Error("Failed to create upload directory.");
    }
  }
};

export async function POST(request: NextRequest): Promise<NextResponse> {
  await ensureUploadDirExists();

  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return ApiResponseError("No file uploaded.", 400);
    }

    // Basic validation (can be expanded)
    if (!file.type.startsWith("image/")) {
      return ApiResponseError(
        "Invalid file type. Only images are allowed.",
        400
      );
    }

    // Max file size (e.g., 5MB)
    const MAX_FILE_SIZE = 5 * 1024 * 1024;
    if (file.size > MAX_FILE_SIZE) {
      return ApiResponseError(
        `File too large. Max size is ${MAX_FILE_SIZE / (1024 * 1024)}MB.`,
        400
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Generate a unique filename
    const fileExtension = path.extname(file.name);
    const uniqueFilename = `${uuidv4()}${fileExtension}`;
    const filePath = path.join(UPLOAD_DIR, uniqueFilename);

    await writeFile(filePath, buffer);

    const publicUrl = `/uploads/projects_temp/${uniqueFilename}`;

    return ApiResponseSuccess(
      { url: publicUrl }, // data
      201, // status
      "File uploaded successfully." // message
    );
  } catch (error) {
    console.error("Upload error:", error);
    const errorMessage =
      error instanceof Error
        ? error.message
        : "An unknown error occurred during upload.";
    return ApiResponseError(`Upload failed: ${errorMessage}`, 500);
  }
}
