import { Link } from "@/components/mdx/link";
import { ModeToggle } from "@/components/theme/toggle-mode";
import { cn } from "@/lib/utils";

export function Footer({
  className,
  ...props
}: React.PropsWithChildren<React.HTMLAttributes<HTMLElement>>) {
  return (
    <footer
      className={cn("flex items-center justify-between", className)}
      {...props}
    >
      <div>
        <Link href="https://github.com/mxkaske/mxkaske.dev">GitHub</Link>
        <span className="mx-2 text-muted-foreground">·</span>
        <Link href="https://openstatus.dev">OpenStatus</Link>
      </div>
      <div>
        <ModeToggle />
      </div>
    </footer>
  );
}
