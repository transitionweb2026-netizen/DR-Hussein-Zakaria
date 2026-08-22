import {
  Activity,
  Award,
  Bone,
  Brain,
  CircleDot,
  Clock,
  Cpu,
  GraduationCap,
  HeartHandshake,
  HeartPulse,
  LifeBuoy,
  ScanLine,
  TrendingUp,
  Users,
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
  // Stats / Career Timeline icon keys (admin-editable per item)
  users: Users,
  activity: Activity,
  "heart-pulse": HeartPulse,
  clock: Clock,
  award: Award,
  "graduation-cap": GraduationCap,
};

export function getIcon(key: string): LucideIcon {
  return iconMap[key] ?? Brain;
}
