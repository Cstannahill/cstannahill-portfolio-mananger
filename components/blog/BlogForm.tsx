"use client";

import React, {
  useState,
  useEffect,
  useMemo,
  useCallback,
  // Suspense, // No longer needed for ReactMde
} from "react";
import { useForm, SubmitHandler } from "react-hook-form"; // ControllerRenderProps removed as not directly used
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { format } from "date-fns";
import dynamic from "next/dynamic";
// import ReactMde from "react-mde"; // Removed
// import Showdown from "showdown"; // Removed
import { z } from "zod";

import type { BlogPostFull } from "@/types/blog";
import type { Tag } from "@/types";
import type { AiGenerateRequest } from "@/types/ai-generate";
import { useAiGenerator } from "@/lib/hooks/useAiGenerator";
import { formatMDX } from "@/lib/utils/markdown";

// import "react-mde/lib/styles/css/react-mde-all.css"; // Removed

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { CalendarIcon, Loader2, SparklesIcon } from "lucide-react";
import {
  MultiSelectCombobox,
  ComboboxOption,
} from "@/components/ui/multi-select-combobox";
import { MDXLivePreview } from "@/components/MDXLivePreview";

// Dynamically import MdEditor to disable SSR
const MdEditor = dynamic(() => import("@/components/shared/MdEditor"), {
  ssr: false,
  loading: () => (
    <Textarea rows={15} placeholder="Loading editor..." disabled />
  ),
});

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: any;
}

const blogPostSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters long"),
  slug: z
    .string()
    .min(3, "Slug must be at least 3 characters long")
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      "Slug must be a valid URL slug (e.g., my-first-post)"
    ),
  excerpt: z.string().optional(),
  content: z.string().min(10, "Content must be at least 10 characters long"),
  publishedAt: z.date(),
  tags: z.array(z.string()).optional(),
  coverImage: z.string().url("Invalid URL format").optional(),
});

// Type for form values before Zod parsing (input to Zod)
// This type might not be strictly needed if defaultValues directly matches BlogPostFormOutput structure
// or if the schema handles transformation from a slightly different input structure.
type BlogPostFormInput = z.input<typeof blogPostSchema>;

// Type for form values after Zod parsing (output from Zod, used in onSubmit and for useForm)
type BlogPostFormOutput = z.output<typeof blogPostSchema>;

interface BlogFormProps {
  mode: "create" | "edit";
  initialData?: BlogPostFull | null;
}

