import { cn } from "@/lib/utils";
import React from "react";

/**
 * The block every post opens with: title, a mono meta line, and optional
 * actions to the right. Two columns instead of nested wrappers — title and
 * meta claim column one, actions span both rows in column two — so every part
 * carries its own placement and callers only list what they have.
 */
export function PageHeader({
  className,
  ...props
}: React.HTMLAttributes<HTMLElement>) {
  return (
    <header
      className={cn(
        "grid grid-cols-[minmax(0,1fr)_auto] items-end gap-x-4",
        className,
      )}
      {...props}
    />
  );
}

export function PageHeaderTitle({
  className,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h1
      className={cn("col-start-1 font-cal text-lg text-foreground", className)}
      {...props}
    />
  );
}

/**
 * The `·` between items belongs to the meta line, not to the caller — written
 * out by hand at each call site it drifts. Pass the values, get the separators.
 */
export function PageHeaderMeta({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "col-start-1 flex flex-wrap font-mono text-xs font-light text-muted-foreground",
        className,
      )}
      {...props}
    >
      {React.Children.toArray(children).map((child, index) => (
        <React.Fragment key={index}>
          {index > 0 ? <span className="mx-1">·</span> : null}
          {child}
        </React.Fragment>
      ))}
    </div>
  );
}

export function PageHeaderActions({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "col-start-2 row-span-2 row-start-1 flex items-end gap-2",
        className,
      )}
      {...props}
    />
  );
}
