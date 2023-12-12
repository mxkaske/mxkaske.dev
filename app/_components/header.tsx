import { ModeToggle } from "@/components/theme/toggle-mode";
import Link from "next/link";

export function Header() {
  return (
    <header className="flex items-center justify-between px-4 sm:px-8">
      <h1 className="text-lg font-bold tracking-tight text-foreground">
        <Link href="/">
          mx<span className="text-muted-foreground">kaske</span>
        </Link>
      </h1>
      <ModeToggle />
    </header>
  );
}
