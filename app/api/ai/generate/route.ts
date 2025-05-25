import { NextResponse, type NextRequest } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions"; // Updated import path
import User, { type IUser } from "@/models/User"; // Import IUser type
import type {
  AiGenerateRequest,
  AiGenerateResponse,
  AiSettings,
  OllamaProviderSettings,
  OpenAiProviderSettings,
  AnthropicProviderSettings,
  VertexAiProviderSettings,
} from "@/types";
import { AI_PROVIDER } from "@/types";
import { decryptText } from "@/lib/utils/encryption"; // Added import
import connectToDatabase from "@/lib/db/mongodb"; // Ensure this is imported

import { Ollama } from "ollama";
import OpenAI from "openai";
import Anthropic from "@anthropic-ai/sdk";
import {
  VertexAI as GoogleVertexAI,
  HarmCategory,
  HarmBlockThreshold,
} from "@google-cloud/vertexai";

async function callOllamaAPI(
  settings: AiSettings,
  taskIdentifier: string,
  taskContext: Record<string, any>
): Promise<string> {
  const providerSettings = settings.providerSettings?.[AI_PROVIDER.OLLAMA] as
    | OllamaProviderSettings
    | undefined;
  if (!providerSettings?.instanceUrl) {
    throw new Error("Ollama instance URL is not configured.");
  }
  if (!settings.selectedModelId) {
    throw new Error("Ollama model not selected.");
  }

  let ollamaHost = providerSettings.instanceUrl;
  // If running inside Docker and targeting localhost, use host.docker.internal
  // This assumes the NEXT_PUBLIC_IS_DOCKERIZED env var is set to "true" in the Docker environment
  if (process.env.NEXT_PUBLIC_IS_DOCKERIZED === "true") {
    ollamaHost = ollamaHost.replace(
      /localhost|127\.0\.0\.1/g,
      "host.docker.internal"
    );
  }

  const ollama = new Ollama({ host: ollamaHost });
  const prompt = `Task: ${taskIdentifier}\nContext: ${JSON.stringify(taskContext)}\nInstructions: ${settings.customPrompt || ""}`;

  try {
    const response = await ollama.generate({
      model: settings.selectedModelId,
      prompt: prompt,
      stream: false, // For simplicity, not using stream for now
    });
    return response.response;
  } catch (error) {
    console.error("Ollama API Error:", error);
    throw new Error(
      `Ollama API request failed: ${error instanceof Error ? error.message : "Unknown error"}`
    );
  }
}

async function callOpenAIAPI(
  settings: AiSettings,
  taskIdentifier: string,
  taskContext: Record<string, any>
): Promise<string> {
  const providerSettings = settings.providerSettings?.[AI_PROVIDER.OPENAI] as
    | OpenAiProviderSettings
    | undefined;
  if (!providerSettings?.apiKey) {
    throw new Error("OpenAI API key is not configured.");
  }
  if (!settings.selectedModelId) {
    throw new Error("OpenAI model not selected.");
  }

  // Ensure the model ID doesn't have an "openai-" prefix, which can cause 404 errors.
  let modelId = settings.selectedModelId;
  if (modelId.startsWith("openai-")) {
    modelId = modelId.substring("openai-".length);
  }

  const openai = new OpenAI({
    apiKey: providerSettings.apiKey,
    organization: providerSettings.organizationId || undefined,
  });

  const prompt = `Task: ${taskIdentifier}\nContext: ${JSON.stringify(taskContext)}\nInstructions: ${settings.customPrompt || ""}`;

  try {
    const completion = await openai.chat.completions.create({
      model: modelId, // Use the potentially corrected modelId
      messages: [{ role: "user", content: prompt }],
    });
    return (
      completion.choices[0]?.message?.content ||
      "No content returned from OpenAI."
    );
  } catch (error) {
    console.error("OpenAI API Error:", error);
    throw new Error(
      `OpenAI API request failed: ${error instanceof Error ? error.message : "Unknown error"}`
    );
  }
}

async function callAnthropicAPI(
  settings: AiSettings,
  taskIdentifier: string,
  taskContext: Record<string, any>
): Promise<string> {
  const providerSettings = settings.providerSettings?.[
    AI_PROVIDER.ANTHROPIC
  ] as AnthropicProviderSettings | undefined;
  if (!providerSettings?.apiKey) {
    throw new Error("Anthropic API key is not configured.");
  }
  if (!settings.selectedModelId) {
    throw new Error("Anthropic model not selected.");
  }

  const anthropic = new Anthropic({
    apiKey: providerSettings.apiKey,
  });

  const prompt = `Task: ${taskIdentifier}\nContext: ${JSON.stringify(taskContext)}\nInstructions: ${settings.customPrompt || ""}`;

  try {
    const response = await anthropic.messages.create({
      model: settings.selectedModelId,
      max_tokens: 1024, // Example, make this configurable if needed
      messages: [{ role: "user", content: prompt }],
    });
    // Ensure response.content is an array and has at least one element of type 'text'
    if (Array.isArray(response.content) && response.content.length > 0) {
      const textContent = response.content.find(
        (block) => block.type === "text"
      );
      if (textContent && "text" in textContent) {
        return textContent.text;
      }
    }
    return "No text content returned from Anthropic.";
  } catch (error) {
    console.error("Anthropic API Error:", error);
    throw new Error(
      `Anthropic API request failed: ${error instanceof Error ? error.message : "Unknown error"}`
    );
  }
}

