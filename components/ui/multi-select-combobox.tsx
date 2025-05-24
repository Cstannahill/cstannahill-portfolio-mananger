"use client";

import * as React from "react";
import { Check, ChevronsUpDown, X } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";

export interface ComboboxOption {
  value: string;
  label: string;
}

interface MultiSelectComboboxProps {
  options: ComboboxOption[];
  selectedValues: string[];
  onChange: (selected: string[]) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

export const MultiSelectCombobox: React.FC<MultiSelectComboboxProps> = ({
  options,
  selectedValues,
  onChange,
  placeholder = "Select options...",
  disabled,
  className,
}) => {
  const [open, setOpen] = React.useState(false);

  const handleSelect = (value: string) => {
    const newSelectedValues = selectedValues.includes(value)
      ? selectedValues.filter((v) => v !== value)
      : [...selectedValues, value];
    onChange(newSelectedValues);
  };

  const handleRemove = (value: string) => {
    onChange(selectedValues.filter((v) => v !== value));
  };

  const selectedLabels = selectedValues
    .map((value) => options.find((option) => option.value === value)?.label)
    .filter(Boolean) as string[];

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild disabled={disabled}>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn(
            "w-full justify-between h-auto min-h-[2.5rem]",
            className
          )}
          onClick={() => setOpen(!open)}
        >
          {selectedValues.length > 0 ? (
            <div className="flex flex-wrap gap-1">
              {selectedLabels.map((label) => (
                <Badge
                  variant="secondary"
                  key={label}
                  className="mr-1"
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent popover from closing
                    const valueToRemove = options.find(
                      (opt) => opt.label === label
                    )?.value;
                    if (valueToRemove) handleRemove(valueToRemove);
                  }}
                >
                  {label}
                  <X className="ml-1 h-3 w-3 cursor-pointer" />
                </Badge>
              ))}
            </div>
          ) : (
            placeholder
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
        <Command>
          <CommandInput placeholder="Search options..." />
          <CommandList>
            <CommandEmpty>No option found.</CommandEmpty>
            <CommandGroup>
              {options.map((option) => (
                <CommandItem
                  key={option.value}
                  value={option.label} // CommandItem value is used for search, so use label
                  onSelect={() => {
                    handleSelect(option.value);
                    // setOpen(false); // Keep open for multi-select
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      selectedValues.includes(option.value)
                        ? "opacity-100"
                        : "opacity-0"
                    )}
                  />
                  {option.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default MultiSelectCombobox;
