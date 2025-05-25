import { NextResponse, type NextRequest } from "next/server";
import type { AiModel } from "@/types";
import { AI_PROVIDER } from "@/types"; // Ensure AI_PROVIDER is imported

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const { searchParams } = new URL(request.url);
    const providerParam = searchParams.get("provider");

    console.log(`[API /ai/models] Received providerParam: '${providerParam}'`);

    if (!providerParam) {
      return NextResponse.json(
        { message: "Provider query parameter is required" },
        { status: 400 }
      );
    }

    // Normalize provider to lowercase and trim whitespace
    const normalizedProvider = providerParam.trim().toLowerCase();

    console.log(
      `[API /ai/models] Normalized provider: '${normalizedProvider}'`
    );
    console.log(
      `[API /ai/models] AI_PROVIDER.OLLAMA enum value: '${AI_PROVIDER.OLLAMA}'`
    );
    console.log(
      `[API /ai/models] Comparing normalizedProvider with AI_PROVIDER.OLLAMA: ${normalizedProvider === AI_PROVIDER.OLLAMA}`
    );

    const enumValues = Object.values(AI_PROVIDER);
    console.log(
      `[API /ai/models] Values from Object.values(AI_PROVIDER): ${JSON.stringify(
        enumValues
      )}`
    );

    const isValidProvider = enumValues.includes(
      normalizedProvider as AI_PROVIDER
    );
    console.log(
      `[API /ai/models] Is normalizedProvider ('${normalizedProvider}') in enumValues? ${isValidProvider}`
    );

    if (!isValidProvider) {
      console.error(
        `[API /ai/models] Validation failed: Provider '${normalizedProvider}' not in enum values ${JSON.stringify(
          enumValues
        )}. Original param: '${providerParam}'`
      );
      return NextResponse.json(
        { message: `Invalid provider: ${providerParam}` },
        { status: 400 }
      );
    }

    const typedProvider = normalizedProvider as AI_PROVIDER;
    let models: AiModel[] = [];

    // Mock data - in a real application, this would fetch from a database or external APIs
    switch (typedProvider) {
      case AI_PROVIDER.OLLAMA:
        models = [
          {
            id: "ollama-llama3-8b-instruct",
            name: "Llama 3 8B Instruct (Ollama)",
            provider: AI_PROVIDER.OLLAMA,
            capabilities: ["text-generation", "chat"],
            inputTypes: ["text"],
            outputTypes: ["text"],
          },
          {
            id: "ollama-llama3-70b-instruct",
            name: "Llama 3 70B Instruct (Ollama)",
            provider: AI_PROVIDER.OLLAMA,
            capabilities: ["text-generation", "chat"],
            inputTypes: ["text"],
            outputTypes: ["text"],
          },
          {
            id: "ollama-mistral-7b-instruct",
            name: "Mistral 7B Instruct (Ollama)",
            provider: AI_PROVIDER.OLLAMA,
            capabilities: ["text-generation", "chat"],
            inputTypes: ["text"],
            outputTypes: ["text"],
          },
          {
            id: "ollama-mixtral-8x7b-instruct",
            name: "Mixtral 8x7B Instruct (Ollama)",
            provider: AI_PROVIDER.OLLAMA,
            capabilities: ["text-generation", "chat"],
            inputTypes: ["text"],
            outputTypes: ["text"],
          },
          {
            id: "ollama-codellama-7b-instruct",
            name: "CodeLlama 7B Instruct (Ollama)",
            provider: AI_PROVIDER.OLLAMA,
            capabilities: ["text-generation", "chat", "coding"],
            inputTypes: ["text"],
            outputTypes: ["text"],
          },
          {
            id: "ollama-codellama-13b-instruct",
            name: "CodeLlama 13B Instruct (Ollama)",
            provider: AI_PROVIDER.OLLAMA,
            capabilities: ["text-generation", "chat", "coding"],
            inputTypes: ["text"],
            outputTypes: ["text"],
          },
          {
            id: "ollama-deepseek-coder-6.7b-instruct",
            name: "DeepSeek Coder 6.7B Instruct (Ollama)",
            provider: AI_PROVIDER.OLLAMA,
            capabilities: ["text-generation", "chat", "coding"],
            inputTypes: ["text"],
            outputTypes: ["text"],
          },
          {
            id: "ollama-phi3-medium-4k-instruct",
            name: "Phi-3 Medium 4k Instruct (Ollama)",
            provider: AI_PROVIDER.OLLAMA,
            capabilities: ["text-generation", "chat"],
            inputTypes: ["text"],
            outputTypes: ["text"],
          },
          {
            id: "ollama-qwen-7b-chat",
            name: "Qwen 7B Chat (Ollama)",
            provider: AI_PROVIDER.OLLAMA,
            capabilities: ["text-generation", "chat"],
            inputTypes: ["text"],
            outputTypes: ["text"],
          },
          {
            id: "gemma3",
            name: "Gemma 7B Instruct (Ollama)",
            provider: AI_PROVIDER.OLLAMA,
            capabilities: ["text-generation", "chat"],
            inputTypes: ["text"],
            outputTypes: ["text"],
          },
          {
            id: "phi4",
            name: "Phi-4 (Ollama)",
            provider: AI_PROVIDER.OLLAMA,
            capabilities: ["text-generation", "chat", "coding"],
            inputTypes: ["text"],
            outputTypes: ["text"],
          },
          {
            id: "phi4-reasoning",
            name: "Phi-4 Reasoning (Ollama)",
            provider: AI_PROVIDER.OLLAMA,
            capabilities: ["text-generation", "chat", "coding", "reasoning"],
            inputTypes: ["text"],
            outputTypes: ["text"],
          },
          {
            id: "llama4",
            name: "Llama 4 (Ollama)",
            provider: AI_PROVIDER.OLLAMA,
            capabilities: [
              "text-generation",
              "chat",
              "vision",
              "coding",
              "reasoning",
            ],
            inputTypes: ["text", "image"],
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
            id: "openai-gpt-4o-mini",
            name: "GPT-4o mini (OpenAI)",
            provider: AI_PROVIDER.OPENAI,
            capabilities: ["text-generation", "chat", "vision"], // Assuming similar capabilities to gpt-4o
            inputTypes: ["text", "image"], // Assuming similar capabilities to gpt-4o
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
        // This case should ideally not be reached if validation is correct
        console.warn(
          `[API /ai/models] Reached default case in switch for provider: ${typedProvider}`
        );
        models = [];
        break;
    }

    return NextResponse.json({ data: models }, { status: 200 });
  } catch (error) {
    console.error("[API /ai/models] Error fetching AI models:", error);
    const errorMessage =
      error instanceof Error ? error.message : "An unknown error occurred";
    return NextResponse.json(
      { message: "Failed to fetch AI models", error: errorMessage },
      { status: 500 }
    );
  }
}
