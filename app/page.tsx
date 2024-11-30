import React from "react";
import { Metadata } from "next";
import { Link } from "@/components/mdx/link";
import { BasicLayout } from "./_components/basic-layout";
import { Separator } from "@/components/ui/separator";

export const metadata: Metadata = {
  title: "mxkaske.dev",
  description: "Never. Stop. Building.",
  metadataBase: new URL("https://mxkaske.dev"),
  twitter: {
    images: [`/api/og`],
    card: "summary_large_image",
    title: "mxkaske.dev",
    description: "Never. Stop. Building.",
  },
  openGraph: {
    type: "website",
    images: [`/api/og`],
    title: "mxkaske.dev",
    description: "Never. Stop. Building.",
  },
};

export default function Home() {
  return (
    <BasicLayout>
      <div className="space-y-8">
        <h1 className="font-cal text-3xl">Never. Stop. Building.</h1>
        {/* ADD: Open-Source Advocate */}
        <div className="space-y-1">
          <p className="font-medium text-muted-foreground">Building</p>
          <ul className="list-inside list-disc space-y-1 marker:text-muted-foreground">
            {links.map((link) => (
              <li key={link.href}>
                <Link href={link.href}>{link.label}</Link>
              </li>
            ))}
          </ul>
        </div>
        <Separator />
        <div className="space-y-1">
          <p className="font-medium text-muted-foreground">Sharing</p>
          <ul className="list-inside list-disc space-y-1 marker:text-muted-foreground">
            {socials.map((social) => (
              <li key={social.href}>
                <Link href={social.href}>{social.label}</Link>
              </li>
            ))}
          </ul>
        </div>
        <Separator />
        <div className="space-y-1">
          <p className="font-medium text-muted-foreground">Versioning</p>
          <ul className="list-inside list-disc space-y-1 marker:text-muted-foreground">
            {versions.map((version) => (
              <li key={version.href}>
                <Link href={version.href}>{version.label}</Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </BasicLayout>
  );
}

const links = [
  { label: "openstatus.dev", href: "https://openstatus.dev" },
  { label: "craft.mxkaske.dev", href: "https://craft.mxkaske.dev" },
  { label: "light.openstatus.dev", href: "https://light.openstatus.dev" },
  { label: "time.openstatus.dev", href: "https://time.openstatus.dev" },
  {
    label: "data-table.openstatus.dev",
    href: "https://data-table.openstatus.dev",
  },
];

const socials = [
  { label: "GitHub", href: "https://github.com/mxkaske" },
  { label: "Twitter", href: "https://twitter.com/mxkaske" },
  { label: "LinkedIn", href: "https://linkedin.com/in/mxkaske" },
  { label: "BlueSky", href: "https://bsky.app/profile/mxkaske.dev" },
];

const versions = [
  { label: "v1.mxkaske.dev", href: "https://v1.mxkaske.dev" },
  { label: "v2.mxkaske.dev", href: "https://v2.mxkaske.dev" },
];
