"use client";

import React, { useEffect, useRef, useState } from "react";

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { Search } from "lucide-react";

import { cn } from "@/lib/utils";

import { Kbd } from "@/components/ui/kbd";
import type { Table } from "@tanstack/react-table";
import type { z } from "zod";
import type { DataTableFilterField } from "../types";
import { deserialize, serializeColumFilters } from "../utils";
import useUpdateSearchParams from "@/hooks/use-update-search-params";
import { useRouter } from "next/navigation";
import { Separator } from "@/components/ui/separator";
import { ARRAY_DELIMITER, SLIDER_DELIMITER } from "../schema";
import {
  getFieldOptions,
  getFieldValueByType,
  getFilterValue,
  getWordByCaretPosition,
  replaceInputByFieldType,
} from "./utils";

interface DataTableFilterCommandProps<TData, TSchema extends z.AnyZodObject> {
  table: Table<TData>;
  schema: TSchema;
  filterFields?: DataTableFilterField<TData>[];
}

export function DataTableFilterCommand<TData, TSchema extends z.AnyZodObject>({
  schema,
  table,
  filterFields,
}: DataTableFilterCommandProps<TData, TSchema>) {
  const columnFilters = table.getState().columnFilters;
  const inputRef = useRef<HTMLInputElement>(null);
  const [open, setOpen] = useState<boolean>(false);
  const [currentWord, setCurrentWord] = useState<string>("");
  const [inputValue, setInputValue] = useState<string>(
    serializeColumFilters(columnFilters, filterFields)
  );
  const updateSearchParams = useUpdateSearchParams();
  const router = useRouter();

  const updatePageSearchParams = (values: Record<string, unknown>) => {
    const newSearchParams = updateSearchParams(values, { override: true });
    router.replace(`?${newSearchParams}`, { scroll: false });
  };

  useEffect(() => {
    // TODO: we could check for ARRAY_DELIMITER or SLIDER_DELIMITER to auto-set filter when typing
    if (currentWord !== "" && open) return;
    // reset
    if (currentWord !== "" && !open) setCurrentWord("");

    const searchParams = deserialize(schema)(inputValue);
    if (searchParams.success) {
      table.resetColumnFilters();

      for (const key of Object.keys(searchParams.data)) {
        table
          .getColumn(key)
          ?.setFilterValue(
            searchParams.data[key as keyof typeof searchParams.data]
          );
      }
      if (typeof searchParams.data === "object") {
        const search: Record<string, unknown> = {};
        Object.entries(searchParams.data).map(([key, value]) => {
          const field = filterFields?.find((field) => field.value === key);
          const searchValue = getFieldValueByType({ field, value });
          search[key] = searchValue;
        });
        updatePageSearchParams(search);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inputValue, open, currentWord]);

  useEffect(() => {
    // REMINDER: only update the input value if the command is closed (avoids jumps while open)
    if (!open) {
      setInputValue(serializeColumFilters(columnFilters, filterFields));
    }
  }, [columnFilters, filterFields, open]);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  useEffect(() => {
    if (open) {
      inputRef?.current?.focus();
    }
  }, [open]);

  return (
    <div>
      <div
        className={cn(
          "group flex w-full items-center rounded-lg border border-input bg-background px-3 text-muted-foreground ring-offset-background focus-within:outline-none focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 hover:bg-accent hover:text-accent-foreground",
          open ? "hidden" : "visible"
        )}
      >
        <Search className="mr-2 h-4 w-4 shrink-0 text-muted-foreground opacity-50 group-hover:text-popover-foreground" />
        <button
          type="button"
          className="h-11 w-full max-w-sm truncate py-3 text-left text-sm outline-none disabled:cursor-not-allowed disabled:opacity-50 md:max-w-xl lg:max-w-4xl xl:max-w-5xl"
          onClick={() => setOpen(true)}
        >
          {inputValue.trim() ? (
            <span className="text-foreground">{inputValue}</span>
          ) : (
            <span>Search data table...</span>
          )}
        </button>
        <Kbd className="ml-auto text-muted-foreground group-hover:text-accent-foreground">
          <span className="mr-0.5">⌘</span>
          <span>K</span>
        </Kbd>
      </div>
      <Command
        className={cn(
          "overflow-visible rounded-lg border shadow-md [&>div]:border-none",
          open ? "visible" : "hidden"
        )}
        filter={(value) => getFilterValue({ value, currentWord })}
      >
        <CommandInput
          ref={inputRef}
          value={inputValue}
          onValueChange={setInputValue}
          onKeyDown={(e) => {
            if (e.key === "Escape") inputRef?.current?.blur();
          }}
          onBlur={() => setOpen(false)}
          onInput={(e) => {
            const caretPosition = e.currentTarget?.selectionStart || -1;
            const value = e.currentTarget?.value || "";
            const word = getWordByCaretPosition({ value, caretPosition });
            setCurrentWord(word);
          }}
          placeholder="Search data table..."
          className="text-foreground"
        />
        <div className="relative">
          <div className="absolute top-2 z-10 w-full overflow-hidden rounded-lg border border-accent-foreground/30 bg-popover text-popover-foreground shadow-md outline-none animate-in">
            <CommandList>
              <CommandGroup heading="Filter">
                {filterFields?.map((field) => {
                  if (typeof field.value !== "string") return null;
                  if (inputValue.includes(`${field.value}:`)) return null;
                  return (
                    <CommandItem
                      key={field.value}
                      value={field.value}
                      onMouseDown={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                      }}
                      onSelect={(value) => {
                        setInputValue((prev) => {
                          if (currentWord.trim() === "") {
                            const input = `${prev}${value}`;
                            return `${input}:`;
                          }
                          // lots of cheat
                          const isStarting = currentWord === prev;
                          const prefix = isStarting ? "" : " ";
                          const input = prev.replace(
                            `${prefix}${currentWord}`,
                            `${prefix}${value}`
                          );
                          return `${input}:`;
                        });
                        setCurrentWord(`${value}:`);
                      }}
                      className="group"
                    >
                      {field.value}
                      <CommandItemSuggestions field={field} />
                    </CommandItem>
                  );
                })}
              </CommandGroup>
              <CommandSeparator />
              <CommandGroup heading="Query">
                {filterFields?.map((field) => {
                  if (typeof field.value !== "string") return null;
                  if (!currentWord.includes(`${field.value}:`)) return null;

                  const column = table.getColumn(field.value);
                  const facetedValue = column?.getFacetedUniqueValues();

                  const options = getFieldOptions({ field });

                  return options.map((optionValue) => {
                    return (
                      <CommandItem
                        key={`${String(field.value)}:${optionValue}`}
                        value={`${String(field.value)}:${optionValue}`}
                        onMouseDown={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                        }}
                        onSelect={(value) => {
                          setInputValue((prev) =>
                            replaceInputByFieldType({
                              prev,
                              currentWord,
                              optionValue,
                              value,
                              field,
                            })
                          );
                          setCurrentWord("");
                        }}
                      >
                        {`${optionValue}`}
                        {facetedValue?.has(optionValue) ? (
                          <span className="ml-auto font-mono text-muted-foreground">
                            {facetedValue?.get(optionValue)}
                          </span>
                        ) : null}
                      </CommandItem>
                    );
                  });
                })}
              </CommandGroup>
              <CommandEmpty>No results found.</CommandEmpty>
            </CommandList>
            <div
              className="flex flex-wrap gap-3 border-t bg-accent/50 px-2 py-1.5 text-sm text-accent-foreground"
              cmdk-footer=""
            >
              <span>
                Use <Kbd className="bg-background">↑</Kbd>{" "}
                <Kbd className="bg-background">↓</Kbd> to navigate
              </span>
              <span>
                <Kbd className="bg-background">Enter</Kbd> to query
              </span>
              <span>
                <Kbd className="bg-background">Esc</Kbd> to close
              </span>
              <Separator orientation="vertical" className="my-auto h-3" />
              <span>
                Union: <Kbd className="bg-background">regions:a,b</Kbd>
              </span>
              <span>
                Range: <Kbd className="bg-background">p95:59-340</Kbd>
              </span>
            </div>
          </div>
        </div>
      </Command>
    </div>
  );
}

// function CommandItemType<TData>

function CommandItemSuggestions<TData>({
  field,
}: {
  field: DataTableFilterField<TData>;
}) {
  switch (field.type) {
    case "checkbox": {
      return (
        <span className="ml-1 hidden truncate text-muted-foreground/80 group-aria-[selected=true]:block">
          {field.options?.map(({ value }) => `[${value}]`).join(" ")}
        </span>
      );
    }
    case "slider": {
      return (
        <span className="ml-1 hidden truncate text-muted-foreground/80 group-aria-[selected=true]:block">
          [{field.min} - {field.max}]
        </span>
      );
    }
    case "input": {
      return (
        <span className="ml-1 hidden truncate text-muted-foreground/80 group-aria-[selected=true]:block">
          [{`${String(field.value)}`} input]
        </span>
      );
    }
    default: {
      return null;
    }
  }
}
