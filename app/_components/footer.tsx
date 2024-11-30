import { Link } from "@/components/mdx/link";
import { ModeToggle } from "@/components/theme/toggle-mode";
import { cn } from "@/lib/utils";

export function Footer({
  className,
  ...props
}: React.PropsWithChildren<React.HTMLAttributes<HTMLElement>>) {
  return (
    <footer
      className={cn("relative flex items-center justify-center", className)}
      {...props}
    >
      <Link href="https://twitter.com/mxkaske">Twitter</Link>
      <span className="mx-2 text-muted-foreground">·</span>
      <Link href="https://github.com/mxkaske/mxkaske.dev">GitHub</Link>
      <span className="mx-2 text-muted-foreground">·</span>
      <Link href="https://openstatus.dev">OpenStatus</Link>
      <div className="absolute right-0">
        <ModeToggle />
      </div>
    </footer>
  );
}
