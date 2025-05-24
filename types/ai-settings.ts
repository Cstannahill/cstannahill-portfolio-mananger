/**
 * @file types/ai-settings.ts
 * @description Defines types related to AI provider and model settings.
 */

/**
 * @enum AI_PROVIDER
 * @description Enum for supported AI providers.
 */
export enum AI_PROVIDER {
  OLLAMA = "ollama",
  OPENAI = "openai",
  ANTHROPIC = "anthropic",
  VERTEX_AI = "vertex_ai", // Google
}

/**
 * @interface AiModel
 * @description Interface for an AI model.
 * @property {string} id - The unique identifier for the model.
 * @property {string} name - The display name of the model.
 * @property {AI_PROVIDER} provider - The provider of the model.
 * @property {string[]} capabilities - List of capabilities (e.g., 'text-generation', 'image-generation').
 * @property {string[]} [inputTypes] - The types of inputs the model accepts (e.g., 'text', 'image').
 * @property {string[]} [outputTypes] - The types of outputs the model produces (e.g., 'text', 'json').
 * @property {number} [maxTokens] - Maximum number of tokens the model can handle.
 * @property {object} [pricing] - Pricing information (structure may vary by provider).
 */
export interface AiModel {
  id: string;
  name: string;
  provider: AI_PROVIDER;
  capabilities: string[];
  inputTypes?: string[]; // Added: e.g., ["text", "image"]
  outputTypes?: string[]; // Added: e.g., ["text", "json"]
  maxTokens?: number;
  pricing?: object; // Consider defining a more specific pricing type if needed
}

/**
 * @interface OllamaProviderSettings
 * @description Specific settings for the Ollama provider.
 */
export interface OllamaProviderSettings {
  instanceUrl?: string; // e.g., http://localhost:11434
}

/**
 * @interface OpenAiProviderSettings
 * @description Specific settings for the OpenAI provider.
 */
export interface OpenAiProviderSettings {
  apiKey?: string;
  organizationId?: string; // Optional
}

/**
 * @interface AnthropicProviderSettings
 * @description Specific settings for the Anthropic provider.
 */
export interface AnthropicProviderSettings {
  apiKey?: string;
}

/**
 * @interface VertexAiProviderSettings
 * @description Specific settings for the Vertex AI provider.
 */
export interface VertexAiProviderSettings {
  apiKey?: string; // Or path to service account key JSON
  projectId?: string;
  region?: string; // e.g., us-central1
}

/**
 * @interface AiSettings
 * @description Interface for user-specific AI settings.
 * @property {AI_PROVIDER} selectedProvider - The AI provider selected by the user.
 * @property {string} selectedModelId - The ID of the AI model selected by the user.
 * @property {string} customPrompt - Custom prompt or instructions provided by the user.
 * @property {object} [providerSettings] - Provider-specific settings (e.g., API keys, region for Vertex AI).
 */
export interface AiSettings {
  selectedProvider: AI_PROVIDER;
  selectedModelId: string;
  customPrompt: string;
  providerSettings?: {
    [AI_PROVIDER.OLLAMA]?: OllamaProviderSettings;
    [AI_PROVIDER.OPENAI]?: OpenAiProviderSettings;
    [AI_PROVIDER.ANTHROPIC]?: AnthropicProviderSettings;
    [AI_PROVIDER.VERTEX_AI]?: VertexAiProviderSettings;
  };
}

/**
 * @interface OllamaModel
 * @extends AiModel
 * @description Interface for Ollama specific models.
 * @property {string} family - Model family.
 */
export interface OllamaModel extends AiModel {
  provider: AI_PROVIDER.OLLAMA;
  family: string;
}

/**
 * @interface OpenAiModel
 * @extends AiModel
 * @description Interface for OpenAI specific models.
 */
export interface OpenAiModel extends AiModel {
  provider: AI_PROVIDER.OPENAI;
}

/**
 * @interface AnthropicModel
 * @extends AiModel
 * @description Interface for Anthropic specific models.
 */
export interface AnthropicModel extends AiModel {
  provider: AI_PROVIDER.ANTHROPIC;
}

/**
 * @interface VertexAiModel
 * @extends AiModel
 * @description Interface for Vertex AI (Google) specific models.
 * @property {string} region - The Google Cloud region where the model is hosted.
 */
export interface VertexAiModel extends AiModel {
  provider: AI_PROVIDER.VERTEX_AI;
  region?: string; // Example: 'us-central1'
}
