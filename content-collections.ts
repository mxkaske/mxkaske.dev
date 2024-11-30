import { defineCollection, defineConfig } from "@content-collections/core";
import { compileMDX } from "@content-collections/mdx";
import readingTime from "reading-time";
import autolinkHeadings from "./content/plugins/autolink-headings";
import prettyCode from "./content/plugins/rehype-pretty-code";
import slug from "rehype-slug";

const crafts = defineCollection({
  name: "crafts",
  directory: "content/crafts",
  include: "*.mdx",
  schema: (z) => ({
    title: z.string(),
    date: z.coerce.date(),
    githubUrl: z.string().url(),
    description: z.string(),
    component: z.string(),
  }),
  transform: async (document, context) => {
    const mdx = await compileMDX(context, document, {
      // @ts-expect-error
      rehypePlugins: [slug, autolinkHeadings, prettyCode],
    });
    return {
      ...document,
      slug: document._meta.fileName.replace(/\.mdx$/, ""),
      url: `/post/${document._meta.fileName.replace(/\.mdx$/, "")}`,
      readingTime: readingTime(document.content).text,
      mdx,
    };
  },
});

const brews = defineCollection({
  name: "brews",
  directory: "content/brews",
  include: "*.mdx",
  schema: (z) => ({
    title: z.string(),
    date: z.coerce.date(),
    description: z.string(),
  }),
  transform: async (document, context) => {
    const mdx = await compileMDX(context, document, {
      // @ts-expect-error
      rehypePlugins: [slug, autolinkHeadings, prettyCode],
    });
    return {
      ...document,
      slug: document._meta.fileName.replace(/\.mdx$/, ""),
      url: `/post/${document._meta.fileName.replace(/\.mdx$/, "")}`,
      readingTime: readingTime(document.content).text,
      mdx,
    };
  },
});

export default defineConfig({
  collections: [crafts, brews],
});
