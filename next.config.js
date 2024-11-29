const { withContentCollections } = require("@content-collections/next");

/** @type {import('next').NextConfig} */
const nextConfig = {
	
  async rewrites() {
    return {
      beforeFiles: [
        {
          source: '/:path((?!_next).*)',
          has: [
            {
              type: "host",
              value: process.env.NODE_ENV === "production" ? "craft.mxkaske.dev" : "craft.localhost",
            },
          ],
          destination: "/craft/:path*",
        },
      ],
    };
  },
};

module.exports = withContentCollections(nextConfig);
