"use client";

import * as React from "react";
import { X } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import {
  Command,
  CommandGroup,
  CommandItem,
} from "@/components/ui/command";
import { Command as CommandPrimitive } from "cmdk";


type Framework = Record<"value" | "label", string>;

const FRAMEWORKS = [
  {
    value: "next.js",
    label: "Next.js",
  },
  {
    value: "sveltekit",
    label: "SvelteKit",
  },
  {
    value: "nuxt.js",
    label: "Nuxt.js",
  },
  {
    value: "remix",
    label: "Remix",
  },
  {
    value: "astro",
    label: "Astro",
  },
  {
    value: "wordpress",
    label: "WordPress",
  },
] satisfies Framework[];

export function FancyMultiSelect() {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [open, setOpen] = React.useState(false);
  const [selected, setSelected] = React.useState<Framework[]>([FRAMEWORKS[4]]);
  const [inputValue, setInputValue] = React.useState("");

  const handleFocus = React.useCallback((e: FocusEvent) => {
    setOpen(true);
  }, []);

  const handleBlur = React.useCallback((e: FocusEvent) => {
    setOpen(false);
  }, []);

  const handleKeyDown = React.useCallback((e: React.KeyboardEvent<HTMLDivElement>) => {
    const input = inputRef.current
    if (input) {
      if (e.key === "Delete" || e.key === "Backspace") {
        if (input.value === "") {
          setSelected(prev => {
            const newSelected = [...prev];
            newSelected.pop();
            return newSelected;
          })
        }
      }
    }
  }, []);

  React.useEffect(() => {
    const input = inputRef.current;
    input?.addEventListener("focus", handleFocus);
    input?.addEventListener("blur", handleBlur);
    return () => {
      input?.removeEventListener("focus", handleFocus);
      input?.removeEventListener("blur", handleBlur);
    };
  }, [handleFocus, handleBlur]);

  const selectables = FRAMEWORKS.filter(framework => !selected.includes(framework));

  return (
    <Command onKeyDown={handleKeyDown}>
      <div
        className="group border border-input px-3 py-2 m-1 text-sm ring-offset-background rounded-md focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2"
      >
        <div className="flex gap-1 flex-wrap">
          {selected.map((framework) => {
            return (
              <Badge key={framework.value} variant="secondary">
                {framework.label}
                <button
                  onClick={() => setSelected(prev => prev.filter(s => s.value !== framework.value))}
                >
                  <X className="h-3 w-3 ml-1 text-muted-foreground hover:text-foreground" />
                </button>
              </Badge>
            )
          })}
          {/* Avoid having the "Search" Icon */}
          <CommandPrimitive.Input
            ref={inputRef}
            value={inputValue}
            onValueChange={setInputValue}
            placeholder="Select frameworks..."
            className="ml-2 bg-transparent outline-none placeholder:text-muted-foreground flex-1"
          />
        </div>
      </div>
      {open && selectables.length > 0 ?
        <div className="rounded-md border bg-popover mt-1 text-popover-foreground shadow-md outline-none animate-in">
          <CommandGroup className="max-h-[145px] overflow-auto">
            {selectables.map((framework) => {
              return (
                <CommandItem
                  key={framework.value}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                  }}
                  onSelect={(value) => {
                    setInputValue("")
                    setSelected(prev => [...prev, framework])
                  }}
                >
                  {framework.label}
                </CommandItem>
              );
            })}
          </CommandGroup>
        </div>
        : null}
    </Command>
  )
}