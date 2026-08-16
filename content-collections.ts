import { defineCollection, defineConfig } from "@content-collections/core";
import { compileMDX } from "@content-collections/mdx";
import fs from "node:fs/promises";
import path from "node:path";
import readingTime from "reading-time";
import sharp from "sharp";
import autolinkHeadings from "./content/plugins/autolink-headings";
import prettyCode from "./content/plugins/rehype-pretty-code";
import slug from "rehype-slug";

// Longest edge of the inlined blur placeholder. Next's own static-import blur uses 8px;
// we render our own blur layer, so a bit more structure survives the CSS blur.
const BLUR_SIZE = 16;

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
    componentClassName: z.string().optional(),
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

const photos = defineCollection({
  name: "photos",
  directory: "content/photos",
  include: "*.mdx",
  schema: (z) => ({
    title: z.string(),
    image: z.string().startsWith("/assets/gallery/"),
    alt: z.string(),
    location: z.string(),
    date: z.coerce.date(),
    camera: z.string(),
    // Drives how wide the tile sits in the index grid. Defaults to the actual
    // pixel dimensions — set it explicitly to override (e.g. a square frame you
    // want to run wide, or a panorama you'd rather keep narrow).
    orientation: z.enum(["vertical", "horizontal"]).optional(),
  }),
  transform: async (document, context) => {
    const mdx = await compileMDX(context, document, {
      // @ts-expect-error
      rehypePlugins: [slug, autolinkHeadings, prettyCode],
    });

    // The `src` is a string, not a static import, so Next can't derive intrinsic
    // dimensions or a blur placeholder. Generate both at build time instead.
    const file = path.join(process.cwd(), "public", document.image);
    const buffer = await fs.readFile(file);
    const { width, height } = await sharp(buffer).metadata();
    const blur = await sharp(buffer)
      .resize(BLUR_SIZE, BLUR_SIZE, { fit: "inside" })
      .webp({ quality: 60 })
      .toBuffer();

    return {
      ...document,
      slug: document._meta.fileName.replace(/\.mdx$/, ""),
      url: `/photo/${document._meta.fileName.replace(/\.mdx$/, "")}`,
      readingTime: readingTime(document.content).text,
      width,
      height,
      // Square frames fall to `vertical` so they stay in a single column.
      orientation:
        document.orientation ?? (width > height ? "horizontal" : "vertical"),
      blurDataURL: `data:image/webp;base64,${blur.toString("base64")}`,
      mdx,
    };
  },
});

export default defineConfig({
  collections: [crafts, brews, photos],
});
