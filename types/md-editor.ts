/**
 * @file types/md-editor.ts
 * @description Type definitions for the reusable MdEditor component.
 */

import type { ReactNode, Ref } from "react";

/**
 * Describes the mode of the editor.
 */
export type MdEditorMode = "create" | "edit";

/**
 * Configuration for which AI toolbar buttons to display.
 */
export interface ToolbarConfig {
  /** Enable the "Generate Title" button */
  generateTitle?: boolean;
  /** Enable the "Generate Summary/Excerpt" button */
  generateSummary?: boolean;
  /** Enable custom section generation buttons keyed by section identifier */
  generateSections?: Record<string, boolean>;
  /** Additional custom toolbar items (e.g., image upload, tag insert) */
  customItems?: ReactNode[];
}

/**
 * Props for the MdEditor component.
 * @param value Current MDX content string
 * @param onChange Callback invoked when content changes
 * @param initialValue Initial MDX content or Promise resolving to content in edit mode
 * @param mode Editor mode, either 'create' or 'edit'
 * @param toolbarConfig Configuration for AI toolbar buttons and custom items
 * @param renderPreview Optional custom preview renderer (defaults to MDXLivePreview)
 * @param onFormat Formatting function invoked before save
 * @param onReset Optional callback for reset actions in edit mode
 * @param onDelete Optional callback for delete actions in edit mode
 * @param className Optional className for styling
 */
export interface MdEditorProps {
  value: string;
  onChange: (updated: string) => void;
  initialValue?: string | Promise<string>;
  mode: MdEditorMode;
  toolbarConfig?: ToolbarConfig;
  renderPreview?: (params: { mdx: string }) => ReactNode;
  onFormat?: (raw: string) => Promise<string>;
  onReset?: () => void;
  onDelete?: () => Promise<void>;
  className?: string;
  /**
   * Expose ref for parent components to call internal methods (e.g., reset, delete)
   */
  editorRef?: Ref<any>;
  /**
   * Callback for AI generation tasks. Receives a task identifier and returns generated text.
   */
  onAIClick?: (taskIdentifier: string) => Promise<string>;
}
