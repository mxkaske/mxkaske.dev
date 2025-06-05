"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

// ---------------------------------------------------------------------------------------------------------------------
// Context -------------------------------------------------------------------------------------------------------------
// ---------------------------------------------------------------------------------------------------------------------

interface WheelPickerContextValue {
  items: string[];
  selectedIndex: number;
  setSelectedIndex: (index: number) => void;
  theta: number; // angle between two items
  radius: number; // translateZ distance
  count: number; // items including placeholders
}

const WheelPickerContext = React.createContext<WheelPickerContextValue | null>(
  null
);

const useWheelPickerContext = () => {
  const ctx = React.useContext(WheelPickerContext);
  if (!ctx) {
    throw new Error(
      "[WheelPicker] sub component must be rendered within <WheelPicker /> root"
    );
  }
  return ctx;
};

// ---------------------------------------------------------------------------------------------------------------------
// WheelPicker (Root / Provider) ---------------------------------------------------------------------------------------
// ---------------------------------------------------------------------------------------------------------------------

export interface WheelPickerProps extends React.HTMLAttributes<HTMLDivElement> {
  items: string[];
  /** 0-based index of the initially selected item. Defaults to 0. */
  defaultIndex?: number;
  /** Callback that is invoked with the selected item (string) whenever the selection changes */
  onValueChange?: (value: string) => void;
  /** Optional externally controlled value (index). If provided, component becomes controlled */
  value?: number;
  /** Radius (in `px`) of the carousel – tweak to fit line height of text (Default: 28) */
  radius?: number;
}

const WheelPicker = React.forwardRef<HTMLDivElement, WheelPickerProps>(
  (
    {
      items,
      defaultIndex = 0,
      onValueChange,
      value,
      radius: radiusProp = 28,
      className,
      children,
      ...props
    },
    ref
  ) => {
    // internal render count includes two placeholders at start & end
    const count = items.length + 2;
    const theta = (2 * Math.PI) / count;
    const isControlled = value !== undefined;

    const [internalIndex, setInternalIndex] = React.useState(defaultIndex + 1); // +1 to account for placeholder

    const selectedIndex = isControlled ? (value ?? 0) + 1 : internalIndex;

    const getItem = React.useCallback(
      (renderIdx: number): string | null => {
        if (renderIdx === 0 || renderIdx === count - 1) return null;
        return items[renderIdx - 1];
      },
      [items, count]
    );

    const setSelectedIndex = React.useCallback(
      (idx: number) => {
        if (!isControlled) {
          setInternalIndex(idx);
        }
        const item = getItem(idx);
        if (item) {
          onValueChange?.(item);
        }
      },
      [isControlled, onValueChange, getItem]
    );

    const contextValue = React.useMemo<WheelPickerContextValue>(
      () => ({
        items,
        selectedIndex,
        setSelectedIndex,
        theta,
        radius: radiusProp,
        count,
      }),
      [items, selectedIndex, setSelectedIndex, theta, radiusProp, count]
    );

    return (
      <WheelPickerContext.Provider value={contextValue}>
        <div ref={ref} className={className} {...props}>
          {children}
        </div>
      </WheelPickerContext.Provider>
    );
  }
);
WheelPicker.displayName = "WheelPicker";

// ---------------------------------------------------------------------------------------------------------------------
// WheelPickerSelect ---------------------------------------------------------------------------------------------------
// ---------------------------------------------------------------------------------------------------------------------

export interface WheelPickerSelectProps
  extends React.HTMLAttributes<HTMLDivElement> {}

const WheelPickerSelect = React.forwardRef<
  HTMLDivElement,
  WheelPickerSelectProps
>(({ className, children, ...props }, ref) => {
  const { selectedIndex, setSelectedIndex, count } = useWheelPickerContext();

  // Helpers -------------------------------------------------------------------------
  const firstReal = 1;
  const lastReal = count - 2;

  const getItem = React.useCallback(
    (renderIdx: number): string | null => {
      if (renderIdx === 0 || renderIdx === count - 1) return null;
      return children ? null : null; // placeholder, unused; we have items separately in Options
    },
    [count, children]
  );

  const moveTo = React.useCallback(
    (idx: number) => {
      if (idx < firstReal || idx > lastReal) return;
      setSelectedIndex(idx);
    },
    [firstReal, lastReal, setSelectedIndex]
  );

  const moveBy = React.useCallback(
    (delta: number) => {
      let idx = selectedIndex + delta;
      // skip empty placeholders
      while (
        (idx === 0 || idx === count - 1) &&
        idx >= firstReal &&
        idx <= lastReal
      ) {
        idx += delta > 0 ? 1 : -1;
      }
      moveTo(idx);
    },
    [selectedIndex, count, firstReal, lastReal, moveTo]
  );

  const handleKeyDown = React.useCallback(
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
      ref={ref}
      role="listbox"
      aria-label="Select option"
      aria-activedescendant={`wheel-option-${selectedIndex}`}
      tabIndex={0}
      className={cn(
        "relative w-full h-6 focus:outline-none border border-transparent focus:border-ring focus:ring-ring/50 focus:ring-2 rounded-md text-left",
        className
      )}
      onKeyDown={handleKeyDown}
      {...props}
    >
      {children}
    </div>
  );
});
WheelPickerSelect.displayName = "WheelPickerSelect";

