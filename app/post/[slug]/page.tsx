import { allPosts } from "@/.contentlayer/generated";
import { notFound } from "next/navigation";
import { Content } from "./content";
import { Github } from "lucide-react";
import { Link } from "@/components/mdx/link";

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
  }).format(date);
}

export default function CraftPage({ params }: { params: { slug: string } }) {
  const post = allPosts.find((c) => c.url === `/post/${params.slug}`);
  if (!post) {
    notFound();
  }
  return (
    <article className="max-w-prose mx-auto">
      <div className="flex justify-between items-end">
        <div>
          <p className="text-foreground font-cal font-bold text-lg">
            {post.title}
          </p>
          <p className="text-muted-foreground text-sm font-light">
            {formatDate(new Date(post.date))}
          </p>
        </div>
        <a
          href={post.githubUrl}
          target="_blank"
          rel="noreferrer"
          className="p-2 text-foreground bg-background rounded-md hover:bg-muted"
        >
          <Github className="h-5 w-5" />
        </a>
      </div>
      <Content post={post} />
      <div className="mt-8">
        <Link href="/">Back</Link>
      </div>
    </article>
  );
}
