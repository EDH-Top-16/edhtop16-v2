/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: "/v2",
        destination: "/v2/commanders",
      },
      {
        source: "/v2/api/graphql",
        destination: "/api/graphql",
      },
    ];
  },
  compiler: { relay: require("./relay.config") },
  webpack: (config, { isServer, webpack }) => {
    if (!isServer) {
      config.plugins.push(
        new webpack.IgnorePlugin({ resourceRegExp: /lib\/server/ }),
      );
    }

    return config;
  },
};

module.exports = nextConfig;
