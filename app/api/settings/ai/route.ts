import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions"; // Updated import path
import User from "@/models/User"; // Updated import to default
import type { AiSettings } from "@/types";
import { ApiResponseSuccess, ApiResponseError } from "@/lib/api/response";
import { z } from "zod";
import { AI_PROVIDER } from "@/types/ai-settings";
import connectToDatabase from "@/lib/db/mongodb"; // Added import

// Define individual provider settings schemas
const ollamaProviderSettingsSchema = z.object({
  instanceUrl: z
    .string()
    .url({
      message: "Ollama Instance URL must be a valid URL if provided.",
    })
    .or(z.literal(""))
    .optional(),
});

const openAiProviderSettingsSchema = z.object({
  apiKey: z.string().or(z.literal("")).optional(),
  organizationId: z.string().or(z.literal("")).optional(),
});

const anthropicProviderSettingsSchema = z.object({
  apiKey: z.string().or(z.literal("")).optional(),
});

const vertexAiProviderSettingsSchema = z.object({
  apiKey: z.string().or(z.literal("")).optional(), // Can be a complex key string
  projectId: z.string().or(z.literal("")).optional(),
  region: z.string().or(z.literal("")).optional(),
});

const aiSettingsSchema = z.object({
  selectedProvider: z.nativeEnum(AI_PROVIDER).optional(),
  selectedModelId: z.string().or(z.literal("")).optional(),
  customPrompt: z.string().or(z.literal("")).optional(),
  providerSettings: z
    .object({
      [AI_PROVIDER.OLLAMA]: ollamaProviderSettingsSchema.optional(),
      [AI_PROVIDER.OPENAI]: openAiProviderSettingsSchema.optional(),
      [AI_PROVIDER.ANTHROPIC]: anthropicProviderSettingsSchema.optional(),
      [AI_PROVIDER.VERTEX_AI]: vertexAiProviderSettingsSchema.optional(),
    })
    .optional(), // The entire providerSettings object is optional
});

/**
 * @route GET /api/settings/ai
 * @description Get the current user's AI settings.
 * @access Private
 */
export async function GET(req: NextRequest): Promise<NextResponse> {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return ApiResponseError("User not authenticated", 401, "UNAUTHORIZED");
    }

    await connectToDatabase();
    const user = await User.findOne({ email: session.user.email }).select(
      "aiSettings"
    );

    if (!user) {
      return ApiResponseError("User not found", 404, "NOT_FOUND");
    }

    return ApiResponseSuccess(
      user.aiSettings || {},
      200,
      "AI settings retrieved successfully"
    );
  } catch (error) {
    console.error("[API GET /api/settings/ai] Error:", error);
    if (error instanceof z.ZodError) {
      return ApiResponseError(
        "Invalid request parameters",
        400,
        "VALIDATION_ERROR",
        error.errors
      );
    }
    return ApiResponseError(
      "Failed to retrieve AI settings",
      500,
      "INTERNAL_SERVER_ERROR"
    );
  }
}

/**
 * @route PUT /api/settings/ai
 * @description Update the current user's AI settings.
 * @access Private
 */
export async function PUT(req: NextRequest): Promise<NextResponse> {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return ApiResponseError("User not authenticated", 401, "UNAUTHORIZED");
    }

    const body = await req.json();
    const validatedSettings = aiSettingsSchema.parse(body);

    await connectToDatabase();

    const user = await User.findOneAndUpdate(
      { email: session.user.email },
      { $set: { aiSettings: validatedSettings } },
      {
        new: true,
        upsert: true,
        runValidators: true,
        setDefaultsOnInsert: true,
      }
    ).select("aiSettings");

    if (!user) {
      return ApiResponseError(
        "User not found during update attempt",
        404,
        "NOT_FOUND"
      );
    }

    return ApiResponseSuccess(
      user.aiSettings,
      200,
      "AI settings updated successfully"
    );
  } catch (error) {
    console.error("[API PUT /api/settings/ai] Error:", error);
    if (error instanceof z.ZodError) {
      return ApiResponseError(
        "Invalid request parameters",
        400,
        "VALIDATION_ERROR",
        error.errors
      );
    }
    return ApiResponseError(
      "Failed to update AI settings",
      500,
      "INTERNAL_SERVER_ERROR"
    );
  }
}
