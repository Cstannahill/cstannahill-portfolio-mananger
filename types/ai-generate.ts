import type { AiSettings } from "./ai-settings";

/**
 * @interface AiGenerateRequest
 * @description Defines the structure for a request to the AI generation endpoint.
 */
export interface AiGenerateRequest {
  /**
   * A unique identifier for the type of task the AI should perform.
   * Examples: "blog.post.title", "project.summary.from_content", "code.explain.typescript"
   */
  taskIdentifier: string;

  /**
   * Contextual data required for the AI to perform the specified task.
   * The structure of this object will vary depending on the taskIdentifier.
   * For example, for "blog.post.title", it might include { currentContent: "...", topic: "..." }.
   */
  taskContext: Record<string, any>;
}

/**
 * @interface AiGenerateResponse
 * @description Defines the structure for a response from the AI generation endpoint.
 */
export interface AiGenerateResponse {
  /**
   * Indicates whether the AI generation was successful.
   */
  success: boolean;

  /**
   * The generated content or structured data from the AI.
   * This can be a simple string (e.g., a generated title) or a more complex object.
   */
  data?: string | Record<string, any>;

  /**
   * An error message if the generation failed.
   */
  error?: string;

  /**
   * Optional debugging information, which might include the resolved AI settings,
   * the payload sent to the AI, and the raw response from the AI.
   * This should typically only be populated in development or debugging modes.
   */
  debug?: {
    resolvedSettings: Partial<AiSettings>;
    requestPayload?: any;
    rawResponse?: any;
  };
}
