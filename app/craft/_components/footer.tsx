import { Link } from "@/components/mdx/link";

export function Footer() {
  return (
    <footer className="flex items-center px-4 sm:px-8">
      <Link href="https://twitter.com/mxkaske">Twitter</Link>
      <span className="mx-2">·</span>
      <Link href="https://github.com/mxkaske/mxkaske.dev">GitHub</Link>
    </footer>
  );
}
