const { withContentlayer } = require("next-contentlayer");

/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: true,
  },
  // rewrites: https://craft.mxkaske.dev => https://mxkaske.dev/craft
};

module.exports = withContentlayer(nextConfig);
