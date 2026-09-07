import Image from "next/image";
import { getSocialIcon } from "@/lib/social-icon-map";
import { cn } from "@/lib/utils";

/** Renders one social-link glyph -- a CMS-uploaded custom icon image when
 * set, otherwise the platform's built-in brand icon (unchanged default).
 * Shared by every place a social link renders (Hero, Footer, Contact
 * Info) so the fallback behavior can't drift between them. */
export function SocialIcon({
  platform,
  imageUrl,
  className = "h-4.5 w-4.5",
}: {
  platform: string;
  imageUrl?: string | null;
  className?: string;
}) {
  if (imageUrl) {
    return (
      <span className={cn("relative block shrink-0 overflow-hidden rounded-full", className)}>
        <Image src={imageUrl} alt="" fill sizes="24px" className="object-cover" />
      </span>
    );
  }
  // getSocialIcon looks up a stable module-level component from a static
  // map (social-icon-map.ts) -- never actually recreated per render, so
  // this doesn't hit the state-reset concern the rule guards against.
  const Icon = getSocialIcon(platform);
  // eslint-disable-next-line react-hooks/static-components
  return <Icon className={className} />;
}
