import { Footer } from "./footer";
import { Header } from "./header";

export function BasicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="container mx-auto flex min-h-screen max-w-[calc(65ch+100px)] flex-col gap-4 px-2 py-4 md:px-4 md:py-8">
      <Header className="px-4 sm:px-8" />
      <main className="flex flex-1 flex-col rounded-lg border border-border/50 bg-background/50 p-4 backdrop-blur-[2px] sm:p-8">
        {children}
      </main>
      <Footer />
    </div>
  );
}
