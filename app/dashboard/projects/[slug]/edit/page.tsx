// app/dashboard/projects/[slug]/edit/page.tsx
"use client"; // This page uses client-side hooks (useRouter, useState for AlertDialog)
import React, { useEffect, useState } from "react";
import { notFound, useRouter } from "next/navigation";
import { ProjectForm } from "@/components/projects/ProjectForm";
import { getProjectBySlug } from "@/lib/api/projects";
import type { Project } from "@/types/project";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";

interface EditProjectPageProps {
  params: Promise<{ slug: string }>;
}

/**
 * EditProjectPage - Edit form for an existing project, prefilled with current data.
 * Also includes a delete button with confirmation.
 * @param params - dynamic route params with project slug promise
 */
const EditProjectPage = function ({
  // Removed async
  params,
}: EditProjectPageProps): JSX.Element {
  const router = useRouter();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentSlug, setCurrentSlug] = useState<string | null>(null); // State for resolved slug

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setError(null); // Reset error on new load
      try {
        const { slug: resolvedSlug } = await params; // Resolve params promise here
        setCurrentSlug(resolvedSlug);

        if (resolvedSlug) {
          const fetchedProject = await getProjectBySlug(resolvedSlug);
          if (!fetchedProject) {
            setError("Project not found.");
            // In a client component, we can't call notFound() directly after initial render.
            // We'll show an error message and allow navigation.
          } else {
            setProject(fetchedProject);
          }
        } else {
          setError("Slug could not be determined.");
        }
      } catch (e) {
        console.error("Failed to load project data or resolve slug:", e);
        setError("Failed to load project data.");
      }
      setLoading(false);
    };

    loadData();
  }, [params]); // Depend on the params promise

  const handleDeleteProject = async (): Promise<void> => {
    if (!project || !currentSlug) {
      // Use currentSlug
      toast.error("Cannot delete project: data missing.");
      return;
    }
    try {
      const response = await fetch(`/api/projects/${currentSlug}`, {
        // Use currentSlug
        method: "DELETE",
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to delete project");
      }
      toast.success("Project deleted successfully!");
      router.push("/dashboard/projects");
    } catch (error) {
      console.error("Error deleting project:", error);
      toast.error(
        error instanceof Error ? error.message : "An unknown error occurred."
      );
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto py-10 text-center">
        Loading project data...
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-10 text-center text-red-500">
        <p>{error}</p>
        <Button
          onClick={() => router.push("/dashboard/projects")}
          className="mt-4"
        >
          Back to Projects
        </Button>
      </div>
    );
  }

  if (!project) {
    // This case should ideally be handled by the error state after the notFound logic change
    // but as a fallback:
    return (
      <div className="container mx-auto py-10 text-center">
        Project data could not be loaded or project does not exist.
        <Button
          onClick={() => router.push("/dashboard/projects")}
          className="mt-4"
        >
          Back to Projects
        </Button>
      </div>
    );
  }

  return (
    // Remove container and mx-auto to allow full width
    <div className="py-10">
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-3xl font-bold">Edit Project: {project.title}</h1>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive">Delete Project</Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the
                project "<strong>{project.title}</strong>" and remove its data
                from our servers.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleDeleteProject}>
                Continue
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>

      <ProjectForm
        mode="edit"
        initialData={project}
        projectId={project._id} // Assuming project object has _id
        projectSlug={currentSlug || undefined} // Pass resolved slug, ensure undefined if null
      />
    </div>
  );
};

export default EditProjectPage;
