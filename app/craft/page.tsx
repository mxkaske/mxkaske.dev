import React from "react";
import { type Post, allPosts } from "@/.content-collections/generated";
import { components } from "@/lib/mdx";
import { Footer } from "../_components/footer";
import { Banner } from "../_components/banner";
import { Thumbnail } from "../_components/thumbnail";
import Image from "next/image";
import { Metadata } from "next";
import { Name } from "../_components/name";

export const metadata: Metadata = {
  title: "craft.mxkaske.dev",
  description: "Never stop crafting.",
  metadataBase: new URL("https://craft.mxkaske.dev"),
  twitter: {
    images: [`/api/og`],
    card: "summary_large_image",
    title: "craft.mxkaske.dev",
    description: "Never stop crafting.",
  },
  openGraph: {
    type: "website",
    images: [`/api/og`],
    title: "craft.mxkaske.dev",
    description: "Never stop crafting.",
  },
};

const allPostsByMonth = allPosts.reduce(
  (acc, curr) => {
    const month = new Date(curr.date).toLocaleString("default", {
      month: "long",
      year: "numeric",
    });
    if (acc.hasOwnProperty(month)) {
      acc[month].push(curr);
    } else {
      acc[month] = [curr];
    }

    return acc;
  },
  {} as { [month: string]: Post[] },
);

export default function Home() {
  return (
    <div className="container mx-auto flex min-h-screen max-w-[calc(65ch+100px)] flex-col gap-4 px-2 py-4 md:px-4 md:py-8">
      <Banner />
      <div className="flex flex-1 flex-col rounded-lg border border-border/50 bg-background/50 p-4 backdrop-blur-[2px] sm:p-8">
        <main className="mb-8 grid flex-1 gap-6 sm:gap-8">
          <h1>
            <Name />
          </h1>
          <div className="grid gap-6 sm:grid-cols-[auto_1fr] sm:gap-8">
            {/* REMINDER: extract into list */}
            <div>
              <p className="font-mono text-sm font-light text-muted-foreground">
                {new Date("16. August 2024").toLocaleString("default", {
                  month: "long",
                  year: "numeric",
                })}
              </p>
            </div>
            <div className="grid gap-6 sm:gap-4">
              <Thumbnail
                url="/demo/data-table"
                title="Data Table"
                description="A data table with controls and cmdk filters."
                component={
                  <Image
                    src="/assets/data-table.png"
                    fill={true}
                    alt="data-table"
                    className="object-cover transition-transform group-hover/card:scale-105"
                  />
                }
              />
            </div>
            {Object.keys(allPostsByMonth)
              .sort((a, b) =>
                new Date(a).getTime() > new Date(b).getTime() ? -1 : 1,
              )
              .map((month) => {
                return (
                  <React.Fragment key={month}>
                    <div>
                      <p className="font-mono text-sm font-light text-muted-foreground">
                        {month}
                      </p>
                    </div>
                    <div className="grid gap-6 sm:gap-4">
                      {allPostsByMonth[month]
                        .sort((a, b) => (a.date > b.date ? -1 : 1))
                        .map((post) => {
                          const Component =
                            components[
                              post.component as keyof typeof components
                            ];
                          return (
                            <Thumbnail
                              key={post.slug}
                              url={post.url}
                              title={post.title}
                              description={post.description}
                              component={<Component />}
                            />
                          );
                        })}
                    </div>
                  </React.Fragment>
                );
              })}
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
}