// ---------------------------------------------------------------------------------------------------------------------
// WheelPickerOptions --------------------------------------------------------------------------------------------------
// ---------------------------------------------------------------------------------------------------------------------

export interface WheelPickerOptionsProps
  extends React.HTMLAttributes<HTMLDivElement> {}

const WheelPickerOptions = React.forwardRef<
  HTMLDivElement,
  WheelPickerOptionsProps
>(({ className, ...props }, ref) => {
  const { items, selectedIndex, setSelectedIndex, theta, radius, count } =
    useWheelPickerContext();

  return (
    <div
      ref={ref}
      className={cn(
        "rounded-md h-full w-full [perspective:1000px] [transform-style:preserve-3d]",
        className
      )}
      {...props}
    >
      <div
        className="relative h-full w-full [transform-style:preserve-3d] transition-transform duration-500 ease-out"
        style={{
          transform: `translateZ(-${radius}px) rotateX(${-selectedIndex * theta}rad)`,
        }}
      >
        {/* First placeholder */}
        <WheelPickerEmpty position="first" />

        {/* Real items */}
        {items.map((item, idx) => {
          const renderIdx = idx + 1; // offset for first placeholder
          const angle = theta * renderIdx;
          const isSelected = renderIdx === selectedIndex;
          return (
            <div
              key={item}
              id={`wheel-option-${renderIdx}`}
              role="option"
              aria-selected={isSelected}
              className={cn(
                "absolute inset-0 select-none [backface-visibility:hidden] transition-transform duration-500 ease-out flex items-center justify-start cursor-pointer"
              )}
              style={{
                transform: `rotateX(${angle}rad) translateZ(${radius}px)`,
                transformStyle: "preserve-3d",
              }}
              onClick={(e) => {
                if (!isSelected) {
                  e.preventDefault();
                  e.stopPropagation();
                  setSelectedIndex(renderIdx);
                }
              }}
            >
              <span
                className={cn(
                  "text-xs transition-colors",
                  isSelected ? "text-foreground" : "text-muted-foreground/70"
                )}
              >
                {item}
              </span>
            </div>
          );
        })}

        {/* Last placeholder */}
        <WheelPickerEmpty position="last" />
      </div>
    </div>
  );
});
WheelPickerOptions.displayName = "WheelPickerOptions";

// ---------------------------------------------------------------------------------------------------------------------
// WheelPickerEmpty (placeholders) -------------------------------------------------------------------------------------
// ---------------------------------------------------------------------------------------------------------------------

type PlaceholderPosition = "first" | "last";

export interface WheelPickerEmptyProps
  extends React.HTMLAttributes<HTMLDivElement> {
  position: PlaceholderPosition;
}

const WheelPickerEmpty = React.forwardRef<
  HTMLDivElement,
  WheelPickerEmptyProps
>(({ position, className, ...props }, ref) => {
  const { theta, radius, count, selectedIndex } = useWheelPickerContext();

  const renderIdx = position === "first" ? 0 : count - 1;
  const angle = theta * renderIdx;

  return (
    <div
      ref={ref}
      id={`wheel-option-${renderIdx}`}
      role="option"
      aria-selected={selectedIndex === renderIdx}
      aria-disabled
      className={cn(
        "absolute inset-0 select-none [backface-visibility:hidden]",
        className
      )}
      style={{
        transform: `rotateX(${angle}rad) translateZ(${radius}px)`,
        transformStyle: "preserve-3d",
      }}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
      }}
      {...props}
    />
  );
});
WheelPickerEmpty.displayName = "WheelPickerEmpty";

// ---------------------------------------------------------------------------------------------------------------------
// Exports -------------------------------------------------------------------------------------------------------------
// ---------------------------------------------------------------------------------------------------------------------

export { WheelPicker, WheelPickerSelect, WheelPickerOptions, WheelPickerEmpty };
