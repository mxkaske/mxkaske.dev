import { allPosts } from "@/.contentlayer/generated";
import { ModeToggle } from "@/components/theme/toggle-mode";
import { components } from "@/lib/mdx";
import { Github, Twitter } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <div className="mx-auto container max-w-prose min-h-screen flex flex-col py-4 md:py-8 px-2 md:px-4">
      <div className="backdrop-blur-[2px] flex-1 flex flex-col rounded-lg bg-background/30 p-4 md:p-8">
        <main className="flex-1">
          <h1 className="font-cal font-bold tracking-tight text-xl mb-8 text-foreground">
            mx<span className="text-muted-foreground">kaske</span>
          </h1>
          <div className="grid gap-6">
            {allPosts
              .sort((a, b) => (a.date > b.date ? 1 : -1))
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
        </main>
        <footer className="w-full flex justify-between items-center">
          <div className="flex space-x-2">
            <a
              href="https://twitter.com/mxkaske"
              target="_blank"
              rel="noreferrer"
              className="p-2 text-foreground bg-background rounded-md hover:bg-muted"
            >
              <Twitter className="h-5 w-5" />
            </a>
            <a
              href="https://github.com/mxkaske/mxkaske.dev"
              target="_blank"
              rel="noreferrer"
              className="p-2 text-foreground bg-background rounded-md hover:bg-muted"
            >
              <Github className="h-5 w-5" />
            </a>
          </div>
          <div>
            <ModeToggle />
          </div>
        </footer>
      </div>
    </div>
  );
}
