import Link from "next/link";

export function Name() {
  return (
    <Link href="https://mxkaske.dev" className="group">
      <span className="font-cal text-lg text-foreground">
        <span>mx</span>
        <span className="text-muted-foreground group-hover:text-foreground">
          kaske
        </span>
      </span>
    </Link>
  );
}
