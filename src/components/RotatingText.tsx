"use client";

import { useEffect, useRef, useState } from "react";

const HOLD_MS = 2600;
const SWAP_MS = 220;

/**
 * Cycles through words with a blur-masked crossfade.
 *
 * Unlike a typewriter, the first word is rendered on the server — so search
 * engines, link previews, and no-JS visitors always see real text, and
 * there's no layout shift while type animates in.
 */
export function RotatingText({ words }: { words: string[] }) {
  const [index, setIndex] = useState(0);
  const [phase, setPhase] = useState<"in" | "out">("in");
  const timers = useRef<number[]>([]);

  useEffect(() => {
    if (words.length < 2) return;

    const clear = () => {
      timers.current.forEach(clearTimeout);
      timers.current = [];
    };

    const tick = () => {
      timers.current.push(
        window.setTimeout(() => {
          setPhase("out");
          timers.current.push(
            window.setTimeout(() => {
              setIndex((i) => (i + 1) % words.length);
              setPhase("in");
              tick();
            }, SWAP_MS),
          );
        }, HOLD_MS),
      );
    };

    // Handle the edge case invisibly: pause while the tab is hidden.
    const onVisibility = () => {
      clear();
      if (!document.hidden) tick();
    };

    tick();
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      clear();
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [words]);

  return (
    <>
      {/* Screen readers get one stable label instead of a change every 2.6s */}
      <span className="sr-only">{words[0]}</span>
      <span className="rotor" data-phase={phase} aria-hidden>
        {words[index]}
      </span>
    </>
  );
}
