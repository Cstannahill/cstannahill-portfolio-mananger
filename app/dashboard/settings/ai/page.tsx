"use client";

import React, { useState, useEffect, useCallback } from "react";
import AiSettingsForm from "@/components/settings/AiSettingsForm";
import type { AiSettings, AiModel, AI_PROVIDER } from "@/types";
import { toast } from "sonner";
import PageHeader from "@/components/ui/page-header";

async function fetchModelsForProvider(
  provider: AI_PROVIDER
): Promise<AiModel[]> {
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
    return []; // Return empty array on error
  }
}

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
    toast.error(
      error instanceof Error
        ? error.message
        : "An unknown error occurred while loading settings."
    );
    // Return empty object or default settings on error to prevent app crash
    return {};
  }
}

async function saveAiSettings(settings: AiSettings): Promise<AiSettings> {
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
    console.error("Error in saveAiSettings:", error);
    toast.error(
      error instanceof Error
        ? error.message
        : "An unknown error occurred while saving settings."
    );
    throw error; // Re-throw to be caught by handleSubmit
  }
}

/**
 * @page AISettingsPage
 * @description Page for managing AI assistant settings.
 */
export default function AISettingsPage(): JSX.Element {
  const [settings, setSettings] = useState<Partial<AiSettings>>({});
  const [availableModels, setAvailableModels] = useState<AiModel[]>([]);
  const [loading, setLoading] = useState<boolean>(true); // Initialize to true for initial load
  const [saving, setSaving] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchInitialData = useCallback(async (): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      const loadedSettings = await loadAiSettings();
      setSettings(loadedSettings);
      if (loadedSettings.selectedProvider) {
        const models = await fetchModelsForProvider(
          loadedSettings.selectedProvider
        );
        setAvailableModels(models);
      }
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "An unknown error occurred during initial data load."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchInitialData();
  }, [fetchInitialData]);

  const handleSettingsChange = useCallback(
    async (newPartialSettings: Partial<AiSettings>): Promise<void> => {
      const previousProvider = settings.selectedProvider;
      const newSettings = { ...settings, ...newPartialSettings };
      setSettings(newSettings);
      setError(null);

      if (
        newPartialSettings.selectedProvider &&
        newPartialSettings.selectedProvider !== previousProvider
      ) {
        setLoading(true);
        setAvailableModels([]); // Clear previous models immediately
        try {
          const models = await fetchModelsForProvider(
            newPartialSettings.selectedProvider
          );
          setAvailableModels(models);
        } catch (err) {
          setError(
            err instanceof Error
              ? err.message
              : "An unknown error occurred while fetching models."
          );
        } finally {
          setLoading(false);
        }
      }
    },
    [settings]
  );

  const handleSubmit = async (): Promise<void> => {
    if (!settings.selectedProvider || !settings.selectedModelId) {
      const errorMessage = "Please select an AI provider and a model.";
      setError(errorMessage);
      toast.error(errorMessage);
      return;
    }
    setSaving(true);
    setError(null);
    try {
      const fullSettings: AiSettings = {
        selectedProvider: settings.selectedProvider,
        selectedModelId: settings.selectedModelId,
        customPrompt: settings.customPrompt || "",
      };
      await saveAiSettings(fullSettings);
      toast.success("AI settings saved successfully!");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "An unknown error occurred while saving settings."
      );
    } finally {
      setSaving(false);
    }
  };

  // Initial loading state before any settings are fetched
  if (loading && Object.keys(settings).length === 0 && !error) {
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

  return (
    <div className="container mx-auto px-4 py-8">
      <PageHeader
        title="AI Assistant Settings"
        description="Configure your AI assistant."
      />
      <div className="mt-8 flex justify-center">
        <AiSettingsForm
          settings={settings}
          availableModels={availableModels}
          onSettingsChange={handleSettingsChange}
          onSubmit={handleSubmit}
          loading={saving || loading} // Corrected: Form is loading if saving or if data/models are being fetched
          error={error}
        />
      </div>
    </div>
  );
}
