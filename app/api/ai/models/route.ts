import { NextResponse, type NextRequest } from "next/server";
import type { AiModel } from "@/types";
import { AI_PROVIDER } from "@/types"; // Ensure AI_PROVIDER is imported

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const { searchParams } = new URL(request.url);
    const providerParam = searchParams.get("provider");

    if (!providerParam) {
      return NextResponse.json(
        { message: "Provider query parameter is required" },
        { status: 400 }
      );
    }

    const provider = providerParam.toUpperCase() as AI_PROVIDER;

    // Validate if the provider is a valid enum key
    if (!Object.values(AI_PROVIDER).includes(provider)) {
      return NextResponse.json(
        { message: `Invalid provider: ${providerParam}` },
        { status: 400 }
      );
    }

    let models: AiModel[] = [];

    // Mock data - in a real application, this would fetch from a database or external APIs
    switch (provider) {
      case AI_PROVIDER.OLLAMA:
        models = [
          {
            id: "ollama-llama3-8b",
            name: "Llama 3 8B (Ollama)",
            provider: AI_PROVIDER.OLLAMA,
            capabilities: ["text-generation", "chat"],
            inputTypes: ["text"],
            outputTypes: ["text"],
          },
          {
            id: "ollama-mistral-7b",
            name: "Mistral 7B (Ollama)",
            provider: AI_PROVIDER.OLLAMA,
            capabilities: ["text-generation", "chat"],
            inputTypes: ["text"],
            outputTypes: ["text"],
          },
        ];
        break;
      case AI_PROVIDER.OPENAI:
        models = [
          {
            id: "openai-gpt-4-turbo",
            name: "GPT-4 Turbo (OpenAI)",
            provider: AI_PROVIDER.OPENAI,
            capabilities: ["text-generation", "chat", "vision"],
            inputTypes: ["text", "image"],
            outputTypes: ["text"],
          },
          {
            id: "openai-gpt-3.5-turbo",
            name: "GPT-3.5 Turbo (OpenAI)",
            provider: AI_PROVIDER.OPENAI,
            capabilities: ["text-generation", "chat"],
            inputTypes: ["text"],
            outputTypes: ["text"],
          },
        ];
        break;
      case AI_PROVIDER.ANTHROPIC:
        models = [
          {
            id: "anthropic-claude-3-opus",
            name: "Claude 3 Opus (Anthropic)",
            provider: AI_PROVIDER.ANTHROPIC,
            capabilities: ["text-generation", "chat", "vision"],
            inputTypes: ["text", "image"],
            outputTypes: ["text"],
          },
          {
            id: "anthropic-claude-3-sonnet",
            name: "Claude 3 Sonnet (Anthropic)",
            provider: AI_PROVIDER.ANTHROPIC,
            capabilities: ["text-generation", "chat", "vision"],
            inputTypes: ["text", "image"],
            outputTypes: ["text"],
          },
          {
            id: "anthropic-claude-3-haiku",
            name: "Claude 3 Haiku (Anthropic)",
            provider: AI_PROVIDER.ANTHROPIC,
            capabilities: ["text-generation", "chat", "vision"],
            inputTypes: ["text", "image"],
            outputTypes: ["text"],
          },
        ];
        break;
      case AI_PROVIDER.VERTEX_AI:
        models = [
          {
            id: "vertex-gemini-1.5-pro",
            name: "Gemini 1.5 Pro (Vertex AI)",
            provider: AI_PROVIDER.VERTEX_AI,
            capabilities: ["text-generation", "chat", "vision"],
            inputTypes: ["text", "image", "video", "audio"],
            outputTypes: ["text"],
          },
          {
            id: "vertex-gemini-1.0-pro",
            name: "Gemini 1.0 Pro (Vertex AI)",
            provider: AI_PROVIDER.VERTEX_AI,
            capabilities: ["text-generation", "chat", "vision"],
            inputTypes: ["text", "image"],
            outputTypes: ["text"],
          },
        ];
        break;
      default:
        // Should be caught by earlier validation, but as a fallback:
        models = [];
        break;
    }

    return NextResponse.json({ data: models }, { status: 200 });
  } catch (error) {
    console.error("Error fetching AI models:", error);
    const errorMessage =
      error instanceof Error ? error.message : "An unknown error occurred";
    return NextResponse.json(
      { message: "Failed to fetch AI models", error: errorMessage },
      { status: 500 }
    );
  }
}