const BlogForm: React.FC<BlogFormProps> = ({ mode, initialData }) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  // const [selectedMdeTab, setSelectedMdeTab] = useState<"write" | "preview">("write"); // Removed
  const [tagOptions, setTagOptions] = useState<ComboboxOption[]>([]);
  const [lastAiTaskIdentifier, setLastAiTaskIdentifier] = useState<
    string | null
  >(null);
  const {
    generateContent: generateAiContent,
    generatedContent: aiGeneratedContent,
    isLoading: isAiLoading,
    error: aiError,
  } = useAiGenerator();

  const defaultValues: Partial<BlogPostFormInput> = useMemo(() => {
    return {
      title: initialData?.title || "",
      slug: initialData?.slug || "",
      excerpt: initialData?.excerpt || undefined,
      content: initialData?.content || "",
      publishedAt: initialData?.publishedAt
        ? new Date(initialData.publishedAt)
        : new Date(),
      tags:
        initialData?.tags?.map((t) => (typeof t === "string" ? t : t.name)) ||
        undefined, // Changed: allow undefined for optional input
      coverImage: initialData?.coverImage || undefined,
    };
  }, [initialData]);

  const form = useForm<BlogPostFormInput>({
    resolver: zodResolver(blogPostSchema),
    defaultValues,
  });

  useEffect(() => {
    const fetchTags = async () => {
      try {
        const response = await fetch("/api/tags");
        const data: ApiResponse<Tag[]> = await response.json();
        if (data.success && data.data) {
          setTagOptions(
            data.data.map((tag) => ({ value: tag.name, label: tag.name }))
          );
        } else {
          console.error("Failed to fetch tags:", data.error || data.message);
        }
      } catch (error) {
        console.error("Error fetching tags:", error);
      }
    };
    fetchTags();
  }, []);

  // Reset form when initialData changes, ensuring types match BlogPostFormInput
  useEffect(() => {
    if (initialData) {
      form.reset({
        title: initialData.title,
        slug: initialData.slug,
        excerpt: initialData.excerpt || undefined,
        content: initialData.content,
        publishedAt: new Date(initialData.publishedAt),
        tags:
          initialData.tags?.map((t) => (typeof t === "string" ? t : t.name)) ||
          undefined, // Changed: allow undefined
        coverImage: initialData.coverImage || undefined,
      });
    }
  }, [initialData, form]);

  // Effect to update form field when AI content is generated
  useEffect(() => {
    if (aiGeneratedContent && lastAiTaskIdentifier) {
      if (typeof aiGeneratedContent === "string") {
        let fieldToUpdate: keyof BlogPostFormInput | null = null;
        if (lastAiTaskIdentifier === "generate_blog_title") {
          fieldToUpdate = "title";
        } else if (lastAiTaskIdentifier === "generate_blog_excerpt") {
          fieldToUpdate = "excerpt";
        } else if (lastAiTaskIdentifier === "generate_blog_content_section") {
          fieldToUpdate = "content";
        }

        if (fieldToUpdate) {
          form.setValue(fieldToUpdate, aiGeneratedContent, {
            shouldValidate: true,
          });
          toast.success(`AI-generated ${fieldToUpdate} applied!`);
        }
      } else if (
        typeof aiGeneratedContent === "object" &&
        aiGeneratedContent !== null
      ) {
        // Handle object response if API changes in future, for now API returns string
        // Example: if (aiGeneratedContent.text && lastAiTaskIdentifier === "some_task_returning_object") {
        //   form.setValue("content", aiGeneratedContent.text, { shouldValidate: true });
        // }
        toast.info(
          "AI generated structured content (handling not fully implemented for this format yet)."
        );
      }
      setLastAiTaskIdentifier(null); // Reset after processing
    }
    if (aiError) {
      toast.error(`AI Generation Error: ${aiError}`);
      setLastAiTaskIdentifier(null); // Reset on error too
    }
  }, [aiGeneratedContent, aiError, form, lastAiTaskIdentifier]);

  const onSubmit: SubmitHandler<BlogPostFormOutput> = async (data) => {
    setIsLoading(true);
    // Format MDX content before saving
    try {
      data.content = await formatMDX(data.content);
    } catch (err) {
      console.error("[BlogForm] MDX formatting failed:", err);
      toast.error(
        "Content formatting failed, proceeding with unformatted content."
      );
    }
    const url =
      mode === "create" ? "/api/blog" : `/api/blog/${initialData?.slug}`;
    const method = mode === "create" ? "POST" : "PUT";

    // Ensure tags is an array for the API request
    const payload = {
      ...data,
      tags: data.tags || [], // Handle potentially undefined tags from output
    };

    try {
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload), // Use payload with guaranteed tags array
      });
      const result: ApiResponse<BlogPostFull> = await response.json();
      if (result.success) {
        router.push("/dashboard/blog");
        router.refresh();
        toast.success(
          `Blog post ${mode === "create" ? "created" : "updated"} successfully!`
        );
      } else {
        toast.error(
          `Failed to save blog post: ${result.error || result.message}`
        );
        console.error(
          "Failed to save blog post:",
          result.error || result.message
        );
      }
    } catch (error) {
      toast.error("Error saving blog post. See console for details.");
      console.error("Error saving blog post:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // const generatePreview = useCallback( // Removed
  //   async (markdown: string): Promise<string> => {
  //     const converter = new Showdown.Converter();
  //     return converter.makeHtml(markdown);
  //   },
  //   []
  // );

  const handleAiGenerate = async (taskIdentifier: string) => {
    setLastAiTaskIdentifier(taskIdentifier); // Set the task identifier
    const currentTitle = form.getValues("title")?.trim();
    const currentExcerpt = form.getValues("excerpt")?.trim();
    const currentContent = form.getValues("content")?.trim();

    let taskContextInput: Record<string, any> = {};

    if (taskIdentifier === "generate_blog_title") {
      if (currentTitle) {
        taskContextInput.existingTitle = currentTitle;
      } else if (currentExcerpt) {
        taskContextInput.contextExcerpt = currentExcerpt;
      } else if (currentContent) {
        taskContextInput.contextContent = currentContent;
      }
      // If all are empty, taskContextInput remains empty.
      // Backend should infer: "generate a random topic, then a title for it."
    } else if (taskIdentifier === "generate_blog_excerpt") {
      if (currentExcerpt) {
        taskContextInput.existingExcerpt = currentExcerpt;
      } else if (currentTitle) {
        taskContextInput.contextTitle = currentTitle;
      } else if (currentContent) {
        taskContextInput.contextContent = currentContent;
      }
      // If all are empty, taskContextInput remains empty.
      // Backend should infer: "generate a random topic, then a title, then an excerpt."
    } else if (taskIdentifier === "generate_blog_content_section") {
      if (currentContent) {
        taskContextInput.existingContent = currentContent;
      } else if (currentTitle) {
        taskContextInput.contextTitle = currentTitle;
      } else if (currentExcerpt) {
        taskContextInput.contextExcerpt = currentExcerpt;
      }
      // If all are empty, taskContextInput remains empty.
      // Backend should infer: "generate a random topic, then a title, then a content section."
    }

    const requestBody: AiGenerateRequest = {
      taskIdentifier,
      taskContext: taskContextInput,
      // customPrompt: "Optional custom prompt here if needed for this specific task"
    };
    await generateAiContent(requestBody);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <div className="flex justify-between items-center">
                <FormLabel>Title</FormLabel>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => handleAiGenerate("generate_blog_title")}
                  disabled={isAiLoading}
                >
                  {isAiLoading &&
                  lastAiTaskIdentifier === "generate_blog_title" ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <SparklesIcon className="mr-2 h-4 w-4" />
                  )}
                  Suggest Title
                </Button>
              </div>
              <FormControl>
                <Input placeholder="Blog Post Title" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="slug"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Slug</FormLabel>
              <FormControl>
                <Input placeholder="blog-post-slug" {...field} />
              </FormControl>
              <FormDescription>
                This will be used in the URL (e.g., /blog/blog-post-slug).
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="excerpt"
          render={({ field }) => (
            <FormItem>
              <div className="flex justify-between items-center">
                <FormLabel>Excerpt</FormLabel>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => handleAiGenerate("generate_blog_excerpt")}
                  disabled={isAiLoading}
                >
                  {isAiLoading &&
                  lastAiTaskIdentifier === "generate_blog_excerpt" ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <SparklesIcon className="mr-2 h-4 w-4" />
                  )}
                  Generate Excerpt
                </Button>
              </div>
              <FormControl>
                <Textarea
                  placeholder="A short summary of the blog post..."
                  {...field}
                  value={field.value || ""}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* Content Field with MdEditor */}
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <div className="flex justify-between items-center">
                <FormLabel>Content</FormLabel>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    handleAiGenerate("generate_blog_content_section")
                  }
                  disabled={isAiLoading}
                >
                  {isAiLoading &&
                  lastAiTaskIdentifier === "generate_blog_content_section" ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <SparklesIcon className="mr-2 h-4 w-4" />
                  )}
                  Generate Content Section
                </Button>
              </div>
              <FormControl>
                <MdEditor
                  value={field.value || ""} // Ensure value is not null/undefined
                  onChange={field.onChange}
                  // initialValue is managed by RHF defaultValues and form.reset
                  mode={mode}
                  toolbarConfig={{
                    generateTitle: false, // Title AI is a separate button
                    generateSummary: false, // Excerpt AI is a separate button
                    // generateSections toolbar button removed; using external button for content generation // Enable section generation from toolbar
                    customItems: [],
                  }}
                  onFormat={formatMDX} // Pass the async function directly
                  onAIClick={async (taskId) => {
                    await handleAiGenerate(taskId);
                    // Return the latest content from the form, which should have been updated by the useEffect
                    return form.getValues("content");
                  }}
                  renderPreview={({ mdx }) => (
                    <MDXLivePreview mdxSource={mdx} />
                  )}
                  className="min-h-[300px]"
                />
              </FormControl>
              <FormDescription>
                Use Markdown to write your blog post. You can use the toolbar
                for formatting and AI assistance.
              </FormDescription>
              <FormMessage />{" "}
              {/* For displaying validation errors for the content field */}
            </FormItem>
          )}
        />
        {/* The specific error message below content field is removed as FormMessage inside FormItem handles it now */}

        <FormField
          control={form.control}
          name="publishedAt"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Publication Date</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-[240px] pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value ? (
                        format(new Date(field.value), "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value ? new Date(field.value) : undefined}
                    onSelect={(date) => field.onChange(date)}
                    disabled={(date) =>
                      date > new Date() || date < new Date("1900-01-01")
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="tags"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tags</FormLabel>
              <FormControl>
                <MultiSelectCombobox
                  options={tagOptions}
                  selectedValues={field.value || []}
                  onChange={field.onChange}
                  placeholder="Select tags..."
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="coverImage"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Cover Image URL</FormLabel>
              <FormControl>
                <Input
                  placeholder="https://example.com/image.jpg"
                  {...field}
                  value={field.value || ""}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isLoading || isAiLoading}>
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {mode === "create" ? "Create Post" : "Save Changes"}
        </Button>
      </form>
    </Form>
  );
};

export default BlogForm;
