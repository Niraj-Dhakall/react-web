"use client";

import { useEffect, useState } from "react";
import { profile } from "@/data/portfolio";

const links = [
  { label: "experience", href: "#experience" },
  { label: "projects", href: "#projects" },
  { label: "skills", href: "#skills" },
  { label: "contact", href: "#contact" },
];

export function SiteNav() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className="fixed inset-x-0 top-4 z-50 flex justify-center px-4">
      <nav
        aria-label="Primary"
        className={`flex w-full max-w-3xl items-center justify-between gap-4 rounded-full border py-2 pl-5 pr-2 backdrop-blur-md transition-colors duration-300 ${
          scrolled
            ? "border-line bg-ink/75"
            : "border-transparent bg-transparent"
        }`}
      >
        <a
          href="#top"
          className="font-mono text-sm font-medium tracking-tight text-fg transition-colors duration-200 hover:text-accent"
        >
          nirajd<span className="text-accent">.dev</span>
        </a>

        <div className="hidden items-center gap-6 md:flex">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="link-sweep font-mono text-xs tracking-wide text-mut transition-colors duration-200 hover:text-fg"
            >
              {l.label}
            </a>
          ))}
        </div>

        <a
          href={profile.resume}
          target="_blank"
          rel="noopener noreferrer"
          className="btn rounded-full bg-accent px-4 py-1.5 font-mono text-xs font-medium text-ink hover:bg-accent-soft"
        >
          resume
        </a>
      </nav>
    </header>
  );
}
