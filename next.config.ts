import type { NextConfig } from "next";

/**
 * Built as a static export for GitHub Pages.
 *
 * Pages serves a project repo from a subpath (/outrider), so `basePath` comes
 * from the environment rather than being hardcoded: unset locally, so `next
 * dev` and every scripts/*.mjs check still run against `/`, and set to
 * /outrider by the deploy workflow. Anything that hardcoded the subpath would
 * break local development and silently pass CI.
 *
 * `images.unoptimized` is required by `output: "export"` — the optimiser is a
 * server route, and there is no server here. Every image on the page is
 * already sized to its slot, so this costs nothing but the srcset.
 */
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

const nextConfig: NextConfig = {
  output: "export",
  basePath,
  images: { unoptimized: true },
};

export default nextConfig;
