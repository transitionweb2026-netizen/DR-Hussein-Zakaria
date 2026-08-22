"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";

type AccordionItemData = {
  question: string;
  answer: string;
};

function AccordionItem({
  item,
  defaultOpen = false,
}: {
  item: AccordionItemData;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="overflow-hidden rounded-lg border-2 border-line bg-glass shadow-glass-sm backdrop-blur-xl transition-colors duration-300 hover:border-brand-400">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex w-full items-center justify-between gap-4 px-5 py-4 text-start text-[0.95rem] font-semibold text-ink-900"
      >
        <span>{item.question}</span>
        <Plus
          className={cn(
            "h-4.5 w-4.5 shrink-0 text-brand-500 transition-transform duration-300",
            open && "rotate-45"
          )}
        />
      </button>
      <div
        className={cn(
          "grid transition-all duration-300 ease-out",
          open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        )}
      >
        <div className="overflow-hidden">
          <p className="px-5 pb-4 text-sm leading-relaxed text-ink-600">{item.answer}</p>
        </div>
      </div>
    </div>
  );
}

export function Accordion({
  items,
  columns = 2,
  className,
}: {
  items: AccordionItemData[];
  /** Number of columns at the sm+ breakpoint (always 1 below that). The
   * standalone full-width FAQ layout uses 2; the half-width Home
   * Articles+FAQ layout passes 1. */
  columns?: 1 | 2;
  className?: string;
}) {
  return (
    <div className={cn("grid grid-cols-1 gap-3", columns === 2 && "sm:grid-cols-2", className)}>
      {items.map((item, i) => (
        <AccordionItem key={item.question} item={item} defaultOpen={i === 0} />
      ))}
    </div>
  );
}
