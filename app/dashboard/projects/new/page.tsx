"use client";

import React, { useState, ChangeEvent, DragEvent, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MultiSelectAutocomplete } from "@/components/ui/MultiSelectAutocomplete";
import type { Tag } from "@/types/tag";
import type { Technology } from "@/types/technology";
import {
  ComponentPalette,
  MDXComponentConfig,
} from "@/components/ui/ComponentPalette";
import { ComponentPropForm } from "@/components/ui/ComponentPropForm";
import { MDXLivePreview } from "@/components/MDXLivePreview";

// MDX component config (starter, can be expanded)
const MDX_COMPONENTS: MDXComponentConfig[] = [
  {
    name: "Callout",
    label: "Callout (info/warning/note)",
    props: [
      { name: "title", label: "Title", type: "string", required: false },
      { name: "icon", label: "Icon Emoji", type: "string", required: false },
      {
        name: "type",
        label: "Type",
        type: "enum",
        options: ["info", "warning", "success", "error"],
        required: false,
      },
    ],
    hasChildren: true,
    example: `<Callout title="Note" icon="💡" type="info">Content here</Callout>`,
  },
  {
    name: "ProjectTechStack",
    label: "Project Tech Stack",
    props: [
      {
        name: "technologies",
        label: "Technologies (array)",
        type: "array",
        required: true,
        description: "e.g. Next.js, TypeScript, MongoDB",
      },
    ],
    hasChildren: false,
    example: `<ProjectTechStack technologies={[{ name: 'Next.js', icon: '▲', role: 'primary' }]} />`,
  },
  {
    name: "ProjectTimeline",
    label: "Project Timeline",
    props: [
      {
        name: "items",
        label: "Timeline Items (array)",
        type: "array",
        required: true,
        description: "[{ date, title, description, status }]",
      },
    ],
    hasChildren: false,
    example: `<ProjectTimeline items={[{ date: '2025-01', title: 'Start', description: '...', status: 'completed' }]} />`,
  },
  {
    name: "ProjectFeatureShowcase",
    label: "Project Feature Showcase",
    props: [
      {
        name: "groups",
        label: "Feature Groups (array)",
        type: "array",
        required: true,
        description:
          "[{ title, image, features: [{ title, description, status }] }]",
      },
    ],
    hasChildren: false,
    example: `<ProjectFeatureShowcase groups={[{ title: 'Core', image: '/img.png', features: [{ title: 'X', description: '...', status: 'implemented' }] }]} />`,
  },
  {
    name: "ProjectMetrics",
    label: "Project Metrics",
    props: [
      {
        name: "metrics",
        label: "Metrics (array)",
        type: "array",
        required: true,
        description: "[{ label, value, icon, progress }]",
      },
    ],
    hasChildren: false,
    example: `<ProjectMetrics metrics={[{ label: 'Performance', value: '95%', icon: '⚡', progress: 95 }]} />`,
  },
  {
    name: "ProjectChallengeCard",
    label: "Project Challenge Card",
    props: [
      { name: "title", label: "Title", type: "string", required: true },
      { name: "challenge", label: "Challenge", type: "string", required: true },
      { name: "solution", label: "Solution", type: "string", required: true },
      { name: "impact", label: "Impact", type: "string", required: false },
      {
        name: "difficulty",
        label: "Difficulty",
        type: "enum",
        options: ["easy", "medium", "hard"],
        required: false,
      },
      { name: "domain", label: "Domain", type: "string", required: false },
    ],
    hasChildren: false,
    example: `<ProjectChallengeCard title="..." challenge="..." solution="..." />`,
  },
];

