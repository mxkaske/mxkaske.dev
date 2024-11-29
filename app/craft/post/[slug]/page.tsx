import { allPosts } from "@/.content-collections/generated";
import { notFound } from "next/navigation";
import { Content } from "./content";
import { ChevronLeft, Github, Link as LinkIcon } from "lucide-react";
import { Link } from "@/components/mdx/link";

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
  }).format(date);
}

function formatNumber(value: number) {
  return new Intl.NumberFormat("en-US").format(value);
}

export default async function CraftPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const slug = (await params).slug;
  const post = allPosts.find((c) => c.slug === slug);
  console.log({ allPosts, slug });
  if (!post) {
    notFound();
  }

  // const res = await fetch(`${URL}/api/views?slug=${post.slug}`, {
  //   next: { revalidate: 10 },
  // });
  // const views = await res.json();

  return (
    <article>
      <div className="flex items-end justify-between">
        <div>
          <p className="font-cal text-lg font-bold text-foreground">
            {post.title}
          </p>
          <p className="font-mono text-xs font-light text-muted-foreground">
            {formatDate(new Date(post.date))} &#x22C5; {post.readingTime}
          </p>
        </div>
        <div className="flex gap-2">
          {/* <button
            className="p-2 text-foreground bg-background rounded-md hover:bg-muted"
          >
            <LinkIcon className="h-5 w-5" />
          </button> */}
          <a
            href={post.githubUrl}
            target="_blank"
            rel="noreferrer"
            className="rounded-md bg-background p-2 text-foreground hover:bg-muted"
          >
            <Github className="h-5 w-5" />
          </a>
        </div>
      </div>
      <Content post={post} />
      <div className="mt-8 flex items-center justify-between">
        <div>
          <Link href="/">Back</Link>
        </div>
        <div>
          {/* <p className="text-muted-foreground font-mono text-sm tracking-tighter">
            {formatNumber(views)} views
          </p> */}
        </div>
      </div>
    </article>
  );
}
