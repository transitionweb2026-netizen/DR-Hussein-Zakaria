import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

export function RatingStars({
  rating = 5,
  className,
}: {
  rating?: number;
  className?: string;
}) {
  return (
    <div className={cn("flex items-center gap-1", className)} aria-label={`${rating} / 5`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={cn(
            "h-4 w-4",
            i < rating ? "fill-gold-500 text-gold-500" : "fill-transparent text-ink-300"
          )}
        />
      ))}
    </div>
  );
}
