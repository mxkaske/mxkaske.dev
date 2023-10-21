import React from "react";
import { Post, allPosts } from "@/.contentlayer/generated";
import { components } from "@/lib/mdx";
import Link from "next/link";
import { Footer } from "./components/footer";

const allPostsByMonth = allPosts.reduce((acc, curr) => {
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
}, {} as { [month: string]: Post[] });

export default function Home() {
  return (
    <div className="container mx-auto flex min-h-screen max-w-[calc(65ch+100px)] flex-col px-2 py-4 md:px-4 md:py-8">
      <div className="flex flex-1 flex-col rounded-lg border border-border/50 bg-background/50 p-4 backdrop-blur-[2px] sm:p-8">
        <main className="mb-8 flex-1">
          <h1 className="mb-8 font-cal text-lg font-bold tracking-tight text-foreground">
            mx<span className="text-muted-foreground">kaske</span>
          </h1>
          <div className="grid gap-6 sm:grid-cols-[auto_1fr] sm:gap-8">
            {Object.keys(allPostsByMonth)
              .sort((a, b) =>
                new Date(a).getTime() > new Date(b).getTime() ? -1 : 1
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
                            <div
                              key={post.slug}
                              className="group/card max-w-sm rounded-md border border-border"
                            >
                              <div className="relative flex h-32 w-full items-center justify-center overflow-hidden rounded-t-md">
                                <div className="absolute h-full min-h-full w-full p-5">
                                  {/* FIXME: h-full fucks up FancyBox but works for FancyArea */}
                                  <div className="flex items-center justify-center">
                                    <Component />
                                  </div>
                                </div>
                              </div>
                              <Link href={post.url}>
                                <div className="group/link rounded-b-md border-t border-border bg-muted p-3">
                                  <p className="mb-1 font-cal font-bold text-foreground underline-offset-2 group-hover/link:underline">
                                    {post.title}
                                  </p>
                                  <p className="text-sm font-light text-muted-foreground">
                                    {post.description}
                                  </p>
                                </div>
                              </Link>
                            </div>
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
