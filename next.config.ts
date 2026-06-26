import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Phase 1 runs on local placeholders + locally-uploaded media; skip the
    // optimizer so SVG placeholders and uploads always render. (Re-enable +
    // configure a loader/remote domains when moving to cloud media in Phase 2.)
    unoptimized: true,
    dangerouslyAllowSVG: true,
    contentDispositionType: "attachment",
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
};

export default nextConfig;
