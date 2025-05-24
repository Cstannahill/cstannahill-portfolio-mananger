// components/projects/ProjectForm.tsx
"use client";
import React, { useState, useEffect, Suspense } from "react";
import type { Project } from "@/types/project";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon, SparklesIcon } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import {
  MultiSelectCombobox,
  type MultiSelectOption,
} from "@/components/ui/MultiSelectCombobox";
import { MDXLivePreview } from "@/components/MDXLivePreview";
import { ImageManager } from "@/components/projects/ImageManager";
import { useAiGenerator } from "@/lib/hooks/useAiGenerator";
import type { AiGenerateRequest } from "@/types/ai-generate";

// Dynamically import ReactMde to avoid SSR issues
const ReactMde = React.lazy(() => import("react-mde"));
import "react-mde/lib/styles/css/react-mde-all.css";

// Zod schema for project form validation (client-side)
// Aligns with ZodProjectSchema in API route, but adapted for form interaction
const projectFormSchema = z.object({
  title: z.string().min(3, { message: "Title must be at least 3 characters." }),
  summary: z
    .string()
    .min(10, { message: "Summary must be at least 10 characters." }),
  content: z
    .string()
    .min(20, { message: "Content must be at least 20 characters." }),
  technologies: z
    .array(z.string())
    .min(1, { message: "Please select at least one technology." })
    .optional(), // Made optional for now, can be required later
  tags: z
    .array(z.string())
    .min(1, { message: "Please select at least one tag." })
    .optional(), // Made optional for now, can be required later
  images: z.array(z.string()).optional(), // Placeholder - requires image upload component
  coverImage: z.string().optional(), // Placeholder - requires image selection
  demoUrl: z
    .string()
    .url({ message: "Please enter a valid URL." })
    .optional()
    .or(z.literal("")),
  sourceUrl: z
    .string()
    .url({ message: "Please enter a valid URL." })
    .optional()
    .or(z.literal("")),
  publishedAt: z.date({
    required_error: "A publication date is required.",
    invalid_type_error: "That's not a valid date!",
  }),
  status: z.enum(["draft", "published", "archived"]),
  featured: z.boolean(),
});

export type ProjectFormData = z.infer<typeof projectFormSchema>;

interface ProjectFormProps {
  mode: "create" | "edit";
  initialData?: Project; // Changed from IProject to Project
  projectId?: string;
  projectSlug?: string;
}

type AiTaskIdentifier = "title" | "summary" | "content";

