import React from "react";
import { Footer } from "./_components/footer";
import { Banner } from "./_components/banner";
import { Metadata } from "next";
import { Name } from "./_components/name";
import { Link } from "@/components/mdx/link";

export const metadata: Metadata = {
  title: "mxkaske.dev",
  description: "Never. Stop. Crafting.",
  metadataBase: new URL("https://mxkaske.dev"),
  twitter: {
    images: [`/api/og`],
    card: "summary_large_image",
    title: "mxkaske.dev",
    description: "Never. Stop. Crafting.",
  },
  openGraph: {
    type: "website",
    images: [`/api/og`],
    title: "mxkaske.dev",
    description: "Never. Stop. Crafting.",
  },
};

export default function Home() {
  return (
    <div className="container mx-auto flex min-h-screen max-w-[calc(65ch+100px)] flex-col gap-4 px-2 py-4 md:px-4 md:py-8">
      <Banner />
      <div className="flex flex-1 flex-col rounded-lg border border-border/50 bg-background/50 p-4 backdrop-blur-[2px] sm:p-8">
        <main className="mb-8 flex flex-1 flex-col gap-6 sm:gap-8">
          <p>
            <Name />
          </p>
          <div className="flex flex-col gap-4">
            <h1 className="font-cal text-2xl">Never. Stop. Crafting.</h1>
            {/* ADD: Open-Source Advocate */}
            <ul className="list-inside list-disc space-y-1 marker:text-muted-foreground">
              {links.map((link) => (
                <li key={link.href}>
                  <Link href={link.href}>{link.label}</Link>
                </li>
              ))}
            </ul>
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
}

const links = [
  { label: "craft.mxkaske.dev", href: "https://craft.mxkaske.dev" },
  { label: "openstatus.dev", href: "https://openstatus.dev" },
  { label: "light.openstatus.dev", href: "https://light.openstatus.dev" },
  { label: "time.openstatus.dev", href: "https://time.openstatus.dev" },
  {
    label: "data-table.openstatus.dev",
    href: "https://data-table.openstatus.dev",
  },
];
