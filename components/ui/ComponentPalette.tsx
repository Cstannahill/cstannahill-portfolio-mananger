import React from "react";

export interface MDXComponentConfig {
  name: string;
  label: string;
  props: Array<{
    name: string;
    label: string;
    type: "string" | "number" | "boolean" | "array" | "enum";
    required?: boolean;
    options?: string[]; // for enum
    description?: string;
  }>;
  hasChildren?: boolean;
  example?: string;
}

interface ComponentPaletteProps {
  components: MDXComponentConfig[];
  onSelect: (component: MDXComponentConfig) => void;
  onClose: () => void;
}

export const ComponentPalette: React.FC<ComponentPaletteProps> = ({
  components,
  onSelect,
  onClose,
}) => {
  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">
      <div className="bg-white dark:bg-zinc-900 rounded-lg shadow-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold">Insert Component</h2>
          <button
            onClick={onClose}
            className="text-zinc-500 hover:text-zinc-900"
          >
            ✕
          </button>
        </div>
        <ul className="space-y-2 max-h-80 overflow-y-auto">
          {components.map((comp) => (
            <li key={comp.name}>
              <button
                className="w-full text-left px-3 py-2 rounded hover:bg-zinc-100 dark:hover:bg-zinc-800"
                onClick={() => onSelect(comp)}
              >
                <span className="font-mono font-semibold">{`<${comp.name} />`}</span>
                <span className="ml-2 text-sm text-zinc-500">{comp.label}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
