"use client";

import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { Tag } from "@/types/tag";
import type { Technology } from "@/types/technology";
import { toast } from "sonner";

// Union type for Tag or Technology
export type Option = Tag | Technology;

interface MultiSelectAutocompleteProps {
  label: string;
  placeholder: string;
  fetchUrl: string;
  addUrl: string;
  value: Option[];
  onChange: (value: Option[]) => void;
  allowAdd?: boolean;
}

/**
 * Multi-select autocomplete for tags/technologies.
 * @param label - Field label
 * @param placeholder - Input placeholder
 * @param fetchUrl - API endpoint to fetch options
 * @param addUrl - API endpoint to add new option
 * @param value - Selected options
 * @param onChange - Change handler
 * @param allowAdd - Allow adding new options
 */
export const MultiSelectAutocomplete: React.FC<
  MultiSelectAutocompleteProps
> = ({
  label,
  placeholder,
  fetchUrl,
  addUrl,
  value,
  onChange,
  allowAdd = true,
}) => {
  const [options, setOptions] = useState<Option[]>([]);
  const [input, setInput] = useState<string>("");
  const [filtered, setFiltered] = useState<Option[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null); // Clear previous errors
    fetch(fetchUrl)
      .then(async (res) => {
        if (!res.ok) {
          // Try to parse a JSON error response
          try {
            const errorData = await res.json();
            throw new Error(
              errorData.message ||
                `Failed to load options: ${res.status}`
            );
          } catch (parseError) {
            // Fallback if response is not JSON or message is not present
            throw new Error(
              `Failed to load options: ${res.status} ${res.statusText}`
            );
          }
        }
        return res.json();
      })
      .then((data) => {
        // Assuming the API returns { success: boolean, data: Option[] }
        // or just Option[] directly. Adjust based on your actual API structure.
        if (data && Array.isArray(data)) {
          // Direct array
          setOptions(data);
        } else if (data && data.success && Array.isArray(data.data)) {
          // Wrapped response
          setOptions(data.data);
        } else {
          // Handle cases where data is not in the expected format
          console.error("Fetched data is not in the expected format:", data);
          throw new Error("Received malformed data from server.");
        }
      })
      .catch((err: Error) => {
        // Catch any error from the promise chain
        console.error("Error fetching options:", err);
        setError(
          err.message || "An unknown error occurred while fetching options."
        );
      })
      .finally(() => setLoading(false));
  }, [fetchUrl]);

  useEffect(() => {
    setFiltered(
      options?.filter(
        (opt) =>
          opt?.name?.toLowerCase()?.includes(input?.toLowerCase()) &&
          !value?.some((v) => v?.name === opt?.name)
      )
    );
  }, [input, options, value]);

  const handleAdd = async () => {
    if (!input.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(addUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: input.trim(), color: null }), // Assuming color can be null or handled by API
      });
      if (!res.ok) {
        let errorMessage = "Failed to add new option.";
        try {
          const result = await res.json();
          errorMessage =
            result.message ||
            `Failed to add: ${res.status} ${res.statusText}`;
        } catch (e) {
          // If error response is not JSON, use status text
          errorMessage = `Failed to add: ${res.status} ${res.statusText}`;
        }
        setError(errorMessage);
        toast.error("Failed to add option", { description: errorMessage });
        return;
      }
      // Assuming the API returns the newly created option directly
      // or a success response with the new option in `data`
      const newOptionResponse = await res.json();
      let newOptionToAdd: Option;

      if (newOptionResponse && newOptionResponse.success) {
        newOptionToAdd = newOptionResponse.data as Option;
      } else if (newOptionResponse && newOptionResponse.name) {
        newOptionToAdd = newOptionResponse as Option;
      } else {
        console.error(
          "Add option response is not in the expected format:",
          newOptionResponse
        );
        throw new Error("Received malformed data after adding option.");
      }

      setOptions((prev) => [...prev, newOptionToAdd]);
      onChange([...value, newOptionToAdd]);
      setInput("");
      toast.success(`Option "${newOptionToAdd.name}" added successfully.`);
    } catch (e: any) {
      console.error("Error in handleAdd:", e);
      const errorMessage =
        e.message ||
        "An unexpected error occurred while adding the option.";
      setError(errorMessage);
      toast.error("Error adding option", { description: errorMessage });
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = (opt: Option) => {
    onChange([...value, opt]);
    setInput("");
  };

  const handleRemove = (name: string) => {
    onChange(value.filter((v) => v.name !== name));
  };

  return (
    <div className="space-y-2">
      <label className="font-medium">{label}</label>
      <div className="flex flex-wrap gap-2 mb-1">
        {value.map((opt) => (
          <Badge key={opt.name} className="flex items-center gap-1">
            {opt.name}
            <button
              type="button"
              aria-label={`Remove ${opt.name}`}
              className="ml-1 text-xs text-red-500 hover:text-red-700 focus:outline-none"
              onClick={() => handleRemove(opt.name)}
            >
              ×
            </button>
          </Badge>
        ))}
      </div>
      <div className="relative">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={placeholder}
          aria-label={label}
          disabled={loading}
          className="bg-white dark:bg-zinc-900 dark:text-zinc-100 border dark:border-zinc-700 focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400"
          onKeyDown={(e) => {
            if (e.key === "Enter" && allowAdd && input.trim()) {
              e.preventDefault();
              handleAdd();
            }
          }}
        />
        {input && filtered.length > 0 && (
          <ul className="absolute z-10 bg-white dark:bg-zinc-900 border dark:border-zinc-700 rounded w-full mt-1 max-h-40 overflow-auto shadow-lg dark:shadow-zinc-900">
            {filtered.map((opt) => (
              <li
                key={opt.name}
                className="px-3 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-zinc-800 text-zinc-900 dark:text-zinc-100"
                onClick={() => handleSelect(opt)}
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSelect(opt);
                }}
                role="option"
                aria-selected={false}
              >
                {opt.name}
              </li>
            ))}
          </ul>
        )}
      </div>
      {allowAdd &&
        input &&
        !filtered.some((o) => o.name === input) &&
        !options.some((o) => o.name === input) && (
          <Button
            type="button"
            size="sm"
            onClick={handleAdd}
            disabled={loading}
          >
            Add "{input}"
          </Button>
        )}
      {error && <div className="text-xs text-red-600">{error}</div>}
    </div>
  );
};
