const { withContentCollections } = require("@content-collections/next");

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["craft.mxkaske.dev", "mxkaske.dev"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "craft.mxkaske.dev",
      },
      {
        protocol: "https",
        hostname: "mxkaske.dev",
      },
    ],
  },
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
                process.env.NODE_ENV === "production"
                  ? "craft.mxkaske.dev"
                  : "craft.localhost",
            },
          ],
          destination: "/craft/:path*",
        },
      ],
    };
  },
};

module.exports = withContentCollections(nextConfig);
