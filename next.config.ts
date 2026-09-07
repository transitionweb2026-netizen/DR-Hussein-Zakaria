import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

// Derived from NEXT_PUBLIC_SUPABASE_URL so the allow-listed image host
// updates automatically once real project credentials are set -- nothing
// to hand-edit here later.
const supabaseHostname = process.env.NEXT_PUBLIC_SUPABASE_URL
  ? new URL(process.env.NEXT_PUBLIC_SUPABASE_URL).hostname
  : undefined;

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: supabaseHostname
      ? [
          {
            protocol: "https",
            hostname: supabaseHostname,
            pathname: "/storage/v1/object/public/**",
          },
        ]
      : [],
    // Vercel's on-demand image optimization has a monthly transformation
    // quota; this deployment has exhausted it (every /_next/image request
    // site-wide -- local and Supabase-hosted alike -- now returns 402
    // OPTIMIZED_IMAGE_REQUEST_PAYMENT_REQUIRED, confirmed directly against
    // production). That's the actual cause of every "broken image" on the
    // site, not a code or storage bug -- every real file loads fine
    // directly. Turning optimization off serves the original file straight
    // from its source (Supabase Storage or /public) with no transform
    // step, so it can never hit this wall again, at the cost of no more
    // automatic per-viewport resizing or WebP/AVIF conversion. Every
    // <Image> already sets explicit width/height/fill + a sizing
    // className, so the rendered layout is unchanged.
    unoptimized: true,
  },
  experimental: {
    // Default is 1MB, well under what a real photo (logo, doctor portrait,
    // service/certificate images) commonly is -- every admin image upload
    // goes through a Server Action (MediaUploadField), so a plain JPEG
    // over ~1MB was being rejected before it ever reached our own code,
    // surfacing as a generic crash instead of a real error. Raised to 4MB,
    // just under Vercel's own hard 4.5MB request-body ceiling (which no
    // config can raise further).
    serverActions: {
      bodySizeLimit: "4mb",
    },
  },
};

export default withNextIntl(nextConfig);
