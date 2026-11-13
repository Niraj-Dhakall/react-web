"use client";

import { useState } from "react";

export function CopyCommand({ cmd }: { cmd: string }) {
  const [state, setState] = useState<"idle" | "copied">("idle");
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(cmd);
      setState("copied");
      setTimeout(() => setState("idle"), 1400);
    } catch {
      /* clipboard unavailable — text stays selectable */
    }
  };
  return (
    <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 rounded-lg border border-line bg-well py-2 pl-3.5 pr-2">
      <code className="block overflow-x-auto whitespace-nowrap py-1 font-mono text-[12px] text-fg">
        <span className="select-none text-faint">$ </span>
        {cmd}
      </code>
      <button
        type="button"
        onClick={copy}
        className="btn rounded-md border border-line px-2.5 py-1 font-mono text-[10.5px] text-mut hover:border-accent hover:text-accent"
      >
        {state === "copied" ? "copied" : "copy"}
      </button>
    </div>
  );
}
