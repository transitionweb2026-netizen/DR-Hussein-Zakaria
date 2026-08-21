import { Brain } from "lucide-react";
import { cn } from "@/lib/utils";

const dots = [
  { top: "8%", left: "22%", delay: "0s", size: "h-2.5 w-2.5" },
  { top: "16%", left: "78%", delay: "0.6s", size: "h-2 w-2" },
  { top: "30%", left: "6%", delay: "1.3s", size: "h-1.5 w-1.5" },
  { top: "62%", left: "8%", delay: "1.1s", size: "h-2 w-2" },
  { top: "74%", left: "80%", delay: "0.3s", size: "h-3 w-3" },
  { top: "40%", left: "94%", delay: "1.6s", size: "h-1.5 w-1.5" },
  { top: "88%", left: "38%", delay: "2s", size: "h-1.5 w-1.5" },
  { top: "4%", left: "52%", delay: "0.9s", size: "h-1.5 w-1.5" },
  { top: "54%", left: "2%", delay: "1.8s", size: "h-1 w-1" },
  { top: "92%", left: "64%", delay: "0.5s", size: "h-2 w-2" },
];

export function DecorativeBrain({ className }: { className?: string }) {
  return (
    <div className={cn("relative", className)} aria-hidden>
      <div className="absolute inset-0 rounded-full bg-brand-300/45 blur-[80px] motion-safe:animate-glow-pulse" />
      <div className="absolute inset-[8%] rounded-full bg-brand-50/75 blur-[60px]" />
      <div className="absolute inset-[20%] rounded-full bg-brand-200/50 blur-[40px]" />

      <svg
        viewBox="0 0 100 100"
        className="absolute inset-0 h-full w-full text-brand-300/55"
        fill="none"
      >
        <circle
          cx="50"
          cy="50"
          r="48"
          stroke="currentColor"
          strokeWidth="0.4"
          strokeDasharray="1.5 4.5"
          className="origin-center motion-safe:animate-spin-slow"
        />
        <circle cx="50" cy="50" r="41" stroke="currentColor" strokeWidth="0.3" opacity="0.6" />
      </svg>

      <Brain
        strokeWidth={0.9}
        className="absolute inset-0 m-auto h-[86%] w-[86%] text-brand-300 opacity-60 blur-lg"
      />
      <Brain
        strokeWidth={1}
        fill="currentColor"
        fillOpacity={0.06}
        className="absolute inset-0 m-auto h-[84%] w-[84%] text-brand-700 drop-shadow-[0_16px_36px_rgba(49,107,233,0.4)]"
      />
      <Brain
        strokeWidth={1.1}
        className="absolute inset-0 m-auto h-[84%] w-[84%] text-brand-600/70"
      />

      {dots.map((dot, i) => (
        <span
          key={i}
          className={cn(
            "absolute rounded-full bg-brand-100 shadow-[0_0_12px_rgba(49,107,233,0.7)] motion-safe:animate-float",
            dot.size
          )}
          style={{ top: dot.top, left: dot.left, animationDelay: dot.delay }}
        />
      ))}
    </div>
  );
}
