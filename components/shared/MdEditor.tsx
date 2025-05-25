/**
 * @file components/shared/MdEditor.tsx
 * @description Reusable MDX editor with write/preview tabs, AI toolbar, formatting hook, and plugin slots.
 */
import React, {
  useState,
  useEffect,
  forwardRef,
  ReactNode,
  useRef,
} from "react";
import dynamic from "next/dynamic";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { MDXLivePreview } from "@/components/MDXLivePreview";
import type { MdEditorProps } from "@/types/md-editor";
import {
  CustomMdxComponent,
  AVAILABLE_MDX_COMPONENTS,
} from "@/types/custom-mdx-components";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Code, PlusCircle, Eye, Pencil, Sparkles, Loader2 } from "lucide-react";
import { MdxContent } from "@/components/shared/MdxContent";
import { cn } from "@/lib/utils";
import { Textarea } from "@/components/ui/textarea"; // Import TextareaProps
import { ScrollArea } from "@/components/ui/scroll-area";

/**
 * MdEditor component providing MDX editing and live preview functionality.
 */
const MdEditor = forwardRef<unknown, MdEditorProps>(
  (
    {
      value,
      onChange,
      initialValue,
      mode,
      toolbarConfig,
      renderPreview,
      onFormat,
      onReset,
      onDelete,
      className,
      editorRef, // This ref is for the editor instance, not specifically the textarea
      onAIClick, // Use this for AI actions if available
    },
    ref
  ) => {
    const internalTextareaRef = React.useRef<HTMLTextAreaElement>(null);
    const textareaRef = internalTextareaRef; // Use internal ref

    const [activeTab, setActiveTab] = React.useState("edit");
    const [content, setContent] = useState<string>(value);
    const [isLoadingInitial, setIsLoadingInitial] = useState<boolean>(false);
    // Track AI task loading states
    const [loadingTasks, setLoadingTasks] = useState<Record<string, boolean>>(
      {}
    );

    // If an external editorRef is provided, we can expose methods through it if needed.
    // For now, we primarily use the internal textareaRef for direct manipulations.
    React.useImperativeHandle(editorRef, () => ({
      // Expose any editor-level methods here if necessary
      // e.g., focusEditor: () => textareaRef.current?.focus(),
    }));

    // Load initial value in edit mode
    useEffect(() => {
      if (initialValue) {
        setIsLoadingInitial(true);
        Promise.resolve(initialValue)
          .then((val) => setContent(val))
          .finally(() => setIsLoadingInitial(false));
      }
    }, [initialValue]);

    // Handle content change
    const handleChange = (newValue: string | undefined) => {
      const updated = newValue ?? "";
      setContent(updated);
      onChange(updated);
    };

    // Placeholder for format action
    const handleFormat = async () => {
      if (onFormat) {
        const formatted = await onFormat(content);
        setContent(formatted);
        onChange(formatted);
      }
    };

    // Handler for AI toolbar tasks
    const handleAITask = async (taskIdentifier: string) => {
      if (!onAIClick) return;
      setLoadingTasks((prev) => ({ ...prev, [taskIdentifier]: true }));
      try {
        const generated = await onAIClick(taskIdentifier);
        setContent(generated);
        onChange(generated);
      } finally {
        setLoadingTasks((prev) => ({ ...prev, [taskIdentifier]: false }));
      }
    };

    const handleMdxComponentInsert = (component: CustomMdxComponent) => {
      if (textareaRef.current) {
        const { selectionStart, selectionEnd } = textareaRef.current;
        const currentValue = textareaRef.current.value;

        // Replace {{cursor}} with an empty string for now, or handle cursor positioning
        const snippetToInsert = component.snippet.replace("{{cursor}}", "");

        const newValue =
          currentValue.substring(0, selectionStart) +
          snippetToInsert +
          currentValue.substring(selectionEnd);

        onChange(newValue);

        // Focus and set cursor position after insertion (basic example)
        // More sophisticated cursor positioning would require calculating the length of the inserted snippet
        // and the position of {{cursor}} if it were used.
        setTimeout(() => {
          if (textareaRef.current) {
            const newCursorPosition = selectionStart + snippetToInsert.length;
            textareaRef.current.focus();
            textareaRef.current.setSelectionRange(
              newCursorPosition,
              newCursorPosition
            );
          }
        }, 0);
      }
    };

    const defaultRenderPreview = (mdxContent: string) => (
      <ScrollArea className="h-full w-full rounded-md border p-4 md-editor-preview-pane">
        <MdxContent code={mdxContent} />
      </ScrollArea>
    );

    return (
      <div className={cn("flex flex-col", className)}>
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="flex-1 flex flex-col min-h-0"
        >
          <div className="flex items-center justify-between p-2 border-b bg-muted/40">
            <TabsList className="grid grid-cols-2 w-auto h-8">
              <TabsTrigger value="edit" className="h-6 text-xs px-2">
                <Pencil className="mr-1 h-3 w-3" /> Edit
              </TabsTrigger>
              <TabsTrigger value="preview" className="h-6 text-xs px-2">
                <Eye className="mr-1 h-3 w-3" /> Preview
              </TabsTrigger>
            </TabsList>

            <div className="flex items-center gap-1">
              {/* AI Button - Placeholder for now, needs integration with onAIClick and toolbarConfig */}
              {onAIClick &&
                toolbarConfig?.generateSummary /* Example usage */ && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={async () => {
                      // Basic AI click handling, actual implementation might be more complex
                      const generatedText = await onAIClick("generateSummary");
                      // For simplicity, appending to current content.
                      // A more robust solution would insert at cursor or replace selection.
                      if (textareaRef.current) {
                        const currentVal = textareaRef.current.value;
                        const newCursorPos = textareaRef.current.selectionStart;
                        onChange(
                          currentVal.substring(0, newCursorPos) +
                            generatedText +
                            currentVal.substring(newCursorPos)
                        );
                        setTimeout(() => {
                          textareaRef.current?.focus();
                          textareaRef.current?.setSelectionRange(
                            newCursorPos + generatedText.length,
                            newCursorPos + generatedText.length
                          );
                        }, 0);
                      }
                    }}
                    className="text-xs h-7 px-2 py-1"
                  >
                    <Sparkles className="mr-1 h-3 w-3 text-yellow-400" />
                    AI Summary
                  </Button>
                )}

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-xs h-7 px-2 py-1"
                  >
                    <PlusCircle className="mr-1 h-3 w-3" /> Insert Component
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>MDX Components</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {AVAILABLE_MDX_COMPONENTS.map((component) => (
                    <DropdownMenuItem
                      key={component.label}
                      onClick={() => handleMdxComponentInsert(component)}
                      title={component.description}
                    >
                      <Code size={14} className="mr-2" /> {component.label}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          <TabsContent
            value="edit"
            className="flex-1 py-0 focus-visible:ring-0 focus-visible:ring-offset-0"
          >
            <Textarea
              ref={textareaRef}
              value={value}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                onChange(e.target.value)
              } // Added explicit type for e
              placeholder="Start typing your markdown content..."
              className="h-full w-full resize-none border-0 rounded-none focus-visible:ring-0 focus-visible:ring-offset-0 p-4 text-base"
            />
          </TabsContent>
          <TabsContent
            value="preview"
            className="flex-1 p-0 border-t overflow-y-auto md-editor-preview-pane"
          >
            {renderPreview
              ? renderPreview({ mdx: value })
              : defaultRenderPreview(value)}
          </TabsContent>
        </Tabs>
        {/* Reset/Delete actions in edit mode */}
        {mode === "edit" && (
          <div className="flex gap-2 mt-4">
            {onReset && (
              <button type="button" className="btn-secondary" onClick={onReset}>
                Reset
              </button>
            )}
            {onDelete && (
              <button type="button" className="btn-danger" onClick={onDelete}>
                Delete
              </button>
            )}
          </div>
        )}
      </div>
    );
  }
);

MdEditor.displayName = "MdEditor";
export default MdEditor;
