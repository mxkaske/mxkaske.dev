"use client";

import { cn } from "@/lib/utils";
import { useCallback } from "react";

interface WheelPickerProps extends React.ComponentProps<"div"> {
  items: string[];
  selectedIndex: number;
  setSelectedIndex: React.Dispatch<React.SetStateAction<number>>;
}

export function WheelPicker({
  items,
  className,
  selectedIndex,
  setSelectedIndex,
  ...props
}: WheelPickerProps) {
  // internal render count includes two placeholders
  const count = items.length + 2;

  const theta = (2 * Math.PI) / count;
  const radius = 28;

  const firstReal = 1;
  const lastReal = items.length; // render index of last real item

  const getItem = useCallback(
    (renderIdx: number) => {
      if (renderIdx === 0 || renderIdx === count - 1) return null;
      return items[renderIdx - 1];
    },
    [items]
  );

  const moveTo = useCallback(
    (idx: number) => {
      if (idx < firstReal || idx > lastReal) return;
      setSelectedIndex(idx);
    },
    [setSelectedIndex, items]
  );

  const moveBy = useCallback(
    (delta: number) => {
      let idx = selectedIndex + delta;
      // skip empty placeholders
      while (!getItem(idx) && idx >= firstReal && idx <= lastReal) {
        idx += delta > 0 ? 1 : -1;
      }
      moveTo(idx);
    },
    [getItem, moveTo, selectedIndex, items]
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      switch (e.key) {
        case "ArrowUp":
        case "ArrowLeft":
          e.preventDefault();
          moveBy(1);
          break;
        case "ArrowDown":
        case "ArrowRight":
          e.preventDefault();
          moveBy(-1);
          break;
        case "Home":
          e.preventDefault();
          moveTo(firstReal);
          break;
        case "End":
          e.preventDefault();
          moveTo(lastReal);
          break;
      }
    },
    [moveBy, moveTo, firstReal, lastReal]
  );

  return (
    <div
      className={cn(
        "relative w-full h-6 text-left focus:outline-none border border-transparent focus:border-ring focus:ring-ring/50 focus:ring-2 rounded-md",
        className
      )}
      role="listbox"
      aria-label="Select component"
      aria-activedescendant={`wheel-option-${selectedIndex}`}
      tabIndex={0}
      onKeyDown={handleKeyDown}
      {...props}
    >
      <div className="rounded-md h-full w-full [perspective:1000px] [transform-style:preserve-3d]">
        <div
          className="relative h-full w-full [transform-style:preserve-3d] transition-transform duration-500 ease-out"
          style={{
            transform: `translateZ(-${radius}px) rotateX(${
              -selectedIndex * theta
            }rad)`,
          }}
        >
          {/* placeholder at start */}
          {(() => {
            const angle = 0;
            return (
              <div
                key="placeholder-start"
                id="wheel-option-0"
                role="option"
                aria-selected={selectedIndex === 0}
                aria-disabled
                className="absolute h-full w-full select-none [backface-visibility:hidden]"
                style={{
                  transform: `rotateX(${angle}rad) translateZ(${radius}px)`,
                  transformStyle: "preserve-3d",
                }}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                }}
              />
            );
          })()}

          {items.map((item, idx) => {
            const renderIdx = idx + 1; // account for first placeholder
            const angle = theta * renderIdx;
            return (
              <div
                key={item}
                className={cn(
                  "absolute h-full w-full select-none [backface-visibility:hidden] transition-transform duration-500 ease-out flex items-center justify-start cursor-pointer"
                )}
                style={{
                  transform: `rotateX(${angle}rad) translateZ(${radius}px)`,
                  transformStyle: "preserve-3d",
                }}
                onClick={(e) => {
                  if (selectedIndex !== renderIdx) {
                    e.preventDefault();
                    e.stopPropagation();
                    setSelectedIndex(renderIdx);
                  }
                }}
                role="option"
                id={`wheel-option-${renderIdx}`}
                aria-selected={renderIdx === selectedIndex}
              >
                <span
                  className={cn(
                    "text-xs transition-colors",
                    renderIdx === selectedIndex
                      ? "text-foreground"
                      : "text-muted-foreground/70"
                  )}
                >
                  {item}
                </span>
              </div>
            );
          })}

          {/* placeholder at end */}
          {(() => {
            const angle = theta * (count - 1);
            return (
              <div
                key="placeholder-end"
                id={`wheel-option-${count - 1}`}
                role="option"
                aria-selected={selectedIndex === count - 1}
                aria-disabled
                className="absolute h-full w-full select-none [backface-visibility:hidden]"
                style={{
                  transform: `rotateX(${angle}rad) translateZ(${radius}px)`,
                  transformStyle: "preserve-3d",
                }}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                }}
              />
            );
          })()}
        </div>
      </div>
    </div>
  );
}
