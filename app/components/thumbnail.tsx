import { cn } from "@/lib/utils";
import Link from "next/link";

export function Thumbnail({
  url,
  title,
  description,
  component,
  className,
}: {
  url: string;
  title: string;
  description: string;
  component: React.ReactElement;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "group/card w-full rounded-md border border-border",
        className
      )}
    >
      <div className="relative flex h-32 w-full items-center justify-center overflow-hidden rounded-t-md">
        <div className="absolute h-full min-h-full w-full p-5">
          {/* FIXME: h-full fucks up FancyBox but works for FancyArea */}
          <div className="flex items-center justify-center">{component}</div>
        </div>
      </div>
      <Link href={url}>
        <div className="group/link rounded-b-md border-t border-border bg-muted p-3">
          <p className="mb-1 font-cal font-bold text-foreground underline-offset-2 group-hover/link:underline">
            {title}
          </p>
          <p className="text-sm font-light text-muted-foreground">
            {description}
          </p>
        </div>
      </Link>
    </div>
  );
}
