import type {
  Project,
  ProjectFilters,
  ProjectFormInput,
} from "@/types/project"; // Import the Project type
import type {
  ApiError,
  MutationApiResponse,
  PaginatedApiResponse,
  SingleItemApiResponse,
} from "@/types/api"; // Added

const API_BASE_URL = "/api/projects"; // Added

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

/**
 * Fetches a list of projects based on the provided filters.
 *
 * @param {ProjectFilters} filters - The filters to apply to the project list.
 * @returns {Promise<PaginatedApiResponse<Project>>} A promise that resolves to the paginated list of projects.
 * @throws {Error} If the fetch operation fails or the API returns an error.
 */
export const fetchProjects = async (
  filters: ProjectFilters = {}
): Promise<PaginatedApiResponse<Project>> => {
  const queryParams = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      queryParams.append(key, String(value));
    }
  });

  const response = await fetch(`${API_BASE_URL}?${queryParams.toString()}`);

  if (!response.ok) {
    try {
      const errorData: ApiError = await response.json();
      throw new Error(
        errorData.message ||
          `Failed to fetch projects. Status: ${response.status}`
      );
    } catch (e: any) {
      throw new Error(
        `Failed to fetch projects. Status: ${response.status}. ${e.message || "Could not parse error response."}`
      );
    }
  }
  return response.json() as Promise<PaginatedApiResponse<Project>>;
};

/**
 * Fetches a single project by its ID or slug.
 * Note: This is different from getProjectBySlug which might have specific server-side fetch logic.
 * This function assumes a client-side fetch to the same API_BASE_URL.
 *
 * @param {string} identifier - The ID or slug of the project.
 * @returns {Promise<SingleItemApiResponse<Project>>} A promise that resolves to the project details.
 * @throws {Error} If the fetch operation fails, the project is not found, or the API returns an error.
 */
export const fetchProjectByIdentifier = async (
  identifier: string
): Promise<SingleItemApiResponse<Project>> => {
  if (!identifier) {
    throw new Error("Project identifier (ID or slug) is required.");
  }
  const response = await fetch(`${API_BASE_URL}/${identifier}`);

  if (!response.ok) {
    try {
      const errorData: ApiError = await response.json();
      throw new Error(
        errorData.message ||
          `Failed to fetch project ${identifier}. Status: ${response.status}`
      );
    } catch (e: any) {
      throw new Error(
        `Failed to fetch project ${identifier}. Status: ${response.status}. ${e.message || "Could not parse error response."}`
      );
    }
  }
  return response.json() as Promise<SingleItemApiResponse<Project>>;
};

/**
 * Creates a new project.
 *
 * @param {ProjectFormInput} newProjectData - The data for the new project.
 * @returns {Promise<SingleItemApiResponse<Project>>} A promise that resolves to the created project details.
 * @throws {Error} If the creation fails or the API returns an error.
 */
export const createProject = async (
  newProjectData: ProjectFormInput
): Promise<SingleItemApiResponse<Project>> => {
  const response = await fetch(API_BASE_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(newProjectData),
  });

  if (!response.ok) {
    try {
      const errorData: ApiError = await response.json();
      throw new Error(
        errorData.message ||
          `Failed to create project. Status: ${response.status}`
      );
    } catch (e: any) {
      throw new Error(
        `Failed to create project. Status: ${response.status}. ${e.message || "Could not parse error response."}`
      );
    }
  }
  return response.json() as Promise<SingleItemApiResponse<Project>>;
};

/**
 * Updates an existing project.
 *
 * @param {string} projectId - The ID of the project to update.
 * @param {Partial<ProjectFormInput>} updatedProjectData - The data to update the project with.
 * @returns {Promise<SingleItemApiResponse<Project>>} A promise that resolves to the updated project details.
 * @throws {Error} If the update fails or the API returns an error.
 */
export const updateProject = async (
  projectId: string,
  updatedProjectData: Partial<ProjectFormInput>
): Promise<SingleItemApiResponse<Project>> => {
  if (!projectId) {
    throw new Error("Project ID is required for updating.");
  }
  const response = await fetch(`${API_BASE_URL}/${projectId}`, {
    method: "PATCH", // Or PUT, depending on your API design
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(updatedProjectData),
  });

  if (!response.ok) {
    try {
      const errorData: ApiError = await response.json();
      throw new Error(
        errorData.message ||
          `Failed to update project ${projectId}. Status: ${response.status}`
      );
    } catch (e: any) {
      throw new Error(
        `Failed to update project ${projectId}. Status: ${response.status}. ${e.message || "Could not parse error response."}`
      );
    }
  }
  return response.json() as Promise<SingleItemApiResponse<Project>>;
};

/**
 * Deletes a project by its ID.
 *
 * @param {string} projectId - The ID of the project to delete.
 * @returns {Promise<MutationApiResponse>} A promise that resolves when the project is successfully deleted.
 * @throws {Error} If the deletion fails or the API returns an error.
 */
export const deleteProject = async (
  projectId: string
): Promise<MutationApiResponse> => {
  if (!projectId) {
    throw new Error("Project ID is required for deletion.");
  }
  const response = await fetch(`${API_BASE_URL}/${projectId}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    try {
      const errorData: ApiError = await response.json();
      throw new Error(
        errorData.message ||
          `Failed to delete project ${projectId}. Status: ${response.status}`
      );
    } catch (e: any) {
      throw new Error(
        `Failed to delete project ${projectId}. Status: ${response.status}. ${e.message || "Could not parse error response."}`
      );
    }
  }
  if (response.status === 204) {
    // No Content
    return { message: "Project deleted successfully" };
  }
  return response.json() as Promise<MutationApiResponse>;
};
