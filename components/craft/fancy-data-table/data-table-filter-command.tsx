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
import type { DataTableFilterField } from "./types";
import { deserialize, serializeColumFilters } from "./utils";
import useUpdateSearchParams from "@/hooks/use-update-search-params";
import { useRouter } from "next/navigation";
import { Separator } from "@/components/ui/separator";
import { ARRAY_DELIMITER, SLIDER_DELIMITER } from "./schema";

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
  const [currentWord, setCurrentWord] = useState("");
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
        // TODO: extract?!?
        const search: Record<string, unknown> = {};
        Object.entries(searchParams.data).map(([key, value]) => {
          const field = filterFields?.find((field) => field.value === key);
          if (field) {
            if (field.type === "slider") {
              if (Array.isArray(value)) {
                search[key] = value.join(SLIDER_DELIMITER);
              } else {
                search[key] = value;
              }
            }
            if (field.type === "checkbox") {
              if (Array.isArray(value)) {
                search[key] = value.join(ARRAY_DELIMITER);
              } else {
                search[key] = value;
              }
            }
          }
          updatePageSearchParams(search);
        });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inputValue, open, currentWord]);

  useEffect(() => {
    setInputValue(serializeColumFilters(columnFilters, filterFields));
  }, [columnFilters, filterFields]);

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
          onClick={(e) => {
            e.preventDefault();
            setOpen(true);
          }}
        >
          {inputValue.trim() ? (
            <span className="text-foreground">{inputValue}</span>
          ) : (
            <span>Search data table...</span>
          )}
        </button>
        {/* add group-hover? */}
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
        filter={(value, _search, keywords) => {
          if (value.includes(currentWord.toLowerCase())) return 1;
          /**
           * @example [filter, query] = ["regions", "ams,gru,fra"]
           * @example [filter, query] = ["p95", "0-3000"]
           */
          const [filter, query] = currentWord.toLowerCase().split(":");
          if (query && value.startsWith(`${filter}:`)) {
            if (query.includes(ARRAY_DELIMITER)) {
              /**
               * array of n elements
               * @example queries = ["ams", "gru", "fra"]
               */
              const queries = query.split(ARRAY_DELIMITER);
              const extendedQueries = queries?.map(
                (item) => `${filter}:${item}`
              );
              if (extendedQueries.some((item) => item === value)) return 0;
              if (extendedQueries.some((item) => value.includes(item)))
                return 1;
            }
            if (query.includes(SLIDER_DELIMITER)) {
              /**
               * range between 2 elements
               * @example queries = ["0", "3000"]
               */
              const queries = query.split(SLIDER_DELIMITER);
              const extendedQueries = queries?.map(
                (item) => `${filter}:${item}`
              );

              const valueAsNumber = parseInt(value.replace(`${filter}:`, ""));
              const queryAsNumber = parseInt(queries[0]);

              if (queryAsNumber < valueAsNumber) {
                if (value.includes(extendedQueries[1])) return 1;
                else return 0;
              } else {
                return 0;
              }
            }
          }
          return 0;
        }}
      >
        <CommandInput
          ref={inputRef}
          value={inputValue}
          onValueChange={setInputValue}
          onKeyDown={(e) => {
            if (e.key === "Escape") inputRef?.current?.blur();
          }}
          onBlur={() => setOpen(false)}
          // onFocus={() => setOpen(true)}
          onInput={(e) => {
            const caretPositionStart = e.currentTarget?.selectionStart || -1;
            const currentValue = e.currentTarget?.value || "";

            let start = caretPositionStart;
            let end = caretPositionStart;

            while (start > 0 && currentValue[start - 1] !== " ") start--;
            while (end < currentValue.length && currentValue[end] !== " ")
              end++;

            const word = currentValue.substring(start, end);
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
                      {(() => {
                        switch (field.type) {
                          case "checkbox": {
                            return (
                              <span className="ml-1 hidden truncate text-muted-foreground/80 group-aria-[selected=true]:block">
                                {field.options
                                  ?.map(({ value }) => `[${value}]`)
                                  .join(" ")}
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
                          // TODO: add exhaustive check?
                        }
                      })()}
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

                  if (field.type === "slider") {
                    const options = field.options?.length
                      ? field.options
                          .map(({ value }) => value)
                          .sort((a, b) => Number(a) - Number(b))
                      : Array.from(
                          { length: field.max - field.min + 1 },
                          (_, i) => field.min + i
                        );
                    return options.map((v) => {
                      return (
                        <CommandItem
                          key={`${String(field.value)}:${v}`}
                          value={`${String(field.value)}:${v}`}
                          onMouseDown={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                          }}
                          onSelect={(value) => {
                            setInputValue((prev) => {
                              if (currentWord.includes(SLIDER_DELIMITER)) {
                                const words =
                                  currentWord.split(SLIDER_DELIMITER);
                                words[words.length - 1] = `${v}`;
                                const input = prev.replace(
                                  currentWord,
                                  words.join(SLIDER_DELIMITER)
                                );
                                return `${input.trim()} `;
                              }
                              const input = prev.replace(currentWord, value);
                              return `${input.trim()} `;
                            });
                            setCurrentWord("");
                          }}
                        >
                          {`${v}`}
                        </CommandItem>
                      );
                    });
                  }
                  if (field.type === "checkbox") {
                    return field.options?.map(({ value: optionValue }) => {
                      return (
                        <CommandItem
                          key={`${String(field.value)}:${optionValue}`}
                          value={`${String(field.value)}:${optionValue}`}
                          onMouseDown={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                          }}
                          onSelect={(value) => {
                            setInputValue((prev) => {
                              if (currentWord.includes(ARRAY_DELIMITER)) {
                                const words =
                                  currentWord.split(ARRAY_DELIMITER);
                                words[words.length - 1] = `${optionValue}`;
                                const input = prev.replace(
                                  currentWord,
                                  words.join(ARRAY_DELIMITER)
                                );
                                return `${input.trim()} `;
                              }
                              const input = prev.replace(currentWord, value);
                              return `${input.trim()} `;
                            });
                            setCurrentWord("");
                          }}
                        >
                          {`${optionValue}`}
                          <span className="ml-auto font-mono text-muted-foreground">
                            {facetedValue?.get(optionValue)}
                          </span>
                        </CommandItem>
                      );
                    });
                  }
                  return null;
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
