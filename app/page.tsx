"use client";

import { Header } from "./_components/header";
import { Footer } from "./_components/footer";
import { Link } from "@/components/mdx/link";
import { contacts, projects } from "@/components/home/_config";
import { ContentCard } from "@/components/home/content-card";

export default function Home() {
  return (
    <div className="container mx-auto flex min-h-screen flex-col gap-4 px-2 py-4 md:px-4 md:py-8">
      <Header />
      <main className="flex flex-1 flex-col gap-8 rounded-lg border border-border/50 bg-background/50 p-4 backdrop-blur-[2px] sm:p-8">
        <div className="grid gap-2">
          <h2 className="text-2xl font-semibold text-foreground">
            Building. Learning. Sharing.
          </h2>
          <h3 className="text-lg text-muted-foreground">
            Just call me Max.{" "}
            <Link href="https://twitter.com/mxkaske">Follow me</Link> for more
            updates.
          </h3>
        </div>
        {/* https://caniuse.com/mdn-css_properties_grid-template-rows_masonry */}
        <div className="grid grid-flow-dense grid-cols-1 grid-rows-[masonry] gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {[...projects, ...contacts].map((item, i) => (
            <ContentCard
              key={i}
              className="first:sm:col-span-2 first:xl:col-start-2"
              {...item}
            />
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}
