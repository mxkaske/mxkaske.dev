"use client";

import React, { useRef, useState, useEffect } from "react";
import { Textarea } from "@/components/ui/textarea";
import { getCaretCoordinates } from "./getCaretCoordinates";
import {
  Command,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import { cn } from "@/lib/utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";

const people = [
  { username: "@john" },
  { username: "@jane" },
  { username: "@alice" },
  { username: "@bob" },
  { username: "@maximilian" },
];

const FancyArea = () => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [currentWord, setCurrentWord] = useState("");
  const [commandValue, setCommandValue] = useState("");
  const [textValue, setTextValue] = useState("");
  const [currentTab, setCurrentTab] = useState("");

  useEffect(() => {
    const textarea = textareaRef.current;
    textarea?.addEventListener("input", handleInput);
    textarea?.addEventListener("keydown", handleKeyDown);
    textarea?.addEventListener("blur", handleBlur);
    return () => {
      textarea?.removeEventListener("input", handleInput);
      textarea?.removeEventListener("keydown", handleKeyDown);
      textarea?.removeEventListener("blur", handleBlur);
    };
  }, [currentTab]);

  function handleBlur() {
    // FIXME:
    const dropdown = dropdownRef.current;
    if (dropdown) {
      dropdown.classList.remove("hidden");
    }
    setCurrentWord("");
  }

  function handleInput() {
    const textarea = textareaRef.current;
    const dropdown = dropdownRef.current;

    if (textarea) {
      const caret = getCaretCoordinates(textarea, textarea.selectionEnd);
      const text = textarea.value;
      const { caretStartIndex, caretEndIndex } = getCaretPosition(textarea);
      const currentWord = getCurrentWord(text, caretStartIndex);
      setTextValue(text);
      if (dropdown) {
        if (currentWord.startsWith("@")) {
          setCurrentWord(currentWord);
          dropdown.style.left = caret.left + "px";
          dropdown.style.top = caret.top + caret.height + "px";
          dropdown.classList.remove("hidden"); // FIXME: should be moved to html tag with cn
        } else {
          currentWord !== "" && setCurrentWord("");
          dropdown.classList.add("hidden");
        }
      }
    }
  }

  function handleKeyDown(e: KeyboardEvent) {
    const textarea = textareaRef.current;
    if (textarea) {
      const { caretStartIndex, caretEndIndex } = getCaretPosition(textarea);
      const text = textarea.value;
      const currentWord = getCurrentWord(text, caretStartIndex);
      if (currentWord.startsWith("@")) {
        if (e.key === "ArrowUp") {
          e.preventDefault();
          console.log("up arrow");
        } else if (e.key === "ArrowDown") {
          e.preventDefault();
          console.log("down arrow");
        } else if (e.key === "Enter") {
          e.preventDefault();
          console.log("enter");
        }
      }
    }
  }

  const getCaretPosition = (element: HTMLTextAreaElement) => {
    return {
      caretStartIndex: element.selectionStart || 0,
      caretEndIndex: element.selectionEnd || 0,
    };
  };

  const getCurrentWord = (text: string, caretIndex: number) => {
    const words = text.split(/\s+/);
    let currentWord = "";

    for (let i = 0; i < words.length; i++) {
      const word = words[i];
      const startIndex = text.indexOf(word);
      const endIndex = startIndex + word.length;

      if (caretIndex >= startIndex && caretIndex <= endIndex) {
        currentWord = word;
        break;
      }
    }

    return currentWord;
  };

  return (
    <Tabs
      defaultValue="write"
      className="w-[350px]"
      onValueChange={setCurrentTab}
    >
      <TabsList>
        <TabsTrigger value="write">Write</TabsTrigger>
        <TabsTrigger value="preview">Preview</TabsTrigger>
      </TabsList>
      <TabsContent value="write">
        <div ref={containerRef} className="w-[350px] relative">
          <Textarea
            ref={textareaRef}
            autoComplete="off"
            className="resize-none"
            value={textValue}
            // onChange={(e) => setTextValue(e.target.value)}
          />
          <Command
            ref={dropdownRef}
            value={commandValue}
            onValueChange={setCommandValue}
            className={cn("max-w-min absolute hidden")}
          >
            <div className="hidden">
              {/* Make it controlled */}
              <CommandInput value={currentWord} />
            </div>
            <CommandGroup className="max-h-min overflow-auto max-w-min">
              {people.map((p) => {
                return (
                  <CommandItem
                    key={p.username}
                    value={p.username}
                    onSelect={(value) => {
                      setTextValue((prev) => `${prev}${value}`); // TODO:
                      setCurrentWord("");
                      // TODO: FIXME:
                      const dropdown = dropdownRef.current;
                      if (dropdown) {
                        dropdown.classList.add("hidden");
                      }
                    }}
                  >
                    {p.username}
                  </CommandItem>
                );
              })}
            </CommandGroup>
          </Command>
        </div>
      </TabsContent>
      <TabsContent value="preview">
        <div className="w-[350px] h-[80px] overflow-auto px-3 py-2 rounded-md border border-input text-sm">
          {textValue}
        </div>
      </TabsContent>
    </Tabs>
  );
};

export { FancyArea };
