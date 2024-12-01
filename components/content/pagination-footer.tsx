import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";

interface PaginationFooterProps {
  prev?: { url: string; slug: string; title: string };
  next?: { url: string; slug: string; title: string };
  className?: string;
}

export function PaginationFooter({
  prev,
  next,
  className,
}: PaginationFooterProps) {
  return (
    <div className={cn("flex items-center justify-between", className)}>
      {prev ? (
        <Link
          href={prev.url}
          className="group max-w-[200px] truncate sm:max-w-[300px]"
        >
          <span className="flex items-center gap-1">
            <ChevronLeft className="h-3 w-3 text-muted-foreground group-hover:text-foreground" />
            <span className="text-xs text-muted-foreground">Previous</span>
          </span>
          <span className="text-sm text-foreground underline underline-offset-4 decoration-border group-hover:decoration-foreground">
            {prev.title}
          </span>
        </Link>
      ) : (
        <div />
      )}
      {next ? (
        <Link
          href={next.url}
          className="group max-w-[200px] truncate sm:max-w-[300px]"
        >
          <span className="flex items-center justify-end gap-1">
            <span className="text-xs text-muted-foreground">Next</span>
            <ChevronRight className="h-3 w-3 text-muted-foreground group-hover:text-foreground" />
          </span>

          <span className="text-sm text-foreground underline underline-offset-4 decoration-border group-hover:decoration-foreground">
            {next.title}
          </span>
        </Link>
      ) : null}
    </div>
  );
}
