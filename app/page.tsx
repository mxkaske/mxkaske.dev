import { allPosts } from "@/.contentlayer/generated";
import { ModeToggle } from "@/components/theme/toggle-mode";
import { components } from "@/lib/mdx";
import { Github, Twitter } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <div className="mx-auto container max-w-prose min-h-screen flex flex-col py-16">
      <main className="flex-1">
        <h1 className="font-cal font-bold tracking-tight text-xl mb-4 text-foreground">
          mx<span className="text-muted-foreground">kaske</span>
        </h1>
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
                {/* group-hover/card:backdrop-blur-[2px] backdrop-blur-sm */}
                <div className="w-full h-32 rounded-t-md flex items-center justify-center overflow-hidden">
                  <Component />
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
  );
}
