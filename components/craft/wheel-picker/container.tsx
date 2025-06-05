"use client";

import { WheelPicker } from "@/components/craft/wheel-picker/wheel-picker";
import { Button } from "@/components/ui/button";
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

const DEFAULT_INDEX = 2;

export function Container() {
  const { copy, isCopied } = useCopyToClipboard();
  const [selectedIndex, setSelectedIndex] = useState(DEFAULT_INDEX);
  return (
    <Button
      size="sm"
      variant="outline"
      className="relative text-xs text-foreground/70 font-mono flex items-center w-full sm:w-auto gap-2 transition-all duration-300 ease-in-out"
      onClick={() =>
        copy(
          `pnpm dlx shadcn@latest add localhost:3000/r/${REGISTRY_ITEMS[selectedIndex]}`,
          {
            successMessage: `Copied ${REGISTRY_ITEMS[selectedIndex]} url to clipboard`,
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
          selectedIndex={selectedIndex}
          setSelectedIndex={setSelectedIndex}
        />
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
