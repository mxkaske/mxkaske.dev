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
import { useProcessor } from "./use-processor";
// TODO: TabsList has an interesting tab focus. Need to investigate on it

const people = [{ username: "@mxkaske" }, { username: "@shadcn" }];

const FancyArea = () => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [currentWord, setCurrentWord] = useState(""); // TODO: check if we can work without it!
  const [commandValue, setCommandValue] = useState("");
  const [textValue, setTextValue] = useState("");
  const [currentTab, setCurrentTab] = useState("write"); // possible to use TS here?
  const Component = useProcessor(textValue);

  useEffect(() => {
    if (currentTab === "write") {
      const textarea = textareaRef.current;
      textarea?.addEventListener("input", handleInput);
      textarea?.addEventListener("keydown", handleKeyDown);
      textarea?.addEventListener("blur", handleBlur);
      return () => {
        textarea?.removeEventListener("input", handleInput);
        textarea?.removeEventListener("keydown", handleKeyDown);
        textarea?.removeEventListener("blur", handleBlur);
      };
    }
  }, [currentTab]);

  function handleBlur() {
    // FIXME: check if click is on dropdown or not. creates issues
    const dropdown = dropdownRef.current;
    if (dropdown) {
      // dropdown.classList.add("hidden");
    }
    setCurrentWord("");
  }

  function handleInput() {
    const textarea = textareaRef.current;
    const dropdown = dropdownRef.current;

    if (textarea) {
      const caret = getCaretCoordinates(textarea, textarea.selectionEnd, {
        debug: true,
      });
      const text = textarea.value;
      const currentWord = getCurrentWord();
      setTextValue(text);
      // console.log(currentWord);
      if (dropdown) {
        if (currentWord.startsWith("@")) {
          // console.log("current word starts with @");
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
    const input = inputRef.current;
    if (textarea && input) {
      const currentWord = getCurrentWord();
      // github checks if not only currentWord starts with "@" but also _only_ has "@" to open the dropdown.
      if (currentWord.startsWith("@")) {
        if (e.key === "ArrowUp") {
          e.preventDefault();
          input.dispatchEvent(new KeyboardEvent("keydown", e));
          // console.log("up arrow");
        } else if (e.key === "ArrowDown") {
          e.preventDefault();
          input.dispatchEvent(new KeyboardEvent("keydown", e));
          // console.log("down arrow");
        } else if (e.key === "Enter") {
          // TODO: make sure to be possible to enter after selecting a word.
          e.preventDefault();
          input.dispatchEvent(new KeyboardEvent("keydown", e));
          // console.log("enter");
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

  // FIXME: something is off. First word works fine, second work the "@" wont be recognize, third get worse...
  const getCurrentWord = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      const text = textarea.value;
      const { caretStartIndex } = getCaretPosition(textarea);
      // Find the start position of the word
      let start = caretStartIndex;
      while (start > 0 && text[start - 1].match(/\S/)) {
        start--;
      }

      // Find the end position of the word
      let end = caretStartIndex;
      while (end < text.length && text[end].match(/\S/)) {
        end++;
      }

      const w = text.substring(start, end);

      return w;
    }
    return "";
  };

  function replaceWord(replacementWord: string) {
    const textarea = textareaRef.current;
    const dropdown = dropdownRef.current;
    if (textarea) {
      const text = textarea.value;
      const caretPos = textarea.selectionStart;

      // Find the word that needs to be replaced
      const wordRegex = /[\w@#]+/g;
      let match;
      let startIndex;
      let endIndex;

      while ((match = wordRegex.exec(text)) !== null) {
        startIndex = match.index;
        endIndex = startIndex + match[0].length;
        // console.log({ caretPos, startIndex, endIndex, match });

        if (caretPos >= startIndex && caretPos <= endIndex) {
          break;
        }
      }

      // console.log(startIndex, endIndex);

      // Replace the word with a new word using document.execCommand
      if (startIndex !== undefined && endIndex !== undefined) {
        // Preserve the current selection range
        const selectionStart = textarea.selectionStart;
        const selectionEnd = textarea.selectionEnd;

        // Modify the selected range to encompass the word to be replaced
        textarea.setSelectionRange(startIndex, endIndex);

        // REMINDER: Fastest way to include CMD + Z compatibility
        // Execute the command to replace the selected text with the new word
        document.execCommand("insertText", false, replacementWord);

        // Restore the original selection range
        textarea.setSelectionRange(
          selectionStart - (endIndex - startIndex) + replacementWord.length,
          selectionEnd - (endIndex - startIndex) + replacementWord.length
        );

        if (dropdown) {
          setCurrentWord("");
          dropdown.classList.add("hidden");
        }
      }
    }
  }


  if (currentTab === "preview") { 
    // console.log(renderHTML(textValue)) 
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
        <div className="w-[350px] relative">
          <Textarea
            ref={textareaRef}
            autoComplete="off"
            autoCorrect="off"
            className="resize-none h-auto" // REMINDER: font-[sans-serif]
            value={textValue}
            rows={5}
          // FIXME: if value, than we need onChange.
          // onChange={(e) => setTextValue(e.target.value)}
          />
          <p className="text-sm text-muted-foreground prose-none mt-1">
            Supports markdown.
          </p>
          <Command
            ref={dropdownRef}
            value={commandValue}
            onValueChange={setCommandValue}
            className={cn("max-w-min absolute hidden h-auto max-h-32")}
          >
            <div className="hidden">
              {/* Make it controlled */}
              <CommandInput ref={inputRef} value={currentWord} />
            </div>
            <CommandGroup className="overflow-auto max-w-min">
              {people.map((p) => {
                return (
                  <CommandItem
                    key={p.username}
                    value={p.username}
                    onSelect={(value) => {
                      replaceWord(`${value}`); // TODO: should I include a space? But than, if space already exists will be duplicated
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
          <div
          // prose (smaller size?)
          className="w-[352px] h-[140px] overflow-auto px-3 py-2"
        >
          {/* @ts-ignore */}
          {Component}
        </div>
      </TabsContent>
    </Tabs>
  );
};

export { FancyArea };
