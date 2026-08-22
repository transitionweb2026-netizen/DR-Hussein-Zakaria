import { type ReactNode } from "react";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import { GlassSweep } from "./glass-sweep";

type ButtonVariant = "primary" | "ghost" | "outline";
type ButtonSize = "md" | "lg";

type BaseProps = {
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: ReactNode;
  className?: string;
  children: ReactNode;
};

type ButtonAsLink = BaseProps & {
  href: string;
  onClick?: never;
};

type ButtonAsButton = BaseProps & {
  href?: undefined;
  onClick?: () => void;
  type?: "button" | "submit";
  disabled?: boolean;
};

type ButtonProps = ButtonAsLink | ButtonAsButton;

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "bg-gradient-to-br from-brand-400 via-brand-500 to-brand-600 text-white shadow-btn hover:shadow-[0_18px_38px_-6px_rgb(47_111_237_/_0.65)] hover:-translate-y-0.5",
  ghost:
    "bg-glass-strong text-brand-700 border-2 border-line backdrop-blur-xl hover:border-brand-400 hover:-translate-y-0.5",
  outline:
    "bg-transparent text-white border border-white/35 hover:bg-white/10 hover:-translate-y-0.5",
};

const sizeClasses: Record<ButtonSize, string> = {
  md: "h-11 px-5 text-sm gap-2",
  lg: "h-13 px-6 text-[0.95rem] gap-2.5",
};

export function Button({
  variant = "primary",
  size = "md",
  icon,
  className,
  children,
  ...rest
}: ButtonProps) {
  const classes = cn(
    "group relative isolate inline-flex items-center justify-center overflow-hidden rounded-pill font-semibold transition-all duration-300 ease-out whitespace-nowrap",
    variantClasses[variant],
    sizeClasses[size],
    className
  );

  const content = (
    <>
      <GlassSweep />
      {children}
      {icon && <span className="inline-flex rtl:-scale-x-100">{icon}</span>}
    </>
  );

  if ("href" in rest && rest.href) {
    const isExternalHref = /^(#|tel:|mailto:|https?:\/\/)/.test(rest.href);
    if (isExternalHref) {
      return (
        <a href={rest.href} className={classes}>
          {content}
        </a>
      );
    }
    return (
      <Link href={rest.href} className={classes}>
        {content}
      </Link>
    );
  }

  const { onClick, type, disabled } = rest as ButtonAsButton;
  return (
    <button
      type={type ?? "button"}
      onClick={onClick}
      disabled={disabled}
      className={cn(classes, "disabled:cursor-not-allowed disabled:opacity-60")}
    >
      {content}
    </button>
  );
}
