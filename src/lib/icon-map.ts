import {
  Activity,
  Bone,
  Brain,
  CircleDot,
  Cpu,
  HeartHandshake,
  LifeBuoy,
  ScanLine,
  TrendingUp,
  Waves,
  Zap,
  type LucideIcon,
} from "lucide-react";

export const iconMap: Record<string, LucideIcon> = {
  brain: Brain,
  spine: Bone,
  nerve: Zap,
  scan: ScanLine,
  "brain-tumor": Brain,
  aneurysm: Activity,
  disc: CircleDot,
  hydrocephalus: Waves,
  cpu: Cpu,
  "heart-handshake": HeartHandshake,
  "trending-up": TrendingUp,
  "life-buoy": LifeBuoy,
};

export function getIcon(key: string): LucideIcon {
  return iconMap[key] ?? Brain;
}
