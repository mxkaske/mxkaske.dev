import { cn } from "@/lib/utils";
import { Name } from "./name";
import { Link } from "@/components/mdx/link";

export function Header({
  className,
  ...props
}: React.PropsWithChildren<React.HTMLAttributes<HTMLElement>>) {
  return (
    <header
      className={cn("flex items-center justify-between", className)}
      {...props}
    >
      <div>
        <Name />
      </div>
      <div>
        <Link href="https://craft.mxkaske.dev">Craft</Link>
        <span className="mx-2 text-muted-foreground">·</span>
        <Link href="https://brew.mxkaske.dev">Brew</Link>
      </div>
    </header>
  );
}
