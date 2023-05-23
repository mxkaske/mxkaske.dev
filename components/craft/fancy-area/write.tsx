"use client";

import React, { useRef, useState, useEffect, useCallback } from "react";
import { Textarea } from "@/components/ui/textarea";
import { getCaretCoordinates, getCurrentWord, replaceWord } from "./utils";
import {
  Command,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import { cn } from "@/lib/utils";
import { people } from "./data";

interface Props {
  textValue: string;
  setTextValue: React.Dispatch<React.SetStateAction<string>>
}

export function Write({ textValue, setTextValue }: Props) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [commandValue, setCommandValue] = useState("");

  const handleBlur = useCallback(() => {
    const dropdown = dropdownRef.current;
    if (dropdown) {
      dropdown.classList.add("hidden");
      setCommandValue("");
    }
  }, [])

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    const textarea = textareaRef.current;
    const input = inputRef.current;
    const dropdown = dropdownRef.current;
    if (textarea && input && dropdown) {
      const currentWord = getCurrentWord(textarea);
      const isDropdownHidden = dropdown.classList.contains("hidden")
      if (currentWord.startsWith("@") && !isDropdownHidden) {
        // TODO: add Escape
        if (e.key === "ArrowUp" || e.key === "ArrowDown" || e.key === "Enter" || e.key === "Escape") {
          e.preventDefault();
          input.dispatchEvent(new KeyboardEvent("keydown", e));
        }
      }
    }
  }, [])

  const onTextValueChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value;
    const textarea = textareaRef.current;
    const dropdown = dropdownRef.current;

    if (textarea && dropdown) {
      const caret = getCaretCoordinates(textarea, textarea.selectionEnd);
      const currentWord = getCurrentWord(textarea);
      setTextValue(text);
      console.log({ currentWord })
      if (currentWord.startsWith("@")) {
        setCommandValue(currentWord);
        dropdown.style.left = caret.left + "px";
        dropdown.style.top = caret.top + caret.height + "px";
        dropdown.classList.remove("hidden");
      } else {
        // FIXME: We need to store the last word...
        if (currentWord !== "") {
          setCommandValue("");
          dropdown.classList.add("hidden");
        }
      }
    }
  }, [setTextValue])

  const onCommandSelect = useCallback((value: string) => {
    const textarea = textareaRef.current
    if (textarea) {
      replaceWord(textarea, `${value}`);
      const dropdown = dropdownRef.current;
      if (dropdown) {
        setCommandValue("");
        dropdown.classList.add("hidden");
      }
    }
  }, [])

  useEffect(() => {
    const textarea = textareaRef.current;
    textarea?.addEventListener("keydown", handleKeyDown);
    textarea?.addEventListener("blur", handleBlur);
    return () => {
      textarea?.removeEventListener("keydown", handleKeyDown);
      textarea?.removeEventListener("blur", handleBlur);
    };
  }, [handleBlur, handleKeyDown]);


  return (
    <div className="w-[350px] relative">
      <Textarea
        ref={textareaRef}
        autoComplete="off"
        autoCorrect="off"
        className="resize-none h-auto" // REMINDER: font-[sans-serif]
        value={textValue}
        onChange={onTextValueChange}
        rows={5}
      />
      <p className="text-sm text-muted-foreground prose-none mt-1">
        Supports markdown.
      </p>
      <Command
        ref={dropdownRef}
        className={cn("max-w-min absolute hidden h-auto max-h-32")}
      >
        <div className="hidden">
          <CommandInput ref={inputRef} value={commandValue} />
        </div>
        <CommandGroup className="overflow-auto max-w-min">
          {people.map((p) => {
            return (
              <CommandItem
                key={p.username}
                value={p.username}
                onSelect={onCommandSelect}
              >
                {p.username}
              </CommandItem>
            );
          })}
        </CommandGroup>
      </Command>
    </div>

  );
};