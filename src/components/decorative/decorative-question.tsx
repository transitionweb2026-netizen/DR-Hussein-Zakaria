import { cn } from "@/lib/utils";

export function DecorativeQuestion({ className }: { className?: string }) {
  return (
    <div className={cn("relative flex items-center justify-center", className)} aria-hidden>
      <div className="absolute h-[70%] w-[70%] rounded-full bg-brand-300/35 blur-[70px] motion-safe:animate-glow-pulse" />

      <div className="relative flex aspect-square w-[68%] items-center justify-center rounded-[2rem] border-2 border-line bg-glass shadow-glass-lg backdrop-blur-2xl motion-safe:animate-float-slow">
        <span className="bg-gradient-to-b from-brand-400 via-brand-500 to-brand-700 bg-clip-text text-[5rem] font-extrabold leading-none text-transparent drop-shadow-[0_8px_20px_rgba(49,107,233,0.25)] sm:text-[6rem]">
          ?
        </span>
        <div className="absolute inset-3 rounded-[1.6rem] border border-brand-100/70" />
      </div>

      <div className="absolute -bottom-2 h-4 w-1/2 rounded-full bg-brand-400/25 blur-lg" />
    </div>
  );
}
