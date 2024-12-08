import { Link } from "@/components/mdx/link";

export default function NotFound() {
  return (
    <div className="min-h-screen min-w-screen flex flex-col items-center justify-center gap-3">
      <div className="space-y-1 text-center">
        <h2 className="font-cal text-6xl">404 - Not Found</h2>
        <p className="text-lg text-muted-foreground">
          The page you are looking for doesn't exist.
        </p>
      </div>
      <Link href="/">Return Home</Link>
    </div>
  );
}
