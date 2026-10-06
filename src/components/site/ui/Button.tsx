import type { ReactNode } from "react";

type ButtonProps = {
  href: string;
  variant?: "primary" | "ghost";
  icon?: "up-right" | "down";
  external?: boolean;
  /** Visually hidden suffix for screen readers, e.g. "(opens WhatsApp in a new tab)". */
  srHint?: string;
  className?: string;
  children: ReactNode;
};

export function Button({
  href,
  variant = "primary",
  icon = "up-right",
  external = false,
  srHint,
  className,
  children,
}: ButtonProps) {
  const classes = ["btn", `btn--${variant}`, className].filter(Boolean).join(" ");
  const newTab = external ? { target: "_blank", rel: "noopener noreferrer" } : {};
  return (
    <a className={classes} href={href} {...newTab}>
      {children}
      {srHint ? <span className="vh"> {srHint}</span> : null}
      {icon === "up-right" ? <ArrowUpRight /> : <ArrowDown />}
    </a>
  );
}

function ArrowUpRight() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true">
      <path d="M3 11 11 3M5 3h6v6" fill="none" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  );
}

function ArrowDown() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true">
      <path d="M7 2v10M3 8l4 4 4-4" fill="none" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  );
}
