"use client";

import * as React from "react";
import { Command, CommandGroup, CommandItem } from "@/components/ui/command";
import { Command as CommandPrimitive, useCommandState } from "cmdk";

const FILTERS = ["host", "method", "status"] as const;

type Filter = (typeof FILTERS)[number];

const OPTIONS: Record<Filter, (string | number)[]> = {
  host: ["mxkaske.dev", "craft.mxkaske.dev"],
  method: ["GET", "POST"],
  status: [200, 404, 500],
};

// type literal with `${Filters}:${Filters[string]}`

// TODO: rename to FancyInputSearch
export function FancyInputSearch() {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [open, setOpen] = React.useState<boolean>(false);
  const [inputValue, setInputValue] = React.useState<string>("");
  const [currentWord, setCurrentWord] = React.useState("");
  const [caretPosition, setCaretPosition] = React.useState(-1);

  /**
   * 1. get current string where cursor is
   * 2. split string by ":"
   * 3. if array length 1 display filter, else options
   * 4. FEATURE: split options by ","
   */

  return (
    <Command
      className="overflow-visible bg-transparent"
      filter={(value, search) => {
        console.log({ value, search, currentWord });
        if (value.includes(currentWord.toLowerCase())) return 1;
        return 0;
      }}
    >
      <CommandPrimitive.Input
        ref={inputRef}
        value={inputValue}
        onValueChange={setInputValue}
        onBlur={() => setOpen(false)}
        onFocus={() => setOpen(true)}
        onInput={(e) => {
          const caretPosition = e.currentTarget?.selectionStart || -1;
          const inputValue = e.currentTarget?.value || "";

          let start = caretPosition;
          let end = caretPosition;

          while (start > 0 && inputValue[start - 1] !== " ") {
            start--;
          }
          while (end < inputValue.length && inputValue[end] !== " ") {
            end++;
          }

          const word = inputValue.substring(start, end);
          // setWords?
          setCurrentWord(word);
          setCaretPosition(caretPosition);
        }}
        placeholder="28 total logs found..."
        className="flex-1 rounded-md border border-input bg-transparent px-3 py-2 text-sm outline-none ring-offset-background placeholder:text-muted-foreground focus:ring-2 focus:ring-ring focus:ring-offset-2"
      />
      <div className="relative mt-2">
        {open ? (
          <div className="absolute top-0 w-full rounded-md border bg-popover text-popover-foreground shadow-md outline-none animate-in">
            <CommandGroup className="h-full overflow-auto">
              {Object.keys(OPTIONS).map((key) => {
                if (
                  inputValue.includes(`${key}:`) &&
                  !currentWord.includes(`${key}:`)
                )
                  return null;
                return (
                  <React.Fragment key={key}>
                    <CommandItem
                      value={key}
                      onMouseDown={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                      }}
                      onSelect={(value) => {
                        // WRONG: if changing word in the middle of the input!
                        setInputValue((prev) => {
                          console.log({ prev, currentWord, value });
                          const input = prev.replace(currentWord, value);
                          return `${input}:`;
                        });
                        setCurrentWord(`${value}:`);
                      }}
                    >
                      {key}
                      <span className="ml-1 text-sm text-muted-foreground/60">
                        [{OPTIONS[key as Filter].join(", ")}]
                      </span>
                    </CommandItem>
                    {OPTIONS[key as Filter].map((option) => {
                      return (
                        <SubItem
                          key={option}
                          value={`${key}:${option}`} // method:get
                          onMouseDown={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                          }}
                          onSelect={(value) => {
                            setInputValue((prev) => {
                              // WRONG: if changing word in the middle of the input!
                              const input = prev.replace(currentWord, value);
                              return `${input} `;
                            });
                            setCurrentWord("");
                          }}
                          {...{ currentWord }}
                        >
                          {option}
                        </SubItem>
                      );
                    })}
                  </React.Fragment>
                );
              })}
            </CommandGroup>
          </div>
        ) : null}
      </div>
    </Command>
  );
}

interface SubItemProps
  extends React.ComponentPropsWithoutRef<typeof CommandPrimitive.Item> {
  currentWord: string;
}

const SubItem = ({ currentWord, ...props }: SubItemProps) => {
  const search = useCommandState((state) => {
    return state.search;
  });
  console.log({ search, currentWord });
  if (!search.includes(":") || !currentWord.includes(":")) return null;
  return <CommandItem {...props} />;
};
