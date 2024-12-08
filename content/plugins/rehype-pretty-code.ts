import rehypePrettyCode, { Options } from "rehype-pretty-code";

const config = {
  keepBackground: false,
  onVisitLine(node) {
    // Prevent lines from collapsing in `display: grid` mode, and
    // allow empty lines to be copy/pasted
    if (node.children.length === 0) {
      node.children = [{ type: "text", value: " " }];
    }
  },
  onVisitHighlightedLine(node) {
    node.properties.className?.push("highlighted");
  },
  onVisitHighlightedChars(node) {
    node.properties.className = ["word"];
  },
} satisfies Options;

const prettyCode = [rehypePrettyCode, config];

export default prettyCode;