export const ProjectForm: React.FC<ProjectFormProps> = ({
  mode,
  initialData,
  projectId,
  projectSlug,
}) => {
  const router = useRouter();
  const [allTechnologies, setAllTechnologies] = useState<MultiSelectOption[]>(
    []
  );
  const [allTags, setAllTags] = useState<MultiSelectOption[]>([]);
  const [isLoadingTechnologies, setIsLoadingTechnologies] =
    useState<boolean>(true);
  const [isLoadingTags, setIsLoadingTags] = useState<boolean>(true);
  const [selectedTab, setSelectedTab] = useState<"write" | "preview">("write");

  const {
    generatedContent: aiGeneratedContent,
    isLoading: isAiHookLoading, // Renamed to avoid conflict with component's isAiLoading states
    error: aiError,
    generateContent: triggerAiGenerate,
  } = useAiGenerator();

  const [lastAiTaskIdentifier, setLastAiTaskIdentifier] =
    useState<AiTaskIdentifier | null>(null);
  const [isAiLoadingTitle, setIsAiLoadingTitle] = useState<boolean>(false);
  const [isAiLoadingSummary, setIsAiLoadingSummary] = useState<boolean>(false);
  const [isAiLoadingContent, setIsAiLoadingContent] = useState<boolean>(false);

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    watch, // To watch field values, e.g., for conditional rendering or effects
    setValue, // Added setValue to update form state programmatically
    getValues, // Added getValues to read form state
  } = useForm<ProjectFormData>({
    resolver: zodResolver(projectFormSchema),
    defaultValues:
      mode === "edit" && initialData
        ? {
            title: initialData.title,
            summary: initialData.summary,
            content: initialData.content,
            technologies: initialData.technologies || [], // Add technologies
            tags: initialData.tags || [], // Add tags
            images: initialData.images || [], // Add images
            coverImage: initialData.coverImage || "", // Add coverImage
            demoUrl: initialData.demoUrl || "",
            sourceUrl: initialData.sourceUrl || "",
            publishedAt: initialData.publishedAt
              ? new Date(initialData.publishedAt)
              : new Date(),
            status: initialData.status || "draft",
            featured: initialData.featured || false,
            // Ensure all fields from ProjectFormData are mapped here if they exist in Project
          }
        : {
            title: "",
            summary: "",
            content: "",
            technologies: [], // Default to empty array
            tags: [], // Default to empty array
            images: [], // Default to empty array
            coverImage: "", // Default to empty string
            demoUrl: "",
            sourceUrl: "",
            publishedAt: new Date(),
            status: "draft",
            featured: false,
          },
  });

  useEffect(() => {
    const fetchTechnologies = async () => {
      setIsLoadingTechnologies(true);
      try {
        const response = await fetch("/api/technologies");
        if (!response.ok) {
          throw new Error("Failed to fetch technologies");
        }
        const data = (await response.json()) as Array<{
          _id: string;
          name: string;
        }>; // Type assertion for clarity
        setAllTechnologies(
          data.map((tech) => ({ value: tech._id, label: tech.name }))
        );
      } catch (error) {
        console.error("Error fetching technologies:", error);
        toast.error(
          error instanceof Error
            ? error.message
            : "Could not load technologies."
        );
        setAllTechnologies([]);
      } finally {
        setIsLoadingTechnologies(false);
      }
    };

    const fetchTags = async () => {
      setIsLoadingTags(true);
      try {
        const response = await fetch("/api/tags");
        if (!response.ok) {
          throw new Error("Failed to fetch tags");
        }
        const data = (await response.json()) as Array<{
          _id: string;
          name: string;
        }>; // Type assertion for clarity
        setAllTags(data.map((tag) => ({ value: tag._id, label: tag.name })));
      } catch (error) {
        console.error("Error fetching tags:", error);
        toast.error(
          error instanceof Error ? error.message : "Could not load tags."
        );
        setAllTags([]);
      } finally {
        setIsLoadingTags(false);
      }
    };

    void fetchTechnologies();
    void fetchTags();
  }, []);

  const watchedContent = watch("content"); // Watch the content field for MDX preview

  useEffect(() => {
    if (mode === "edit" && initialData) {
      reset({
        title: initialData.title,
        summary: initialData.summary,
        content: initialData.content,
        technologies: initialData.technologies || [], // Add technologies
        tags: initialData.tags || [], // Add tags
        images: initialData.images || [], // Add images
        coverImage: initialData.coverImage || "", // Add coverImage
        demoUrl: initialData.demoUrl || "",
        sourceUrl: initialData.sourceUrl || "",
        publishedAt: initialData.publishedAt
          ? new Date(initialData.publishedAt)
          : new Date(),
        status: initialData.status || "draft",
        featured: initialData.featured || false,
        // Ensure all fields from ProjectFormData are mapped here if they exist in Project
      });
    }
  }, [initialData, mode, reset]);

  // Effect to handle AI generated content
  useEffect(() => {
    if (aiGeneratedContent && lastAiTaskIdentifier) {
      // Ensure aiGeneratedContent is a string before setting value
      if (typeof aiGeneratedContent === "string") {
        setValue(lastAiTaskIdentifier, aiGeneratedContent, {
          shouldValidate: true,
          shouldDirty: true,
        });
        toast.success(
          `AI successfully generated content for ${lastAiTaskIdentifier}.`
        );
      } else {
        // This case should ideally not happen if API guarantees string data on success
        toast.error("AI returned unexpected data format.");
      }
      setLastAiTaskIdentifier(null);
    }
  }, [aiGeneratedContent, lastAiTaskIdentifier, setValue]);

  // Effect to handle AI errors
  useEffect(() => {
    if (aiError) {
      toast.error(`AI Generation Error: ${aiError}`);
    }
  }, [aiError]);

  // Effect to manage individual AI loading states
  useEffect(() => {
    if (lastAiTaskIdentifier === "title") setIsAiLoadingTitle(isAiHookLoading);
    else setIsAiLoadingTitle(false);

    if (lastAiTaskIdentifier === "summary")
      setIsAiLoadingSummary(isAiHookLoading);
    else setIsAiLoadingSummary(false);

    if (lastAiTaskIdentifier === "content")
      setIsAiLoadingContent(isAiHookLoading);
    else setIsAiLoadingContent(false);
  }, [isAiHookLoading, lastAiTaskIdentifier]);

  const handleAiGenerate = async (
    taskIdentifier: AiTaskIdentifier,
    context?: string
  ): Promise<void> => {
    setLastAiTaskIdentifier(taskIdentifier);
    let taskContext: string = "";
    const currentTitle: string = getValues("title");
    const currentSummary: string = getValues("summary");
    const currentContent: string = getValues("content");

    switch (taskIdentifier) {
      case "title":
        taskContext = `Generate a project title. Existing summary: ${currentSummary}. Existing content: ${currentContent}. ${context || ""}`;
        break;
      case "summary":
        taskContext = `Generate a project summary. Existing title: ${currentTitle}. Existing content: ${currentContent}. ${context || ""}`;
        break;
      case "content":
        taskContext = `Generate project content. Existing title: ${currentTitle}. Existing summary: ${currentSummary}. ${context || ""}`;
        break;
      default:
        toast.error("Invalid AI task identifier.");
        return;
    }

    const requestBody: AiGenerateRequest = {
      taskIdentifier: `project_${taskIdentifier}`,
      taskContext: { currentContent: taskContext }, // Wrapped taskContext in an object
    };
    await triggerAiGenerate(requestBody);
  };

  const onSubmit = async (data: ProjectFormData): Promise<void> => {
    try {
      let response: Response;
      if (mode === "edit") {
        if (!projectSlug) {
          toast.error("Project slug is missing. Cannot update.");
          return;
        }
        response = await fetch(`/api/projects/${projectSlug}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });
      } else {
        response = await fetch("/api/projects", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });
      }

      if (!response.ok) {
        const errorData = (await response.json()) as { message?: string };
        throw new Error(errorData.message || "Failed to save project");
      }

      // const result = await response.json(); // result might not be needed if only redirecting
      await response.json();
      toast.success(
        `Project ${mode === "edit" ? "updated" : "created"} successfully!`
      );
      router.push("/dashboard/projects");
    } catch (error) {
      console.error("Error saving project:", error);
      toast.error(
        error instanceof Error ? error.message : "An unknown error occurred."
      );
    }
  };

  const anyAiLoading: boolean =
    isAiLoadingTitle || isAiLoadingSummary || isAiLoadingContent;

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-8 p-8 bg-card rounded-xl shadow-lg"
    >
      <h1 className="text-3xl font-bold mb-6 text-center">
        {mode === "edit"
          ? `Edit Project: ${initialData?.title || ""}`
          : "Create New Project"}
      </h1>

      {/* Title Field */}
      <div>
        <div className="flex justify-between items-center mb-1">
          <Label htmlFor="title">Title</Label>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => handleAiGenerate("title")}
            disabled={isAiLoadingTitle || (anyAiLoading && !isAiLoadingTitle)} // Disable if this specific task is loading OR any other AI task is loading
            className="ml-2"
          >
            <SparklesIcon
              className={`mr-2 h-4 w-4 ${isAiLoadingTitle ? "animate-spin" : ""}`}
            />
            {isAiLoadingTitle ? "Generating..." : "AI Generate"}
          </Button>
        </div>
        <Controller
          name="title"
          control={control}
          render={({ field }) => (
            <Input
              id="title"
              {...field}
              placeholder="Project Title"
              disabled={anyAiLoading}
            />
          )}
        />
        {errors.title && (
          <p className="text-sm text-red-500 mt-1">{errors.title.message}</p>
        )}
      </div>

      {/* Summary Field */}
      <div>
        <div className="flex justify-between items-center mb-1">
          <Label htmlFor="summary">Summary</Label>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => handleAiGenerate("summary")}
            disabled={
              isAiLoadingSummary || (anyAiLoading && !isAiLoadingSummary)
            }
            className="ml-2"
          >
            <SparklesIcon
              className={`mr-2 h-4 w-4 ${isAiLoadingSummary ? "animate-spin" : ""}`}
            />
            {isAiLoadingSummary ? "Generating..." : "AI Generate"}
          </Button>
        </div>
        <Controller
          name="summary"
          control={control}
          render={({ field }) => (
            <Textarea
              id="summary"
              {...field}
              placeholder="Brief project summary..."
              disabled={isSubmitting || anyAiLoading}
              rows={4}
            />
          )}
        />
        {errors.summary && (
          <p className="text-sm text-red-500 mt-1">{errors.summary.message}</p>
        )}
      </div>

      {/* Content Field with MDX Editor and Preview */}
      <div>
        <div className="flex justify-between items-center mb-1">
          <Label htmlFor="content">Content (MDX)</Label>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => handleAiGenerate("content")}
            disabled={
              isAiLoadingContent || (anyAiLoading && !isAiLoadingContent)
            }
            className="ml-2"
          >
            <SparklesIcon
              className={`mr-2 h-4 w-4 ${isAiLoadingContent ? "animate-spin" : ""}`}
            />
            {isAiLoadingContent ? "Generating..." : "AI Generate"}
          </Button>
        </div>
        <Controller
          name="content"
          control={control}
          render={({ field }) => (
            <Suspense
              fallback={
                <Textarea
                  rows={15}
                  className="min-h-[300px] h-full w-full"
                  placeholder="Loading editor..."
                  disabled={anyAiLoading}
                />
              }
            >
              <ReactMde
                value={field.value}
                onChange={field.onChange}
                selectedTab={selectedTab}
                onTabChange={setSelectedTab}
                minEditorHeight={300}
                childProps={{
                  writeButton: {
                    className: "bg-[#1d1916] text-white hover:bg-[#1d1916]/80",
                    tabIndex: -1,
                  },
                  previewButton: {
                    className: "bg-[#f2f2f0] text-[#1d1916]",
                    tabIndex: -1,
                  },
                  textArea: {
                    id: "content",
                    placeholder: `Project details in MDX format...\nSupports custom components like <Callout type="info">...`,
                    className: "font-mono text-sm w-full",
                    disabled: isSubmitting || anyAiLoading,
                  },
                }}
                generateMarkdownPreview={async (markdown) => {
                  return (
                    <MDXLivePreview
                      mdxSource={markdown || watchedContent || ""}
                    />
                  );
                }}
              />
            </Suspense>
          )}
        />
        {errors.content && (
          <p className="text-sm text-red-500 mt-1">{errors.content.message}</p>
        )}
      </div>

      {/* Image Management Field */}
      <div>
        <Controller
          name="images"
          control={control}
          render={() => (
            // field not directly used here, ImageManager uses getValues/setValue
            <ImageManager
              initialImages={getValues("images") || []}
              initialCoverImage={getValues("coverImage")}
              onImagesChange={(newImages) =>
                setValue("images", newImages, { shouldValidate: true })
              }
              onCoverImageChange={(newCoverImage) =>
                setValue("coverImage", newCoverImage || "", {
                  shouldValidate: true,
                })
              }
              // Removed disabled={anyAiLoading} as ImageManager does not support it
            />
          )}
        />
        {errors.images && (
          <p className="text-sm text-red-500 mt-1">{errors.images.message}</p>
        )}
        {errors.coverImage && (
          <p className="text-sm text-red-500 mt-1">
            {errors.coverImage.message}
          </p>
        )}
      </div>

      {/* Technologies Field */}
      <div>
        <Label htmlFor="technologies">Technologies</Label>
        <Controller
          name="technologies"
          control={control}
          render={({ field }) => (
            <MultiSelectCombobox
              options={allTechnologies}
              selected={field.value || []}
              onChange={(selectedValues) =>
                setValue("technologies", selectedValues, {
                  shouldValidate: true,
                })
              }
              placeholder={
                isLoadingTechnologies
                  ? "Loading technologies..."
                  : "Select technologies..."
              }
              className="w-full"
              disabled={isLoadingTechnologies || anyAiLoading}
            />
          )}
        />
        {errors.technologies && (
          <p className="text-sm text-red-500 mt-1">
            {errors.technologies.message}
          </p>
        )}
      </div>

      {/* Tags Field */}
      <div>
        <Label htmlFor="tags">Tags</Label>
        <Controller
          name="tags"
          control={control}
          render={({ field }) => (
            <MultiSelectCombobox
              options={allTags}
              selected={field.value || []}
              onChange={(selectedValues) =>
                setValue("tags", selectedValues, { shouldValidate: true })
              }
              placeholder={isLoadingTags ? "Loading tags..." : "Select tags..."}
              className="w-full"
              disabled={isLoadingTags || anyAiLoading}
            />
          )}
        />
        {errors.tags && (
          <p className="text-sm text-red-500 mt-1">{errors.tags.message}</p>
        )}
      </div>

      {/* URLs Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Label htmlFor="demoUrl">Demo URL</Label>
          <Controller
            name="demoUrl"
            control={control}
            render={({ field }) => (
              <Input
                id="demoUrl"
                {...field}
                placeholder="https://example.com/demo"
                disabled={anyAiLoading}
              />
            )}
          />
          {errors.demoUrl && (
            <p className="text-sm text-red-500 mt-1">
              {errors.demoUrl.message}
            </p>
          )}
        </div>
        <div>
          <Label htmlFor="sourceUrl">Source Code URL</Label>
          <Controller
            name="sourceUrl"
            control={control}
            render={({ field }) => (
              <Input
                id="sourceUrl"
                {...field}
                placeholder="https://github.com/user/repo"
                disabled={anyAiLoading}
              />
            )}
          />
          {errors.sourceUrl && (
            <p className="text-sm text-red-500 mt-1">
              {errors.sourceUrl.message}
            </p>
          )}
        </div>
      </div>

      {/* Date Published & Status Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
        <div>
          <Label htmlFor="publishedAt">Date Published</Label>
          <Controller
            name="publishedAt"
            control={control}
            render={({ field }) => (
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={`w-full justify-start text-left font-normal ${
                      !field.value ? "text-muted-foreground" : "" // Corrected template literal
                    }`}
                    disabled={anyAiLoading}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {field.value ? (
                      format(field.value, "PPP")
                    ) : (
                      <span>Pick a date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    initialFocus
                    disabled={anyAiLoading} // Keep this disabled for the Calendar itself
                  />
                </PopoverContent>
              </Popover>
            )}
          />
          {errors.publishedAt && (
            <p className="text-sm text-red-500 mt-1">
              {errors.publishedAt.message}
            </p>
          )}
        </div>
        <div>
          <Label htmlFor="status">Status</Label>
          <Controller
            name="status"
            control={control}
            render={({ field }) => (
              <select
                id="status"
                {...field}
                className="w-full p-2 border rounded-md bg-background text-foreground"
                disabled={anyAiLoading}
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
                <option value="archived">Archived</option>
              </select>
            )}
          />
          {errors.status && (
            <p className="text-sm text-red-500 mt-1">{errors.status.message}</p>
          )}
        </div>
      </div>

      {/* Featured Switch */}
      <div className="flex items-center space-x-2">
        <Controller
          name="featured"
          control={control}
          render={({ field }) => (
            <Switch
              id="featured"
              checked={field.value}
              onCheckedChange={field.onChange}
              disabled={isSubmitting || anyAiLoading}
            />
          )}
        />
        <Label htmlFor="featured" className="cursor-pointer">
          Feature this project?
        </Label>
        {errors.featured && (
          <p className="text-sm text-red-500 ml-2">
            {errors.featured?.message}
          </p> // Optional chaining
        )}
      </div>

      <div className="flex justify-end pt-4">
        <Button type="submit" disabled={isSubmitting || anyAiLoading} size="lg">
          {isSubmitting
            ? mode === "edit"
              ? "Updating Project..."
              : "Creating Project..."
            : mode === "edit"
              ? "Save Changes"
              : "Create Project"}
        </Button>
      </div>
    </form>
  );
};
