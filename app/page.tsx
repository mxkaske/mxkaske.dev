import React from "react";
import { Post, allPosts } from "@/.contentlayer/generated";
import { components } from "@/lib/mdx";
import Link from "next/link";
import { Footer } from "./components/footer";

const allPostsByMonth = allPosts.reduce((acc, curr) => {
  const month = new Date(curr.date).toLocaleString('default', { month: 'long', year: "numeric" });
  if (acc.hasOwnProperty(month)) {
    acc[month].push(curr);
  } else {
    acc[month] = [curr];
  }

  return acc;
}, {} as { [month: string]: Post[] });

export default function Home() {
  return (
    <div className="mx-auto container max-w-[calc(65ch+100px)] min-h-screen flex flex-col py-4 md:py-8 px-2 md:px-4">
      <div className="backdrop-blur-[2px] flex-1 flex flex-col rounded-lg bg-background/50 p-4 sm:p-8 border border-border/50">
        <main className="flex-1 mb-8">
          <h1 className="font-cal font-bold tracking-tight text-lg text-foreground mb-8">
            mx<span className="text-muted-foreground">kaske</span>
          </h1>
          <div className="grid gap-4 sm:gap-8 sm:grid-cols-[auto_1fr]">
            {Object.keys(allPostsByMonth).map((month => {
              return <React.Fragment key={month}>
                <div><p className="mb-4 text-sm text-muted-foreground font-light font-mono">{month}</p></div>
                <div className="grid gap-6">
                  {allPostsByMonth[month].sort((a, b) => (a.date > b.date ? -1 : 1))
                    .map((post) => {
                      const Component =
                        components[post.component as keyof typeof components];
                      return (
                        <div
                          key={post.slug}
                          className="border border-border rounded-md max-w-sm group/card"
                        >
                          <div className="w-full h-32 rounded-t-md flex items-center justify-center overflow-hidden relative">
                            <div className="absolute p-5 w-full h-full min-h-full">
                              {/* FIXME: h-full fucks up FancyBox but works for FancyArea */}
                              <div className="flex items-center justify-center">
                                <Component />
                              </div>
                            </div>
                          </div>
                          <Link href={post.url}>
                            <div className="bg-muted p-3 border-t border-border rounded-b-md group/link">
                              <p className="font-bold font-cal text-foreground mb-1 group-hover/link:underline underline-offset-2">
                                {post.title}
                              </p>
                              <p className="text-muted-foreground text-sm font-light">
                                {post.description}
                              </p>
                            </div>
                          </Link>
                        </div>
                      );
                    })}
                </div>
              </React.Fragment>
            }))
            }
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
}
