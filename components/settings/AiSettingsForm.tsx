import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  AI_PROVIDER,
  type AiSettings,
  type AiModel,
  type OllamaProviderSettings,
  type OpenAiProviderSettings,
  type AnthropicProviderSettings,
  type VertexAiProviderSettings,
} from "@/types";

interface AiSettingsFormProps {
  settings: Partial<AiSettings>;
  availableModels: AiModel[]; // This would be populated based on selected provider
  onSettingsChange: (newSettings: Partial<AiSettings>) => void;
  onSubmit: () => void;
  loading: boolean;
  error?: string | null;
}

/**
 * @component ASForm
 * @description Form for configuring AI settings.
 */
const ASForm: React.FC<AiSettingsFormProps> = ({
  settings,
  availableModels,
  onSettingsChange,
  onSubmit,
  loading,
  error,
}) => {
  const handleProviderChange = (value: string): void => {
    onSettingsChange({
      ...settings,
      selectedProvider: value as AI_PROVIDER,
      selectedModelId: undefined, // Reset model when provider changes
    });
  };

  const handleModelChange = (value: string): void => {
    onSettingsChange({ ...settings, selectedModelId: value });
  };

  const handlePromptChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ): void => {
    onSettingsChange({ ...settings, customPrompt: event.target.value });
  };

  const handleProviderSettingChange = (
    provider: AI_PROVIDER,
    key: string,
    value: string
  ): void => {
    onSettingsChange({
      ...settings,
      providerSettings: {
        ...settings.providerSettings,
        [provider]: {
          ...(settings.providerSettings?.[provider] || {}), // Ensure the provider object exists
          [key]: value,
        },
      },
    });
  };

  const renderProviderSpecificFields = (): JSX.Element | null => {
    if (!settings.selectedProvider) return null;

    // Helper to get typed provider settings
    const getTypedProviderSettings = <T,>(
      providerKey: AI_PROVIDER
    ): Partial<T> | undefined => {
      return settings.providerSettings?.[providerKey] as Partial<T> | undefined;
    };

    switch (settings.selectedProvider) {
      case AI_PROVIDER.OLLAMA:
        const ollamaSettings = getTypedProviderSettings<OllamaProviderSettings>(
          AI_PROVIDER.OLLAMA
        );
        return (
          <div className="space-y-2 pt-4 border-t mt-4">
            <h4 className="text-md font-semibold">Ollama Settings</h4>
            <Label htmlFor="ollama-instance-url">Instance URL</Label>
            <Input
              id="ollama-instance-url"
              placeholder="http://localhost:11434"
              value={ollamaSettings?.instanceUrl || ""}
              onChange={(e) =>
                handleProviderSettingChange(
                  AI_PROVIDER.OLLAMA,
                  "instanceUrl",
                  e.target.value
                )
              }
              disabled={loading}
            />
            <p className="text-sm text-muted-foreground">
              The URL of your Ollama instance (e.g., http://localhost:11434).
            </p>
          </div>
        );
      case AI_PROVIDER.OPENAI:
        const openAiSettings = getTypedProviderSettings<OpenAiProviderSettings>(
          AI_PROVIDER.OPENAI
        );
        return (
          <div className="space-y-2 pt-4 border-t mt-4">
            <h4 className="text-md font-semibold">OpenAI Settings</h4>
            <Label htmlFor="openai-api-key">API Key</Label>
            <Input
              id="openai-api-key"
              type="password"
              placeholder="sk-..."
              value={openAiSettings?.apiKey || ""}
              onChange={(e) =>
                handleProviderSettingChange(
                  AI_PROVIDER.OPENAI,
                  "apiKey",
                  e.target.value
                )
              }
              disabled={loading}
            />
            <Label htmlFor="openai-org-id">Organization ID (Optional)</Label>
            <Input
              id="openai-org-id"
              placeholder="org-..."
              value={openAiSettings?.organizationId || ""}
              onChange={(e) =>
                handleProviderSettingChange(
                  AI_PROVIDER.OPENAI,
                  "organizationId",
                  e.target.value
                )
              }
              disabled={loading}
            />
          </div>
        );
      case AI_PROVIDER.ANTHROPIC:
        const anthropicSettings =
          getTypedProviderSettings<AnthropicProviderSettings>(
            AI_PROVIDER.ANTHROPIC
          );
        return (
          <div className="space-y-2 pt-4 border-t mt-4">
            <h4 className="text-md font-semibold">Anthropic Settings</h4>
            <Label htmlFor="anthropic-api-key">API Key</Label>
            <Input
              id="anthropic-api-key"
              type="password"
              placeholder="sk-ant-..."
              value={anthropicSettings?.apiKey || ""}
              onChange={(e) =>
                handleProviderSettingChange(
                  AI_PROVIDER.ANTHROPIC,
                  "apiKey",
                  e.target.value
                )
              }
              disabled={loading}
            />
          </div>
        );
      case AI_PROVIDER.VERTEX_AI:
        const vertexSettings =
          getTypedProviderSettings<VertexAiProviderSettings>(
            AI_PROVIDER.VERTEX_AI
          );
        return (
          <div className="space-y-2 pt-4 border-t mt-4">
            <h4 className="text-md font-semibold">
              Vertex AI (Google) Settings
            </h4>
            <Label htmlFor="vertex-api-key">
              API Key / Service Account JSON Path
            </Label>
            <Input // Consider if this should be a textarea for JSON key
              id="vertex-api-key"
              type="password" // Or text if it\'s a path
              placeholder="Path to service_account.json or API Key"
              value={vertexSettings?.apiKey || ""}
              onChange={(e) =>
                handleProviderSettingChange(
                  AI_PROVIDER.VERTEX_AI,
                  "apiKey",
                  e.target.value
                )
              }
              disabled={loading}
            />
            <Label htmlFor="vertex-project-id">Project ID</Label>
            <Input
              id="vertex-project-id"
              placeholder="your-gcp-project-id"
              value={vertexSettings?.projectId || ""}
              onChange={(e) =>
                handleProviderSettingChange(
                  AI_PROVIDER.VERTEX_AI,
                  "projectId",
                  e.target.value
                )
              }
              disabled={loading}
            />
            <Label htmlFor="vertex-region">Region</Label>
            <Input
              id="vertex-region"
              placeholder="us-central1"
              value={vertexSettings?.region || ""}
              onChange={(e) =>
                handleProviderSettingChange(
                  AI_PROVIDER.VERTEX_AI,
                  "region",
                  e.target.value
                )
              }
              disabled={loading}
            />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>AI Assistant Settings</CardTitle>
        <CardDescription>
          Configure your preferred AI provider, model, and custom instructions
          for content generation and project assistance.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="ai-provider">AI Provider</Label>
          <Select
            value={settings.selectedProvider}
            onValueChange={handleProviderChange}
            disabled={loading}
          >
            <SelectTrigger id="ai-provider">
              <SelectValue placeholder="Select a provider" />
            </SelectTrigger>
            <SelectContent>
              {Object.values(AI_PROVIDER).map((provider) => (
                <SelectItem key={provider} value={provider}>
                  {provider.charAt(0).toUpperCase() +
                    provider.slice(1).replace("_AI", " AI")}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {settings.selectedProvider && (
          <div className="space-y-2">
            <Label htmlFor="ai-model">Model</Label>
            <Select
              value={settings.selectedModelId}
              onValueChange={handleModelChange}
              disabled={loading || availableModels.length === 0}
            >
              <SelectTrigger id="ai-model">
                <SelectValue
                  placeholder={
                    availableModels.length > 0
                      ? "Select a model"
                      : "No models available for this provider"
                  }
                />
              </SelectTrigger>
              <SelectContent>
                {availableModels
                  .filter(
                    (model) => model.provider === settings.selectedProvider
                  )
                  .map((model) => (
                    <SelectItem key={model.id} value={model.id}>
                      {model.name}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
            {availableModels.length === 0 && settings.selectedProvider && (
              <p className="text-sm text-muted-foreground">
                Models for {settings.selectedProvider} need to be fetched or
                configured.
              </p>
            )}
          </div>
        )}

        {/* Render Provider-Specific Fields */}
        {settings.selectedProvider && renderProviderSpecificFields()}

        <div className="space-y-2">
          <Label htmlFor="custom-prompt">Custom Prompt/Instructions</Label>
          <Textarea
            id="custom-prompt"
            placeholder="Enter any custom instructions for the AI assistant..."
            value={settings.customPrompt || ""}
            onChange={handlePromptChange}
            rows={5}
            disabled={loading}
          />
          <p className="text-sm text-muted-foreground">
            This prompt will be used by the AI assistant to guide its responses
            and content generation.
          </p>
        </div>
        {error && <p className="text-sm text-destructive">Error: {error}</p>}
      </CardContent>
      <CardFooter>
        <Button onClick={onSubmit} disabled={loading} className="ml-auto">
          {loading ? "Saving..." : "Save Settings"}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ASForm;
