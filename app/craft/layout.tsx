"use client";

import { Header } from "../_components/header";
import { Footer } from "./_components/footer";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="container mx-auto flex min-h-screen flex-col gap-4 px-2 py-4 md:px-4 md:py-8">
      <Header />
      <main className="flex flex-1 flex-col gap-8 rounded-lg border border-border/50 bg-background/50 p-4 backdrop-blur-[2px] sm:p-8">
        {children}
      </main>
      <Footer />
    </div>
  );
}
