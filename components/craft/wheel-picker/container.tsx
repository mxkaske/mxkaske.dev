"use client";

import {
  WheelPicker,
  WheelPickerOptions,
  WheelPickerSelect,
} from "@/components/craft/wheel-picker/wheel-picker";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useCopyToClipboard } from "@/hooks/use-copy-to-clipboard";
import { Check, Copy } from "lucide-react";
import { useState } from "react";

const REGISTRY_ITEMS = [
  "metric-card.json",
  "action-card.json",
  "form-card.json",
  "section.json",
  "empty-state.json",
];

export function Container() {
  const { copy, isCopied } = useCopyToClipboard();
  const [currentIndex, setCurrentIndex] = useState(2);

  return (
    <Button
      size="sm"
      variant="outline"
      className={cn(
        "relative text-xs text-foreground/70 font-mono flex items-center w-full sm:w-auto gap-2 transition-all duration-300 ease-in-out"
      )}
      onClick={() =>
        copy(
          `pnpm dlx shadcn@latest add localhost:3000/r/${REGISTRY_ITEMS[currentIndex]}`,
          {
            successMessage: `Copied ${REGISTRY_ITEMS[currentIndex]} url to clipboard`,
          }
        )
      }
    >
      <div className="flex items-center w-full">
        <span className="truncate">
          pnpm dlx shadcn@latest add localhost/r/
        </span>
        <WheelPicker
          items={REGISTRY_ITEMS}
          className="w-[122px] min-w-[122px]"
          currentIndex={currentIndex}
          onIndexChange={setCurrentIndex}
        >
          <WheelPickerSelect>
            <WheelPickerOptions />
          </WheelPickerSelect>
        </WheelPicker>
      </div>
      <div className="sm:block hidden">
        {isCopied ? (
          <Check className="w-4 h-4" />
        ) : (
          <Copy className="w-4 h-4" />
        )}
      </div>
    </Button>
  );
}
