const { withContentlayer } = require("next-contentlayer");

/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: true,
  },
  rewrites() {
    return {
        beforeFiles: [
            // if the host is `craft.mxkaske.dev`,
            // this rewrite will be applied
            {
                source: '/:path*',
                has: [
                    {
                        type: 'host',
                        value: 'craft.mxkaske.dev',
                    },
                ],
                destination: '/craft/:path*',
            },
        ]
    }
}
};

module.exports = withContentlayer(nextConfig);
