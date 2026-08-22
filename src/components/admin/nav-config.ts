import type { LucideIcon } from "lucide-react";
import {
  LayoutDashboard,
  Home,
  UserRound,
  Stethoscope,
  Video,
  HeartHandshake,
  Star,
  Newspaper,
  Phone,
  Settings,
  Image as ImageIcon,
} from "lucide-react";

export type NavLeaf = { label: string; href: string };
export type NavGroup = { label: string; icon: LucideIcon; href?: string; items?: NavLeaf[] };

/** Single source of truth for the sidebar -- mirrors the requested
 * page-by-page CMS structure exactly. Each leaf is its own route. */
export const NAV_GROUPS: NavGroup[] = [
  { label: "Dashboard", icon: LayoutDashboard, href: "/admin" },
  {
    label: "Home",
    icon: Home,
    items: [
      { label: "Hero", href: "/admin/home/hero" },
      { label: "About Doctor", href: "/admin/home/about" },
      { label: "Main Services", href: "/admin/home/specialties" },
      { label: "Statistics", href: "/admin/home/statistics" },
      { label: "Technologies", href: "/admin/home/technologies" },
      { label: "Why Dr. Hussein Zakaria", href: "/admin/home/why-choose" },
      { label: "Reviews", href: "/admin/home/reviews" },
      { label: "Featured Videos", href: "/admin/home/featured-videos" },
      { label: "Certificates", href: "/admin/home/certificates" },
      { label: "Articles + FAQ", href: "/admin/home/articles-faq" },
      { label: "Final CTA", href: "/admin/home/final-cta" },
      { label: "Doctor Message (unused)", href: "/admin/home/doctor-message" },
    ],
  },
  {
    label: "About Doctor",
    icon: UserRound,
    items: [
      { label: "Hero", href: "/admin/about-doctor/hero" },
      { label: "Biography", href: "/admin/about-doctor/biography" },
      { label: "Education", href: "/admin/about-doctor/education" },
      { label: "Career", href: "/admin/about-doctor/career" },
      { label: "Certificates", href: "/admin/about-doctor/certificates" },
      { label: "Specialties", href: "/admin/about-doctor/specialties" },
      { label: "CTA", href: "/admin/about-doctor/cta" },
    ],
  },
  {
    label: "Services",
    icon: Stethoscope,
    items: [
      { label: "Hero", href: "/admin/services/hero" },
      { label: "General Services", href: "/admin/services/categories" },
      { label: "Detailed Surgeries", href: "/admin/services/surgeries" },
      { label: "CTA", href: "/admin/services/cta" },
    ],
  },
  { label: "Videos", icon: Video, href: "/admin/videos" },
  { label: "Patient Stories", icon: HeartHandshake, href: "/admin/patient-stories" },
  { label: "Reviews", icon: Star, href: "/admin/reviews" },
  { label: "Articles", icon: Newspaper, href: "/admin/articles" },
  { label: "Contact Us", icon: Phone, href: "/admin/contact" },
  {
    label: "Global Settings",
    icon: Settings,
    items: [
      { label: "Branding", href: "/admin/settings/branding" },
      { label: "Navigation", href: "/admin/settings/navigation" },
      { label: "Social Media", href: "/admin/settings/social" },
      { label: "Contact Info", href: "/admin/settings/contact-info" },
      { label: "Footer", href: "/admin/settings/footer" },
      { label: "SEO", href: "/admin/settings/seo" },
    ],
  },
  { label: "Media Library", icon: ImageIcon, href: "/admin/media" },
];
