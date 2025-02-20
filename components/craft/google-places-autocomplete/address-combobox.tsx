"use client";

import * as React from "react";
import { useDebounce } from "@/hooks/use-debounce";
import { Command as CommandPrimitive } from "cmdk";
import { LoaderCircle } from "lucide-react";

import { cn } from "@/lib/utils";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
  CommandLoading,
} from "@/components/ui/command";

import { getGooglePlaceById, getGooglePlaces } from "./actions";
import { toast } from "sonner";

interface AddressComboboxProps {
  onSubmit?: () => void;
  className?: string;
}

export function AddressCombobox({ onSubmit, className }: AddressComboboxProps) {
  const [open, setOpen] = React.useState(false);
  const [isPending, startTransition] = React.useTransition();
  const [items, setItems] = React.useState<{ value: string; label: string }[]>(
    []
  );
  const [search, setSearch] = React.useState("");
  const debouncedSearch = useDebounce(search, 300);
  const inputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (debouncedSearch) {
      startTransition(async () => {
        const data = await getGooglePlaces(debouncedSearch);
        if (Array.isArray(data)) {
          setItems(
            data.map((d) => ({
              label: d.description,
              value: d.place_id,
            }))
          );
        }
      });
    } else {
      setItems([]);
    }
  }, [debouncedSearch]);

  function handleKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Escape") {
      inputRef.current?.blur();
    }
  }

  function handleSelect(currentValue: string) {
    startTransition(async () => {
      const data = await getGooglePlaceById(currentValue);

      let value = "";
      if (data?.street) {
        value += data.street;
      }
      if (data?.house_number) {
        value += ` ${data.house_number}`;
      }
      if (data?.city) {
        value += `, ${data.city}`;
      }
      if (data?.postal_code) {
        value += `, ${data.postal_code}`;
      }

      setSearch(value);
      inputRef.current?.blur();
      toast("Selected address", {
        description: JSON.stringify(data),
      });

      onSubmit?.();
    });
  }

  return (
    <Command shouldFilter={false} className="overflow-visible">
      <CommandPrimitive.Input
        ref={inputRef}
        placeholder="Search for an address (US)"
        value={search}
        onInput={(e) => setSearch(e.currentTarget.value)}
        onKeyDown={handleKeyDown}
        onFocus={() => setOpen(true)}
        onBlur={() => setOpen(false)}
        className={cn(
          "flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          "placeholder:font-light",
          className
        )}
      />
      <div className="relative">
        {open && debouncedSearch ? (
          <CommandList className="absolute top-1.5 z-50 w-full rounded-md border border-border bg-background">
            {isPending ? (
              <CommandLoading>
                <LoaderCircle className="h-4 w-4 animate-spin text-muted-foreground" />
              </CommandLoading>
            ) : (
              <>
                <CommandEmpty>No address found.</CommandEmpty>
                <CommandGroup>
                  {items.map((item, i) => {
                    const [first, rest] = item.label.split(/,(.+)/);
                    return (
                      <CommandItem
                        key={`${item.value}-${item.label}-${i}`}
                        value={item.value}
                        onSelect={handleSelect}
                        onMouseDown={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                        }}
                        className="flex gap-1 truncate items-baseline"
                      >
                        <span key={first}>
                          {getHighlightedText(first ?? "", debouncedSearch)}
                        </span>{" "}
                        <span
                          key={rest}
                          className="truncate text-xs text-muted-foreground"
                        >
                          {rest}
                        </span>
                      </CommandItem>
                    );
                  })}
                </CommandGroup>
              </>
            )}
            <div className="border-t border-border bg-muted/50 px-2 py-0.5 text-[10px] text-muted-foreground">
              <p>Suggestions from Google</p>
            </div>
          </CommandList>
        ) : null}
      </div>
    </Command>
  );
}

function getHighlightedText(text: string, query: string) {
  if (!query) return text;

  // Escape special characters in the query for regex
  const escapedQuery = query
    .split(" ")
    .map((word) => word.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&"));

  // Create a regex pattern to match the query words
  const regex = new RegExp(`(${escapedQuery.join("|")})`, "gi");

  // Replace matching words with a span element for highlighting
  return text.split(regex).map((part, index) =>
    regex.test(part) ? (
      <span key={index} className="font-semibold">
        {part}
      </span>
    ) : (
      <React.Fragment key={index}>{part}</React.Fragment>
    )
  );
}
