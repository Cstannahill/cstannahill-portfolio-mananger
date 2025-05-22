import React, { useState } from "react";
import type { MDXComponentConfig } from "./ComponentPalette";
import { ICON_OPTIONS } from "@/lib/mdx/iconOptions";

interface ComponentPropFormProps {
  component: MDXComponentConfig;
  onInsert: (mdx: string) => void;
  onCancel: () => void;
}

// Add a list of icons for the Callout icon select

export const ComponentPropForm: React.FC<ComponentPropFormProps> = ({
  component,
  onInsert,
  onCancel,
}) => {
  const [values, setValues] = useState<Record<string, unknown>>({});
  const [children, setChildren] = useState("");
  const [iconSearch, setIconSearch] = useState("");
  const [iconDropdownOpen, setIconDropdownOpen] = useState(false);

  const handleChange = (name: string, value: unknown) => {
    setValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    // Build MDX string
    const propStr = component.props
      .map((p) => {
        const v = values[p.name];
        if (v === undefined || v === "") return null;
        if (p.type === "string") return `${p.name}="${v}"`;
        if (p.type === "number") return `${p.name}={${v}}`;
        if (p.type === "boolean") return `${p.name}={${v}}`;
        if (p.type === "array") return `${p.name}={${JSON.stringify(v)}}`;
        if (p.type === "enum") return `${p.name}="${v}"`;
        return null;
      })
      .filter(Boolean)
      .join(" ");
    const open = `<${component.name}${propStr ? " " + propStr : ""}>`;
    const close = `</${component.name}>`;
    const mdx = component.hasChildren
      ? `${open}
${children}
${close}`
      : open;
    onInsert(mdx);
  };

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">
      <div
        className="bg-white dark:bg-zinc-900 rounded-lg shadow-lg p-6 w-full max-w-md"
        role="dialog"
        aria-modal="true"
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold">{`<${component.name} />`} Props</h2>
          <button
            type="button"
            onClick={onCancel}
            className="text-zinc-500 hover:text-zinc-900 dark:hover:text-white"
          >
            ✕
          </button>
        </div>
        <div className="space-y-4">
          {component.props.map((p) => (
            <div key={p.name}>
              <label className="block font-medium mb-1">{p.label}</label>
              {/* Custom icon select for Callout icon */}
              {component.name === "Callout" && p.name === "icon" ? (
                <div className="relative">
                  <input
                    type="text"
                    className="w-full border rounded px-2 py-1 bg-white dark:bg-zinc-800 text-black dark:text-white"
                    placeholder="Search icon (e.g. lightb, info, star)"
                    value={iconSearch}
                    onChange={(e) => {
                      setIconSearch(e.target.value);
                      setIconDropdownOpen(true);
                    }}
                    onFocus={() => setIconDropdownOpen(true)}
                    onBlur={() =>
                      setTimeout(() => setIconDropdownOpen(false), 150)
                    }
                  />
                  {iconDropdownOpen && (
                    <div className="absolute z-10 w-full bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded mt-1 max-h-32 overflow-y-auto">
                      {ICON_OPTIONS.filter(
                        (opt) =>
                          opt.label
                            .toLowerCase()
                            .includes(iconSearch.toLowerCase()) ||
                          opt.value.includes(iconSearch)
                      ).map((opt) => (
                        <button
                          type="button"
                          key={opt.value}
                          className="w-full text-left px-3 py-2 hover:bg-zinc-100 dark:hover:bg-zinc-700 flex items-center gap-2"
                          onClick={() => {
                            handleChange(p.name, opt.value);
                            setIconSearch("");
                            setIconDropdownOpen(false);
                          }}
                        >
                          <span>{opt.value}</span>
                          <span className="text-xs text-zinc-500">
                            {opt.label}
                          </span>
                        </button>
                      ))}
                    </div>
                  )}
                  <div className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                    Selected: {(values[p.name] as string) || "None"}
                  </div>
                </div>
              ) : p.type === "string" ? (
                <input
                  type="text"
                  className="w-full border rounded px-2 py-1 bg-white dark:bg-zinc-800 text-black dark:text-white"
                  value={(values[p.name] as string) || ""}
                  onChange={(e) => handleChange(p.name, e.target.value)}
                  required={p.required}
                  placeholder={p.description}
                />
              ) : p.type === "number" ? (
                <input
                  type="number"
                  className="w-full border rounded px-2 py-1 bg-white dark:bg-zinc-800 text-black dark:text-white"
                  value={(values[p.name] as number) || ""}
                  onChange={(e) => handleChange(p.name, Number(e.target.value))}
                  required={p.required}
                  placeholder={p.description}
                />
              ) : p.type === "boolean" ? (
                <select
                  className="w-full border rounded px-2 py-1 bg-white dark:bg-zinc-800 text-black dark:text-white"
                  value={(values[p.name] as string) || ""}
                  onChange={(e) =>
                    handleChange(p.name, e.target.value === "true")
                  }
                  required={p.required}
                >
                  <option value="">Select...</option>
                  <option value="true">True</option>
                  <option value="false">False</option>
                </select>
              ) : p.type === "array" ? (
                <input
                  type="text"
                  className="w-full border rounded px-2 py-1 bg-white dark:bg-zinc-800 text-black dark:text-white"
                  value={
                    Array.isArray(values[p.name])
                      ? (values[p.name] as string[]).join(", ")
                      : ""
                  }
                  onChange={(e) =>
                    handleChange(
                      p.name,
                      e.target.value.split(",").map((s) => s.trim())
                    )
                  }
                  required={p.required}
                  placeholder="Comma-separated values"
                />
              ) : p.type === "enum" && p.options ? (
                <select
                  className="w-full border rounded px-2 py-1 bg-white dark:bg-zinc-800 text-black dark:text-white"
                  value={(values[p.name] as string) || ""}
                  onChange={(e) => handleChange(p.name, e.target.value)}
                  required={p.required}
                >
                  <option value="">Select...</option>
                  {p.options.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              ) : null}
              {p.description && (
                <div className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                  {p.description}
                </div>
              )}
            </div>
          ))}
          {component.hasChildren && (
            <div>
              <label className="block font-medium mb-1">
                Children (MDX content)
              </label>
              <textarea
                className="w-full border rounded px-2 py-1 font-mono bg-white dark:bg-zinc-800 text-black dark:text-white"
                rows={4}
                value={children}
                onChange={(e) => setChildren(e.target.value)}
                placeholder="Content between opening and closing tags"
              />
            </div>
          )}
          <div className="mt-6 flex justify-end gap-2">
            <button
              type="button"
              onClick={onCancel}
              className="px-3 py-1 rounded border dark:border-zinc-700 dark:text-white"
            >
              Cancel
            </button>
            <button
              type="button"
              className="px-3 py-1 rounded bg-primary-600 text-white"
              onClick={handleSubmit}
            >
              Insert
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
