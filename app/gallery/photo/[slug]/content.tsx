"use client";

import { Photo } from "@/.content-collections/generated";
import { components } from "@/lib/mdx";
import { MDXContent } from "@content-collections/mdx/react";
import React from "react";

export function Content({ photo }: { photo: Photo }) {
  React.useEffect(() => {
    fetch(`/api/views?slug=${photo.slug}`, { method: "POST" });
  }, [photo.slug]);

  return (
    <div className="prose mx-auto dark:prose-invert prose-headings:font-cal prose-headings:font-normal prose-blockquote:font-light">
      <MDXContent components={components} code={photo.mdx} />
    </div>
  );
}
