const { withContentCollections } = require("@content-collections/next");

/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return {
      beforeFiles: [
        {
          source:
            "/:path((?!api|assets|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
          has: [
            {
              type: "host",
              value:
                process.env.VERCEL_ENV === "production"
                  ? "craft.mxkaske.dev"
                  : "craft.localhost",
            },
          ],
          destination: "/craft/:path*",
        },
        {
          source:
            "/:path((?!api|assets|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
          has: [
            {
              type: "host",
              value:
                process.env.VERCEL_ENV === "production"
                  ? "brew.mxkaske.dev"
                  : "brew.localhost",
            },
          ],
          destination: "/brew/:path*",
        },
      ],
    };
  },

  async redirects() {
    if (process.env.VERCEL_ENV !== "production") return [];

    return [
      {
        // If path starts with /craft and host does NOT include "craft" → redirect
        source: "/craft/:path*",
        destination: "https://craft.mxkaske.dev/:path*",
        permanent: false,
        // faithful to: !host.includes("craft")
        missing: [{ type: "host", value: ".*craft.*" }],
      },
      {
        // If path starts with /brew and host does NOT include "brew" → redirect
        source: "/brew/:path*",
        destination: "https://brew.mxkaske.dev/:path*",
        permanent: false,
        // faithful to: !host.includes("brew")
        missing: [{ type: "host", value: ".*brew.*" }],
      },
    ];
  },
};

module.exports = withContentCollections(nextConfig);
