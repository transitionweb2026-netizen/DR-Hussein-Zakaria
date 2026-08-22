import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./admin.css";

// This is an independent Next.js root layout (its own <html>/<body>),
// separate from src/app/[locale]/layout.tsx -- Next.js supports multiple
// root layouts as long as there's no shared app/layout.tsx above them
// (see node_modules/next/dist/docs/.../layout.md, "Root Layout"). /admin is
// English-only by design (see the CMS plan), so there's no next-intl
// provider or dir="rtl" switching here.

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Admin — Dr. Hussein Zakaria",
  robots: { index: false, follow: false },
};

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full bg-admin-bg text-admin-text">{children}</body>
    </html>
  );
}
