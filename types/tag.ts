/**
 * Tag type for project categorization.
 * @property name - Unique tag name
 * @property color - Optional color (hex or CSS string)
 */
export interface Tag {
  name: string;
  color?: string | null;
}
