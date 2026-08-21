"use client";

import {
  type ElementType,
  type ComponentPropsWithoutRef,
  type ReactNode,
  type PointerEvent,
  useCallback,
  useRef,
} from "react";
import { cn } from "@/lib/utils";
import { GlassSweep } from "./glass-sweep";

type GlassCardOwnProps = {
  as?: ElementType;
  tone?: "base" | "deep";
  hover?: boolean;
  sheen?: boolean;
  tilt?: boolean;
  className?: string;
  children: ReactNode;
};

type GlassCardProps<T extends ElementType> = GlassCardOwnProps &
  Omit<ComponentPropsWithoutRef<T>, keyof GlassCardOwnProps>;

const MAX_TILT_DEG = 7;

export function GlassCard<T extends ElementType = "div">({
  as,
  tone = "base",
  hover = false,
  sheen = true,
  tilt,
  className,
  children,
  ...rest
}: GlassCardProps<T>) {
  const Component = as || "div";
  const wantsTilt = tilt ?? hover;
  const elRef = useRef<HTMLElement | null>(null);
  const rafRef = useRef(0);

  const handlePointerMove = useCallback(
    (e: PointerEvent<HTMLElement>) => {
      if (!wantsTilt || e.pointerType !== "mouse") return;
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      const el = elRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const px = (e.clientX - rect.left) / rect.width;
      const py = (e.clientY - rect.top) / rect.height;

      if (rafRef.current) return;
      rafRef.current = requestAnimationFrame(() => {
        const rotateY = (px - 0.5) * MAX_TILT_DEG * 2;
        const rotateX = (0.5 - py) * MAX_TILT_DEG * 2;
        el.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px)`;
        el.style.setProperty("--glare-x", `${px * 100}%`);
        el.style.setProperty("--glare-y", `${py * 100}%`);
        el.style.setProperty("--glare-o", "1");
        rafRef.current = 0;
      });
    },
    [wantsTilt]
  );

  const handlePointerLeave = useCallback(() => {
    const el = elRef.current;
    if (!el) return;
    el.style.transform = "";
    el.style.setProperty("--glare-o", "0");
  }, []);

  return (
    <Component
      ref={elRef}
      onPointerMove={wantsTilt ? handlePointerMove : undefined}
      onPointerLeave={wantsTilt ? handlePointerLeave : undefined}
      className={cn(
        "relative isolate rounded-card border-2 backdrop-blur-xl",
        tone === "base" && "border-line bg-glass text-ink-900 shadow-glass",
        tone === "deep" &&
          "border-white/35 bg-gradient-to-br from-brand-400/90 to-brand-700/90 text-white shadow-glow-brand",
        hover &&
          "group overflow-hidden transition-[transform,box-shadow,border-color] duration-300 ease-out will-change-transform hover:shadow-glass-lg hover:border-brand-400",
        className
      )}
      {...rest}
    >
      {sheen && (
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-[1] rounded-[calc(var(--radius-card)-2px)] bg-gradient-to-br from-white/60 via-white/10 to-transparent"
        />
      )}
      {wantsTilt && (
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 z-20 rounded-[calc(var(--radius-card)-2px)] opacity-[var(--glare-o,0)] transition-opacity duration-300"
          style={{
            background:
              "radial-gradient(280px circle at var(--glare-x, 50%) var(--glare-y, 50%), rgb(255 255 255 / 0.5), transparent 60%)",
          }}
        />
      )}
      {hover && <GlassSweep />}
      {children}
    </Component>
  );
}
