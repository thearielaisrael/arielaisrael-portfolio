import type { NextConfig } from "next";

const webpackSvgrOptions = {
  icon: true,
  svgProps: {
    fill: "currentColor",
    focusable: "false",
    "aria-hidden": "true",
  },
  svgo: true,
  svgoConfig: {
    plugins: [
      {
        name: "removeDimensions",
        active: true,
      },
      {
        name: "removeAttrs",
        params: {
          attrs: "(fill|stroke)",
        },
      },
    ],
  },
};

const turbopackSvgrOptions = {
  icon: true,
  svgProps: {
    focusable: "false",
    "aria-hidden": "true",
  },
  svgo: true,
  svgoConfig: {
    plugins: [
      {
        name: "removeViewBox",
        active: false,
      },
      {
        name: "removeDimensions",
        active: true,
      },
    ],
  },
};

const nextConfig: NextConfig = {
  allowedDevOrigins: ["localhost", "127.0.0.1", "10.0.0.235"],

  webpack(config) {
    const fileLoaderRule = config.module.rules.find((rule: { test?: RegExp }) =>
      rule.test?.test?.(".svg"),
    );

    if (!fileLoaderRule) {
      throw new Error("Could not find the existing Next.js SVG rule.");
    }

    config.module.rules.push(
      {
        ...fileLoaderRule,
        test: /\.svg$/i,
        resourceQuery: /url/,
      },
      {
        test: /\.svg$/i,
        issuer: fileLoaderRule.issuer,
        resourceQuery: {
          not: [...((fileLoaderRule.resourceQuery as { not?: RegExp[] })?.not ?? []), /url/],
        },
        use: [
          {
            loader: "@svgr/webpack",
            options: webpackSvgrOptions,
          },
        ],
      },
    );

    fileLoaderRule.exclude = /\.svg$/i;

    return config;
  },

  turbopack: {
    rules: {
      "*.svg": {
        loaders: [
          {
            loader: "@svgr/webpack",
            options: turbopackSvgrOptions,
          },
        ],
        as: "*.js",
      },
    },
  },

  async headers() {
    return [
      {
        source: "/studio-sw.js",

        headers: [
          {
            key: "Content-Type",
            value: "application/javascript; charset=utf-8",
          },
          {
            key: "Cache-Control",
            value: "no-cache, no-store, must-revalidate",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
        ],
      },
      {
        source: "/studio-assets/manifest.webmanifest",

        headers: [
          {
            key: "Content-Type",
            value: "application/manifest+json; charset=utf-8",
          },
          {
            key: "Cache-Control",
            value: "no-cache",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