export default function NewProjectPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("basic");
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    summary: "",
    content: "",
    technologies: [] as Technology[],
    tags: [] as Tag[],
    demoUrl: "",
    sourceUrl: "",
    status: "draft",
    images: [] as string[], // Correct type for images
  });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);
  // Track if user has manually edited the slug
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(false);
  const [isDragActive, setIsDragActive] = useState(false);
  const [showPalette, setShowPalette] = useState(false);
  const [selectedComponent, setSelectedComponent] =
    useState<MDXComponentConfig | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Inline validation state
  const [validation, setValidation] = useState({
    title: "",
    slug: "",
    summary: "",
    content: "",
    technologies: "",
    tags: "",
  });

  // Utility to generate a slug from a string
  function generateSlug(input: string): string {
    return input
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  }

  // Validation logic
  function validateForm() {
    const newValidation = {
      title: formData.title.trim() ? "" : "Title is required.",
      slug: formData.slug.trim() ? "" : "Slug is required.",
      summary: formData.summary.trim() ? "" : "Summary is required.",
      content: formData.content.trim() ? "" : "Content is required.",
      technologies:
        formData.technologies.length > 0
          ? ""
          : "At least one technology is required.",
      tags: formData.tags.length > 0 ? "" : "At least one tag is required.",
    };
    setValidation(newValidation);
    // Return true if all fields are valid
    return Object.values(newValidation).every((v) => !v);
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      // If editing the title and slug hasn't been manually edited, auto-generate slug
      if (name === "title" && !slugManuallyEdited) {
        return {
          ...prev,
          title: value,
          slug: generateSlug(value),
        };
      }
      // If editing the slug, validate and set manual edit flag
      if (name === "slug") {
        setSlugManuallyEdited(true);
        // If user clears the slug, revert to auto-generation
        if (value === "") {
          setSlugManuallyEdited(false);
          return {
            ...prev,
            slug: generateSlug(prev.title),
          };
        }
        // Only allow valid slug characters
        return {
          ...prev,
          slug: generateSlug(value),
        };
      }
      return { ...prev, [name]: value };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(false);
    if (!validateForm()) {
      setIsLoading(false);
      setError("Please fix the validation errors above.");
      return;
    }
    try {
      // Prepare data for API
      const projectData = {
        ...formData,
        technologies: formData.technologies.map((t) => t.name),
        tags: formData.tags.map((t) => t.name),
      };
      const res = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(projectData),
      });
      const result = await res.json();
      if (!res.ok) {
        setError(result.message || "Failed to create project");
        return;
      }
      setSuccess(true);
      // Navigate back to projects list after successful creation
      router.push("/dashboard/projects");
      router.refresh();
    } catch (error) {
      setError((error as Error).message || "Failed to create project");
      console.error("Failed to create project:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Enhanced image upload handler for multiple files and drag-and-drop
  const handleImageUpload = async (
    e: ChangeEvent<HTMLInputElement> | DragEvent<HTMLDivElement>
  ) => {
    let files: FileList | File[] | null = null;
    if ("dataTransfer" in e) {
      files = e.dataTransfer.files;
    } else {
      files = e.target.files;
    }
    if (!files || files.length === 0) return;
    setIsLoading(true);
    setError(null);
    try {
      const uploadPromises = Array.from(files).map(async (file) => {
        const formDataUpload = new FormData();
        formDataUpload.append("file", file);
        const res = await fetch("/api/upload", {
          method: "POST",
          body: formDataUpload,
        });
        const result = await res.json();
        if (!res.ok) {
          throw new Error(result.message || "Image upload failed");
        }
        return result.url;
      });
      const urls = await Promise.all(uploadPromises);
      setFormData((prev) => ({
        ...prev,
        images: [...(prev.images || []), ...urls],
      }));
    } catch (error) {
      setError((error as Error).message || "Image upload failed");
    } finally {
      setIsLoading(false);
      setIsDragActive(false);
    }
  };

  // Insert MDX snippet at cursor
  const insertAtCursor = (snippet: string) => {
    if (!textareaRef.current) return;
    const textarea = textareaRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const before = formData.content.slice(0, start);
    const after = formData.content.slice(end);
    const newContent = before + snippet + after;
    setFormData((prev) => ({ ...prev, content: newContent }));
    setActiveTab("content"); // Set tab first
    console.log("Set activeTab to content");
    setShowPalette(false);
    setSelectedComponent(null);
    setTimeout(() => {
      textarea.focus();
      textarea.selectionStart = textarea.selectionEnd = start + snippet.length;
    }, 0);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">New Project</h1>
          <p className="text-muted-foreground">
            Create a new portfolio project
          </p>
        </div>
        <div className="flex gap-4">
          <Link href="/dashboard/projects">
            <Button variant="outline">Cancel</Button>
          </Link>
          <Button onClick={handleSubmit} disabled={isLoading}>
            {isLoading ? "Creating..." : "Create Project"}
          </Button>
        </div>
      </div>

      {/* Form with tabs */}
      <form onSubmit={handleSubmit}>
        <Tabs
          defaultValue="basic"
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-4"
        >
          <TabsList className="grid grid-cols-4 w-full max-w-md">
            <TabsTrigger value="basic">Basic</TabsTrigger>
            <TabsTrigger value="content">Content</TabsTrigger>
            <TabsTrigger value="media">Media</TabsTrigger>
            <TabsTrigger value="links">Links</TabsTrigger>
          </TabsList>

          <TabsContent value="basic" className="space-y-4">
            <Card className="p-6">
              <div className="grid gap-6">
                <div className="grid gap-3">
                  <Label htmlFor="title">Project Title</Label>
                  <Input
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="My Awesome Project"
                    required
                    aria-invalid={!!validation.title}
                    aria-describedby={
                      validation.title ? "title-error" : undefined
                    }
                  />
                  {validation.title && (
                    <span id="title-error" className="text-red-600 text-xs">
                      {validation.title}
                    </span>
                  )}
                </div>

                <div className="grid gap-3">
                  <Label htmlFor="slug">URL Slug</Label>
                  <Input
                    id="slug"
                    name="slug"
                    value={formData.slug}
                    onChange={handleChange}
                    placeholder="my-awesome-project"
                    required
                    aria-invalid={!!validation.slug}
                    aria-describedby={
                      validation.slug ? "slug-error" : undefined
                    }
                  />
                  {validation.slug && (
                    <span id="slug-error" className="text-red-600 text-xs">
                      {validation.slug}
                    </span>
                  )}
                  <p className="text-xs text-muted-foreground">
                    This will be used in the project URL. Auto-generated from
                    title if left empty.
                  </p>
                </div>

                <div className="grid gap-3">
                  <Label htmlFor="summary">Summary</Label>
                  <Textarea
                    id="summary"
                    name="summary"
                    value={formData.summary}
                    onChange={handleChange}
                    placeholder="A brief description of your project"
                    required
                    rows={3}
                    aria-invalid={!!validation.summary}
                    aria-describedby={
                      validation.summary ? "summary-error" : undefined
                    }
                  />
                  {validation.summary && (
                    <span id="summary-error" className="text-red-600 text-xs">
                      {validation.summary}
                    </span>
                  )}
                  <p className="text-xs text-muted-foreground">
                    A short description of your project (150-160 characters
                    recommended).
                  </p>
                </div>

                <div className="grid gap-3">
                  <Label>Status</Label>
                  <Select
                    defaultValue={formData.status}
                    onValueChange={(value) =>
                      setFormData((prev) => ({ ...prev, status: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="published">Published</SelectItem>
                      <SelectItem value="archived">Archived</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="content" className="space-y-4">
            <Card className="p-6">
              <div className="grid gap-6">
                <div className="flex justify-between items-center mb-2">
                  <Label htmlFor="content">Content</Label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setShowPalette(true)}
                  >
                    + Insert Component
                  </Button>
                </div>
                <Textarea
                  id="content"
                  name="content"
                  value={formData.content}
                  onChange={handleChange}
                  placeholder="Project details in markdown/MDX format"
                  required
                  rows={15}
                  className="font-mono"
                  ref={textareaRef}
                  aria-invalid={!!validation.content}
                  aria-describedby={
                    validation.content ? "content-error" : undefined
                  }
                />
                {validation.content && (
                  <span id="content-error" className="text-red-600 text-xs">
                    {validation.content}
                  </span>
                )}
                <p className="text-xs text-muted-foreground">
                  Write your project content in MDX format. Supports markdown
                  and special components.
                </p>
                {/* Live Preview (optional, basic) */}
                <div className="mt-4">
                  <Label>Live Preview (MDX, experimental)</Label>
                  <div className="border rounded p-3 bg-zinc-50 dark:bg-zinc-900 min-h-[100px] text-sm">
                    {/* Real MDX rendering using @mdx-js/react */}
                    <MDXLivePreview mdxSource={formData.content} />
                  </div>
                </div>
              </div>
            </Card>
            {showPalette && (
              <ComponentPalette
                components={MDX_COMPONENTS}
                onSelect={(comp) => {
                  setSelectedComponent(comp);
                  setShowPalette(false);
                }}
                onClose={() => setShowPalette(false)}
              />
            )}
            {selectedComponent && (
              <ComponentPropForm
                component={selectedComponent}
                onInsert={insertAtCursor}
                onCancel={() => setSelectedComponent(null)}
              />
            )}
          </TabsContent>

          <TabsContent value="media" className="space-y-4">
            <Label htmlFor="image-upload">Project Images</Label>
            <div
              className={`border-2 border-dashed rounded p-4 text-center transition-colors ${
                isDragActive
                  ? "border-primary-500 bg-primary-50 dark:bg-zinc-800"
                  : "border-zinc-300 dark:border-zinc-700"
              }`}
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragActive(true);
              }}
              onDragLeave={() => setIsDragActive(false)}
              onDrop={handleImageUpload}
              tabIndex={0}
              aria-label="Drop images here to upload"
            >
              <Input
                id="image-upload"
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageUpload}
                disabled={isLoading}
                className="hidden"
              />
              <label htmlFor="image-upload" className="cursor-pointer block">
                {isLoading
                  ? "Uploading..."
                  : "Click or drag and drop images here (multiple supported)"}
              </label>
            </div>
            {formData.images && formData.images.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.images.map((img: string, idx: number) => (
                  <img
                    key={img + idx}
                    src={img}
                    alt={`Project image ${idx + 1}`}
                    className="w-24 h-24 object-cover rounded border"
                  />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="links" className="space-y-4">
            <Card className="p-6">
              <div className="grid gap-6">
                <div className="grid gap-3">
                  <MultiSelectAutocomplete
                    label="Technologies"
                    placeholder="Type or select technologies..."
                    fetchUrl="/api/technologies"
                    addUrl="/api/technologies"
                    value={formData.technologies}
                    onChange={(techs) =>
                      setFormData((prev) => ({ ...prev, technologies: techs }))
                    }
                  />
                  {validation.technologies && (
                    <span className="text-red-600 text-xs">
                      {validation.technologies}
                    </span>
                  )}
                  <p className="text-xs text-muted-foreground">
                    Select or add technologies used in this project.
                  </p>
                </div>
                <div className="grid gap-3">
                  <MultiSelectAutocomplete
                    label="Tags"
                    placeholder="Type or select tags..."
                    fetchUrl="/api/tags"
                    addUrl="/api/tags"
                    value={formData.tags}
                    onChange={(tags) =>
                      setFormData((prev) => ({ ...prev, tags }))
                    }
                  />
                  {validation.tags && (
                    <span className="text-red-600 text-xs">
                      {validation.tags}
                    </span>
                  )}
                  <p className="text-xs text-muted-foreground">
                    Select or add tags to categorize this project.
                  </p>
                </div>

                <div className="grid gap-3">
                  <Label htmlFor="demoUrl">Demo URL</Label>
                  <Input
                    id="demoUrl"
                    name="demoUrl"
                    value={formData.demoUrl}
                    onChange={handleChange}
                    placeholder="https://demo.example.com (optional)"
                    type="url"
                  />
                  <p className="text-xs text-muted-foreground">
                    Optional. Provide a live demo URL if available.
                  </p>
                </div>

                <div className="grid gap-3">
                  <Label htmlFor="sourceUrl">Source Code URL</Label>
                  <Input
                    id="sourceUrl"
                    name="sourceUrl"
                    value={formData.sourceUrl}
                    onChange={handleChange}
                    placeholder="https://github.com/username/repository"
                    type="url"
                  />
                </div>
              </div>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Show error or success messages */}
        {error && (
          <div className="p-2 bg-red-100 text-red-700 rounded mb-4">
            {error}
          </div>
        )}
        {success && (
          <div className="p-2 bg-green-100 text-green-700 rounded mb-4">
            Project created successfully!
          </div>
        )}

        <div className="mt-6 flex justify-end gap-4">
          <Link href="/dashboard/projects">
            <Button variant="outline">Cancel</Button>
          </Link>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Creating..." : "Create Project"}
          </Button>
        </div>
      </form>
    </div>
  );
}
