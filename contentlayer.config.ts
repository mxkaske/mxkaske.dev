import { defineDocumentType, makeSource } from "contentlayer/source-files";
import readingTime from "reading-time";
import autolinkHeadings from "./contentlayer/plugins/autolink-headings";
import prettyCode from "./contentlayer/plugins/rehype-pretty-code";
import slug from "rehype-slug";


// FIXME: Post != Craft

export const Post = defineDocumentType(() => ({
  name: "Post",
  filePathPattern: `**/*.mdx`,
  contentType: "mdx",
  fields: {
    title: {
      type: "string",
      description: "The title of the post",
      required: true,
    },
    date: {
      type: "date",
      description: "The date of the post",
      required: true,
    },
    githubUrl: {
      type: "string",
      description: "The github URL of the post",
      required: true,
    },
    description: {
      type: "string",
      description: "The description of the post",
      required: true,
    },
    component: {
      type: "string",
      description: "The Component of the post",
      required: true,
    },
  },
  computedFields: {
    slug: {
      type: "string",
      resolve: (post) => `${post._raw.flattenedPath}`,
    },
    url: {
      type: "string",
      resolve: (post) => `/post/${post._raw.flattenedPath}`,
    },
    readingTime: {
      type: "string",
      resolve: (post) => readingTime(post.body.raw).text
    }
  },
}));

export default makeSource({
  contentDirPath: "content/post",
  documentTypes: [Post],
  mdx: {
    rehypePlugins: [slug, autolinkHeadings, prettyCode],
  },
});
