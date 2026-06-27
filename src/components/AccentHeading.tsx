import { createElement, type ReactNode } from "react";
import { cn } from "@/lib/utils";

interface Props {
  as?: "h1" | "h2" | "h3" | "h4";
  text: string;
  /** Index of the word (0-based) to highlight in meat red. Defaults to last word. */
  accentIndex?: number;
  className?: string;
  children?: ReactNode;
}

/**
 * Renders a heading where exactly ONE word is styled in the meat-red brand
 * accent and the rest stay in ink/gray-950 — per the design system rule.
 */
export function AccentHeading({ as = "h2", text, accentIndex, className }: Props) {
  const words = text.split(" ");
  const idx = accentIndex ?? words.length - 1;
  return createElement(
    as,
    { className: cn("text-ink", className) },
    words.map((w, i) => (
      <span key={i} className={i === idx ? "text-meat" : undefined}>
        {w}
        {i < words.length - 1 ? " " : ""}
      </span>
    )),
  );
}
