import { Footer } from "@/app/components/footer";
import * as React from "react";


export default function BaseLayout({
    children,
    params,
  }: {
    children: React.ReactNode;
    params: { slug: string[] };
  }) {
    return (
      <main className="mx-auto container min-h-screen flex flex-col py-4 md:py-8 px-2 md:px-4">
        <div className="backdrop-blur-[2px] flex-1 flex flex-col rounded-lg bg-background/50 p-4 sm:p-8 border border-border/50">
          {children}
        </div>
        <Footer />
      </main>
    );
  }
  