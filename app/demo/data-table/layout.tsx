import { Footer } from "@/app/components/footer";
import { Badge } from "@/components/ui/badge";

export default function BaseLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { slug: string[] };
}) {
  return (
    <main className="container mx-auto flex min-h-screen flex-col gap-4 px-2 py-4 md:px-4 md:py-8">
      <div className="relative flex flex-1 flex-col rounded-lg border border-border/50 bg-background/50 p-4 backdrop-blur-[2px] sm:p-8">
        {children}
        <Badge
          variant="outline"
          className="absolute -top-2.5 left-4 bg-background sm:left-8"
        >
          Work in progress
        </Badge>
      </div>
      <Footer />
    </main>
  );
}
