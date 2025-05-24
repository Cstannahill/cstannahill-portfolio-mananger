import type { Project } from "@/types/project"; // Import the Project type

export async function getProjectBySlug(slug: string): Promise<Project | null> {
  // Always use NEXT_PUBLIC_API_URL for server fetches
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
  const url = `${baseUrl.replace(/\/$/, "")}/api/projects/${slug}`;

  const res = await fetch(url);

  // Defensive: check content-type and status
  const contentType = res.headers.get("content-type") || "";
  if (!res.ok) {
    if (res.status === 404) return null; // Handle not found gracefully
    let errorText = await res.text();
    // Try to parse error as JSON, fallback to text
    try {
      const errorJson = JSON.parse(errorText);
      errorText = errorJson.message || errorText;
    } catch {}
    throw new Error(`Failed to fetch project (${res.status}): ${errorText}`);
  }

  if (!contentType.includes("application/json")) {
    const text = await res.text();
    throw new Error(
      `Expected JSON but got: ${contentType}. Response: ${text.slice(0, 200)}`
    );
  }

  const { data } = await res.json();
  return data as Project; // Assert data as Project type
}
