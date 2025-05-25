"use client";

import React, { useState, useEffect, useCallback } from "react";
import AiSettingsForm from "@/components/settings/AiSettingsForm";
import type { AiSettings, AiModel, AI_PROVIDER } from "@/types";
import { toast } from "sonner";
import PageHeader from "@/components/ui/page-header";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { aiSettingsKeys, aiModelsKeys } from "@/lib/queryKeys";

// Helper function to fetch AI models for a given provider
async function fetchModelsForProvider(
  provider: AI_PROVIDER | undefined
): Promise<AiModel[]> {
  if (!provider) return []; // Return empty if no provider
  try {
    const response = await fetch(`/api/ai/models?provider=${provider}`);
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message ||
          `Failed to fetch models for ${provider}: ${response.statusText}`
      );
    }
    const result = await response.json();
    return result.data as AiModel[];
  } catch (error) {
    console.error(`Error in fetchModelsForProvider for ${provider}:`, error);
    toast.error(
      error instanceof Error
        ? error.message
        : `An unknown error occurred while fetching models for ${provider}.`
    );
    return [];
  }
}

// Helper function to load AI settings
async function loadAiSettings(): Promise<Partial<AiSettings>> {
  try {
    const response = await fetch("/api/settings/ai");
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message ||
          `Failed to load AI settings: ${response.statusText}`
      );
    }
    const result = await response.json();
    return result.data as Partial<AiSettings>;
  } catch (error) {
    console.error("Error in loadAiSettings:", error);
    // toast.error is handled by react-query's onError
    throw error; // Re-throw for react-query to handle
  }
}

// Helper function to save AI settings
async function saveAiSettingsMutationFn(
  settings: AiSettings
): Promise<AiSettings> {
  try {
    const response = await fetch("/api/settings/ai", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(settings),
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message ||
          `Failed to save AI settings: ${response.statusText}`
      );
    }
    const result = await response.json();
    return result.data as AiSettings;
  } catch (error) {
    console.error("Error in saveAiSettingsMutationFn:", error);
    // toast.error is handled by react-query's onError
    throw error; // Re-throw for react-query to handle
  }
}

/**
 * @page AISettingsPage
 * @description Page for managing AI assistant settings using TanStack Query.
 */
export default function AISettingsPage(): JSX.Element {
  const queryClient = useQueryClient();

  // Local state for form inputs that might change before saving
  const [currentSettings, setCurrentSettings] = useState<Partial<AiSettings>>(
    {}
  );
  const [formError, setFormError] = useState<string | null>(null);

  // Fetch AI Settings
  const {
    data: loadedSettings,
    isLoading: isLoadingSettings,
    error: settingsError,
  } = useQuery<Partial<AiSettings>, Error>({
    queryKey: aiSettingsKeys(),
    queryFn: loadAiSettings,
  });

  // Effect to update currentSettings when settings are loaded or change
  useEffect(() => {
    if (loadedSettings) {
      setCurrentSettings(loadedSettings);
    }
  }, [loadedSettings]);

  const {
    data: availableModelsData,
    isLoading: isLoadingModels,
    error: modelsError,
  } = useQuery<AiModel[], Error>({
    queryKey: aiModelsKeys(currentSettings.selectedProvider),
    queryFn: () => fetchModelsForProvider(currentSettings.selectedProvider),
    enabled: !!currentSettings.selectedProvider,
  });

  // Mutation for Saving AI Settings
  const { mutate: saveSettings, isPending: isSavingSettings } = useMutation<
    AiSettings,
    Error,
    AiSettings
  >({
    mutationFn: saveAiSettingsMutationFn,
    onSuccess: (savedData) => {
      queryClient.setQueryData(aiSettingsKeys(), savedData); // Update cache
      setCurrentSettings(savedData); // Update local form state
      toast.success("AI settings saved successfully!");
      setFormError(null);
    },
    onError: (error: Error) => {
      toast.error(`Failed to save AI settings: ${error.message}`);
      setFormError(error.message);
    },
  });

  // Update currentSettings and trigger model refetch when form fields change
  const handleSettingsChange = useCallback(
    (newPartialSettings: Partial<AiSettings>): void => {
      const previousProvider = currentSettings.selectedProvider;
      const updatedSettings = { ...currentSettings, ...newPartialSettings };
      setCurrentSettings(updatedSettings);
      setFormError(null);

      // If provider changed, models will refetch due to queryKey change
      if (
        newPartialSettings.selectedProvider &&
        newPartialSettings.selectedProvider !== previousProvider
      ) {
        // No explicit refetch needed, query key change handles it.
      }
    },
    [currentSettings]
  );

  const handleSubmit = (): void => {
    if (!currentSettings.selectedProvider || !currentSettings.selectedModelId) {
      const errorMessage = "Please select an AI provider and a model.";
      setFormError(errorMessage);
      toast.error(errorMessage);
      return;
    }

    const providerSettingsToSave = currentSettings.providerSettings || {};

    const settingsToSave: AiSettings = {
      selectedProvider: currentSettings.selectedProvider,
      selectedModelId: currentSettings.selectedModelId,
      customPrompt: currentSettings.customPrompt || "",
      providerSettings: providerSettingsToSave,
    };

    if (currentSettings.selectedProvider && currentSettings.providerSettings) {
      const providerKey =
        currentSettings.selectedProvider as keyof AiSettings["providerSettings"];
      if (currentSettings.providerSettings[providerKey]) {
        if (!settingsToSave.providerSettings) {
          settingsToSave.providerSettings = {};
        }
        settingsToSave.providerSettings[providerKey] =
          currentSettings.providerSettings[providerKey];
      }
    }

    saveSettings(settingsToSave);
  };

  const isLoading =
    isLoadingSettings ||
    (!!currentSettings.selectedProvider && isLoadingModels);

  if (isLoading && !loadedSettings && !settingsError) {
    return (
      <div className="container mx-auto px-4 py-8">
        <PageHeader
          title="AI Assistant Settings"
          description="Configure your AI assistant."
        />
        <div className="mt-8 flex justify-center items-center h-64">
          <p>Loading settings...</p>
        </div>
      </div>
    );
  }

  if (settingsError) {
    // Error is already toasted by useQuery's onError
    // Display a general error message or a retry mechanism if desired
  }

  const modelsForForm: AiModel[] =
    (availableModelsData as AiModel[] | undefined) || [];

  return (
    <div className="container mx-auto px-4 py-8">
      <PageHeader
        title="AI Assistant Settings"
        description="Configure your AI assistant."
      />
      {settingsError && !isLoadingSettings && (
        <div className="mt-4 p-4 bg-red-100 text-red-700 rounded">
          <p>Error loading AI settings: {settingsError.message}</p>
          <p>
            Please try refreshing the page. If the problem persists, contact
            support.
          </p>
        </div>
      )}
      {modelsError &&
        !!currentSettings.selectedProvider &&
        !isLoadingModels && (
          <div className="mt-4 p-4 bg-red-100 text-red-700 rounded">
            <p>Error loading AI models: {modelsError.message}</p>
          </div>
        )}
      <AiSettingsForm
        settings={currentSettings}
        availableModels={modelsForForm}
        onSettingsChange={handleSettingsChange}
        onSubmit={handleSubmit}
        loading={isLoading || isSavingSettings} // Combined loading state for AiSettingsForm
        error={formError || modelsError?.message || null}
      />
    </div>
  );
}
