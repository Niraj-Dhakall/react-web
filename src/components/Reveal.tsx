"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

/**
 * Reveals children once as they enter the viewport.
 * Reduced motion → globals.css swaps the slide for a short opacity-only fade.
 */
export function Reveal({
  children,
  delay = 0,
  className = "",
  as: Tag = "div",
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
  /** Render element — lets the reveal be a real <li> inside lists */
  as?: "div" | "li";
}) {
  const ref = useRef<HTMLDivElement | HTMLLIElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          io.disconnect();
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -40px 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <Tag
      ref={ref as never}
      data-visible={visible}
      className={`reveal ${className}`}
      style={delay ? { transitionDelay: visible ? `${delay}ms` : undefined } : undefined}
    >
      {children}
    </Tag>
  );
}
