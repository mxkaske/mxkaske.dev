import { Link } from "@/components/mdx/link";

export function Banner() {
  return (
    <p className="text-muted-foreground text-center">
      Interested in more crafting? Check out{" "}
      <Link href="https://openstatus.dev">OpenStatus</Link>.
    </p>
  );
}
