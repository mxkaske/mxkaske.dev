import { Link } from "@/components/mdx/link";
import { ModeToggle } from "@/components/theme/toggle-mode";

export function Footer() {
  return (
    <footer className="relative flex items-center justify-center">
      <Link href="/">Home</Link>
      <span className="mx-2">·</span>
      <Link href="https://twitter.com/mxkaske">Twitter</Link>
      <span className="mx-2">·</span>
      <Link href="https://github.com/mxkaske/mxkaske.dev">GitHub</Link>
      <span className="mx-2">·</span>
      <Link href="https://openstatus.dev">OpenStatus</Link>
      <div className="absolute right-0">
        <ModeToggle />
      </div>
    </footer>
  );
}