async function callVertexAIAPI(
  settings: AiSettings,
  taskIdentifier: string,
  taskContext: Record<string, any>
): Promise<string> {
  const providerSettings = settings.providerSettings?.[
    AI_PROVIDER.VERTEX_AI
  ] as VertexAiProviderSettings | undefined;
  if (!providerSettings?.projectId) {
    throw new Error("Vertex AI Project ID is not configured.");
  }
  if (!providerSettings?.region) {
    throw new Error("Vertex AI region is not configured.");
  }
  if (!settings.selectedModelId) {
    throw new Error("Vertex AI model not selected.");
  }

  // Enforce authentication configuration: require ADC or API key
  const hasApiKey = Boolean(
    providerSettings.apiKey || process.env.GOOGLE_API_KEY
  );
  const hasADC = Boolean(process.env.GOOGLE_APPLICATION_CREDENTIALS);
  if (!hasApiKey && !hasADC) {
    throw new Error(
      "Vertex AI authentication not configured. Please set GOOGLE_APPLICATION_CREDENTIALS or GOOGLE_API_KEY environment variable, or configure providerSettings.apiKey in AI settings."
    );
  }

  const vertexAIClient = new GoogleVertexAI({
    project: providerSettings.projectId,
    location: providerSettings.region,
    // Authentication via ADC or API key in environment (ADC preferred)
  });

  const generativeModel = vertexAIClient.getGenerativeModel({
    model: settings.selectedModelId, // e.g., 'gemini-pro'
  });

  const prompt = `Task: ${taskIdentifier}\nContext: ${JSON.stringify(taskContext)}\nInstructions: ${settings.customPrompt || ""}`;

  try {
    const result = await generativeModel.generateContent(prompt);
    const response = result.response;
    const text = response.candidates?.[0]?.content?.parts?.[0]?.text;
    return text || "No content returned from Vertex AI.";
  } catch (error) {
    console.error("Vertex AI API Error:", error);
    throw new Error(
      `Vertex AI API request failed: ${error instanceof Error ? error.message : "Unknown error"}`
    );
  }
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.id) {
      return NextResponse.json(
        { success: false, message: "User not authenticated" },
        { status: 401 }
      );
    }

    await connectToDatabase(); // Ensure DB connection
    const user = await User.findOne({ _id: session.user.id }).select(
      "aiSettings"
    );

    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    const currentAiSettings = user.aiSettings as AiSettings | undefined;

    if (!currentAiSettings || !currentAiSettings.selectedProvider) {
      return NextResponse.json(
        { success: false, message: "AI provider not configured for the user." },
        { status: 400 }
      );
    }

    // Create a mutable deep copy for decryption
    const decryptedSettings: AiSettings = JSON.parse(
      JSON.stringify(currentAiSettings)
    );

    // Decrypt API keys if present
    if (decryptedSettings.providerSettings) {
      for (const providerKeyStr of Object.keys(
        decryptedSettings.providerSettings
      )) {
        const providerKey =
          providerKeyStr as keyof typeof decryptedSettings.providerSettings;
        const providerSetting = decryptedSettings.providerSettings[
          providerKey
        ] as any; // Using any for simplicity, or use a more specific type union

        if (
          providerSetting &&
          typeof providerSetting.apiKey === "string" &&
          providerSetting.apiKey // Ensure it's not an empty string
        ) {
          try {
            providerSetting.apiKey = decryptText(providerSetting.apiKey);
          } catch (err) {
            console.error(
              `[API POST /api/ai/generate] Failed to decrypt API key for ${String(providerKey)}:`,
              err
            );
            // If decryption fails, the API key will remain encrypted or become invalid.
            // The subsequent call to the provider's API will likely fail, which is an acceptable outcome.
            // The error will be caught by the main try-catch block.
          }
        }
      }
    }

    const body: AiGenerateRequest = await request.json();
    const { taskIdentifier, taskContext } = body;

    if (!taskIdentifier || !taskContext) {
      return NextResponse.json(
        {
          success: false,
          message: "Missing taskIdentifier or taskContext in request body",
        },
        { status: 400 }
      );
    }

    let generatedContent: string;

    // Use decryptedSettings for API calls
    switch (decryptedSettings.selectedProvider) {
      case AI_PROVIDER.OLLAMA:
        generatedContent = await callOllamaAPI(
          decryptedSettings,
          taskIdentifier,
          taskContext
        );
        break;
      case AI_PROVIDER.OPENAI:
        generatedContent = await callOpenAIAPI(
          decryptedSettings,
          taskIdentifier,
          taskContext
        );
        break;
      case AI_PROVIDER.ANTHROPIC:
        generatedContent = await callAnthropicAPI(
          decryptedSettings,
          taskIdentifier,
          taskContext
        );
        break;
      case AI_PROVIDER.VERTEX_AI:
        generatedContent = await callVertexAIAPI(
          decryptedSettings,
          taskIdentifier,
          taskContext
        );
        break;
      default:
        return NextResponse.json(
          { success: false, message: "Unsupported AI provider selected." },
          { status: 400 }
        );
    }

    return NextResponse.json<AiGenerateResponse>({
      success: true,
      data: generatedContent, // Changed 'message' to 'data' and assigned generatedContent
      // Removed 'message' field
      // Retained 'provider' and 'modelId' in the debug object as per AiGenerateResponse structure
      debug: {
        resolvedSettings: {
          selectedProvider: decryptedSettings.selectedProvider,
          selectedModelId: decryptedSettings.selectedModelId,
        },
      },
    });
  } catch (error) {
    console.error("[API POST /api/ai/generate] Error:", error);
    const errorMessage =
      error instanceof Error ? error.message : "An unknown error occurred";
    return NextResponse.json<AiGenerateResponse>(
      {
        success: false,
        error: `AI Generation Error: ${errorMessage}`, // Changed 'message' to 'error'
      },
      { status: 500 }
    );
  }
}
