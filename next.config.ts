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
