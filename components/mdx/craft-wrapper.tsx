import { cn } from "@/lib/utils";
import * as React from "react";

interface CraftWrapperProps extends React.HTMLAttributes<HTMLDivElement> {}

// https://github.com/shadcn/ui/blob/9a6b9344213ccc9b21d2ce734c050a357259ba51/apps/www/lib/rehype-component.ts#L12
export function CraftWrapper({
  className,
  children,
  ...props
}: CraftWrapperProps) {
  return (
    <div
      // TODO: make the height fixed and the box scrollable. That way, the container will have always the same size for different craft components. (which means avoid py/px)
      className={cn(
        "my-8 border rounded-md border-border flex flex-col w-full p-8 sm:p-16 md:p-24 items-center",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}
