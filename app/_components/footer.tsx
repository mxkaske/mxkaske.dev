import { Link } from "@/components/mdx/link";

export function Footer() {
  return (
    <footer className="px-4 sm:px-8">
      <p className="text-sm font-light text-muted-foreground">
        That is <span className="text-foreground">3rd</span> redesign over the
        years. See the evolution by going back to the{" "}
        {/* TODO: add HoverCards with preview image */}
        <Link href="https://v1.mxkaske.dev">v1</Link> and{" "}
        <Link href="https://v2.mxkaske.dev">v2</Link> versions.
      </p>
    </footer>
  );
}
