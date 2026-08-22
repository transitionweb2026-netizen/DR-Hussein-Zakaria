import type { ComponentType, SVGProps } from "react";
import { FacebookIcon, InstagramIcon, TiktokIcon, WhatsappIcon, YoutubeIcon } from "@/components/icons/social-icons";

/** Keyed by social_links.icon (an admin-entered free-text key -- see
 * Global Settings → Social Media). Unknown keys fall back to a generic
 * link glyph rather than crashing the page. */
const SOCIAL_ICON_MAP: Record<string, ComponentType<SVGProps<SVGSVGElement>>> = {
  facebook: FacebookIcon,
  instagram: InstagramIcon,
  tiktok: TiktokIcon,
  whatsapp: WhatsappIcon,
  youtube: YoutubeIcon,
};

export function getSocialIcon(key: string): ComponentType<SVGProps<SVGSVGElement>> {
  return SOCIAL_ICON_MAP[key.toLowerCase()] ?? FacebookIcon;
}
