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

  const ollama = new Ollama({ host: providerSettings.instanceUrl });
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

  const openai = new OpenAI({
    apiKey: providerSettings.apiKey,
    organization: providerSettings.organizationId || undefined,
  });

  const prompt = `Task: ${taskIdentifier}\nContext: ${JSON.stringify(taskContext)}\nInstructions: ${settings.customPrompt || ""}`;

  try {
    const completion = await openai.chat.completions.create({
      model: settings.selectedModelId,
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

  // Log authentication method
  if (providerSettings.apiKey) {
    console.warn(
      "[Vertex AI] API Key is configured in settings, but the Node.js SDK primarily uses ADC (GOOGLE_APPLICATION_CREDENTIALS) or service accounts. Ensure your environment is set up accordingly if using API keys directly is intended and supported for this model/endpoint."
    );
    // Note: The current GoogleVertexAI constructor does not directly accept an API key.
    // If direct API key usage is required, the SDK interaction might need to be via a REST call
    // or a different client library setup. For now, we proceed assuming ADC.
  } else if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
    console.log(
      "[Vertex AI] Authenticating using GOOGLE_APPLICATION_CREDENTIALS environment variable."
    );
  } else {
    console.warn(
      "[Vertex AI] GOOGLE_APPLICATION_CREDENTIALS environment variable not set, and no API key provided in settings. SDK will attempt to find credentials via other methods (e.g., gcloud CLI, metadata server)."
    );
  }

  const vertexAIClient = new GoogleVertexAI({
    project: providerSettings.projectId,
    location: providerSettings.region,
    // The SDK does not directly take an API key in the constructor for generative models.
    // It relies on Application Default Credentials (ADC).
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
        {
          success: false,
          error: "User not authenticated",
          data: undefined,
          debug: undefined,
        } as AiGenerateResponse,
        { status: 401 }
      );
    }

    const user = await User.findById(session.user.id)
      .select("aiSettings")
      .lean<IUser>(); // Added type assertion for lean()

    if (!user || !user.aiSettings) {
      return NextResponse.json(
        {
          success: false,
          error:
            "AI settings not configured. Please configure your AI assistant first.",
          data: undefined,
          debug: undefined,
        } as AiGenerateResponse,
        { status: 400 }
      );
    }

    const aiSettings = user.aiSettings as AiSettings;

    if (!aiSettings.selectedProvider || !aiSettings.selectedModelId) {
      return NextResponse.json(
        {
          success: false,
          error:
            "AI provider or model not selected in settings. Please update your AI configuration.",
          data: undefined,
          debug: undefined,
        } as AiGenerateResponse,
        { status: 400 }
      );
    }

    const body: AiGenerateRequest = await request.json();
    const { taskIdentifier, taskContext } = body;

    if (!taskIdentifier || !taskContext) {
      return NextResponse.json(
        {
          success: false,
          error: "taskIdentifier and taskContext are required.",
          data: undefined,
          debug: undefined,
        } as AiGenerateResponse,
        { status: 400 }
      );
    }

    let generatedData: string;
    let providerError: Error | null = null;

    try {
      switch (aiSettings.selectedProvider) {
        case AI_PROVIDER.OLLAMA:
          generatedData = await callOllamaAPI(
            aiSettings,
            taskIdentifier,
            taskContext
          );
          break;
        case AI_PROVIDER.OPENAI:
          generatedData = await callOpenAIAPI(
            aiSettings,
            taskIdentifier,
            taskContext
          );
          break;
        case AI_PROVIDER.ANTHROPIC:
          generatedData = await callAnthropicAPI(
            aiSettings,
            taskIdentifier,
            taskContext
          );
          break;
        case AI_PROVIDER.VERTEX_AI:
          generatedData = await callVertexAIAPI(
            aiSettings,
            taskIdentifier,
            taskContext
          );
          break;
        default:
          return NextResponse.json(
            {
              success: false,
              error: "Unsupported AI provider.",
              data: undefined,
              debug: undefined,
            } as AiGenerateResponse,
            { status: 400 }
          );
      }
    } catch (err) {
      providerError = err instanceof Error ? err : new Error(String(err));
      console.error(
        `Error calling ${aiSettings.selectedProvider} API:`,
        providerError
      );
      generatedData = ""; // Ensure generatedData is defined
    }

    if (providerError) {
      return NextResponse.json(
        {
          success: false,
          error: `Failed to generate content using ${aiSettings.selectedProvider}: ${providerError.message}`,
          data: undefined,
          debug: {
            rawResponse: providerError.message,
            resolvedSettings: aiSettings,
          },
        } as AiGenerateResponse,
        { status: 500 }
      );
    }

    const successResponse: AiGenerateResponse = {
      success: true,
      data: generatedData,
      debug: { resolvedSettings: aiSettings },
    };
    return NextResponse.json(successResponse, { status: 200 });
  } catch (error) {
    console.error("Error in AI generation route:", error);
    const errorMessage =
      error instanceof Error ? error.message : "An unknown error occurred";
    return NextResponse.json(
      {
        success: false,
        error: "Failed to generate content due to an unexpected error",
        data: undefined,
        debug: { rawResponse: errorMessage },
      } as AiGenerateResponse,
      { status: 500 }
    );
  }
}
