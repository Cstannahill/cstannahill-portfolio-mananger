/**
 * Base Technology type used in projects.
 * @property name - Name of the technology (e.g., "React", "Node.js")
 * @property category - Category of the technology (e.g., "frontend", "backend", "database")
 * @property version - Optional version string (e.g., "18.2.0")
 * @property icon - Optional icon name or URL for display
 * @property role - Optional role in the project (e.g., "Primary Framework", "State Management")
 */
export interface BaseTechnology {
  name: string;
  category?:
    | "frontend"
    | "backend"
    | "database"
    | "devops"
    | "mobile"
    | "testing"
    | "other";
  version?: string;
  icon?: string; // Added from previous changes
  role?: string; // Added from previous changes
}

/**
 * Technology type specific to Projects.
 */
export interface ProjectTechnology extends BaseTechnology {}

// Re-exporting the original generic Technology for now.
// Consider removing this if all usages are updated to ProjectTechnology.
/**
 * @deprecated Use ProjectTechnology instead.
 */
export type Technology = ProjectTechnology;
