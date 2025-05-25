/**
 * Base Tag type.
 * @property name - Unique tag name
 * @property color - Optional color (hex or CSS string)
 * @property _id - Optional database ID
 */
export interface BaseTag {
  _id?: string; // Added optional _id
  name: string;
  color?: string | null;
}

/**
 * Tag type specific to Blog posts.
 */
export interface BlogTag extends BaseTag {}

/**
 * Tag type specific to Projects.
 */
export interface ProjectTag extends BaseTag {}

// Re-exporting the original generic Tag for now to minimize immediate breaking changes.
// Consider removing this if all usages are updated to specific tags.
/**
 * @deprecated Use BlogTag or ProjectTag instead.
 */
export type Tag = BaseTag;
