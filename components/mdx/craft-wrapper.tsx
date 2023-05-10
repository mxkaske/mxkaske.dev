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
      className={cn(
        "not-prose my-8 border rounded-md border-border flex flex-col w-full py-32 px-16 items-center",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
