/**
 * Technology type for project stack.
 * @property name - Unique technology name
 * @property color - Optional color (hex or CSS string)
 * @property icon - Optional icon (URL or file path)
 * @property role - Optional role description
 */
export interface Technology {
  name: string;
  color?: string | null;
  icon?: string; // Optional icon (URL or file path)
  role?: string; // Optional role description
}
