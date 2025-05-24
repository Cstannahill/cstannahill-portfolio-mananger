import { useState } from "react";
import type {
  AiGenerateRequest,
  AiGenerateResponse,
} from "@/types/ai-generate";

interface UseAiGeneratorReturn {
  generatedContent: AiGenerateResponse["data"] | null;
  isLoading: boolean;
  error: string | null;
  generateContent: (requestBody: AiGenerateRequest) => Promise<void>;
}

/**
 * @typescript Rule - Strict Explicit Typing
 * - All function parameters must have explicit type annotations
 * - All functions must have explicit return type annotations (never rely on inference)
 * - All variable declarations must have explicit types when not immediately obvious
 * - Never use `any` type - use `unknown`, proper unions, or define specific interfaces
 * - All object properties must be explicitly typed via interfaces or type aliases
 * - Generic types must have explicit constraints where applicable
 * - Array and Promise types must be explicitly parameterized
 * - All exported functions and classes must have complete type definitions
 * - Include JSDoc comments with @param and @returns type documentation
 */

/**
 * Custom hook to interact with the AI content generation API.
 *
 * @returns {UseAiGeneratorReturn} An object containing the generated content, loading state, error state, and a function to trigger content generation.
 */
export function useAiGenerator(): UseAiGeneratorReturn {
  const [generatedContent, setGeneratedContent] = useState<
    AiGenerateResponse["data"] | null
  >(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Fetches AI-generated content based on the provided request.
   *
   * @param {AiGenerateRequest} requestBody - The request body for the AI generation API.
   * @returns {Promise<void>} A promise that resolves when the generation is complete or an error occurs.
   */
  const generateContent = async (
    requestBody: AiGenerateRequest
  ): Promise<void> => {
    setIsLoading(true);
    setError(null);
    setGeneratedContent(null);

    try {
      const response: Response = await fetch("/api/ai/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      const result: AiGenerateResponse = await response.json();

      if (!response.ok) {
        throw new Error(
          result.error || `API request failed with status ${response.status}`
        );
      }

      if (result.success && result.data) {
        setGeneratedContent(result.data);
      } else {
        // Handle cases where success is true but data might be missing, or success is false
        setError(result.error || "Failed to generate content.");
      }
    } catch (e: unknown) {
      if (e instanceof Error) {
        setError(e.message);
      } else {
        setError("An unknown error occurred.");
      }
      console.error("Error generating AI content:", e);
    } finally {
      setIsLoading(false);
    }
  };

  return { generatedContent, isLoading, error, generateContent };
}
