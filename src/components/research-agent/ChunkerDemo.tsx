"use client";

import { useState } from "react";

type El = { k: "heading" | "paragraph" | "code"; tag: string; text: string };

/* Illustrative page — the cut rules are the real chunk_elements() rules. */
const PAGE: El[] = [
  { k: "heading", tag: "title", text: "Regularization" },
  { k: "paragraph", tag: "text", text: "Regularization adds a penalty on weight size to the training loss, trading a little bias for lower variance." },
  { k: "paragraph", tag: "text", text: "The penalty strength λ is a hyperparameter, usually chosen by cross-validation." },
  { k: "heading", tag: "title", text: "L1 (Lasso)" },
  { k: "paragraph", tag: "text", text: "Loss + λ·Σ|w|. Drives many weights to exactly 0 and performs automatic feature selection." },
  { k: "code", tag: "code", text: "loss = mse(y, y_hat) + lam * np.abs(w).sum()" },
  { k: "heading", tag: "title", text: "L2 (Ridge)" },
  { k: "paragraph", tag: "text", text: "Loss + λ·Σw². Shrinks all weights smoothly; weights approach but rarely reach 0." },
];

type Group = { els: El[]; reason: string | null };

function group(els: El[]): Group[] {
  const out: Group[] = [];
  let prev: El["k"] | null = null;
  for (const el of els) {
    const cut =
      out.length === 0 ||
      el.k === "heading" ||
      (prev !== null && prev !== "heading" && (el.k === "code") !== (prev === "code"));
    if (cut) out.push({ els: [], reason: prev === null ? null : el.k === "heading" ? "new heading" : "text → code" });
    out[out.length - 1].els.push(el);
    prev = el.k;
  }
  return out;
}

const GROUPS = group(PAGE);

export function ChunkerDemo() {
  const [cut, setCut] = useState(true);
  const [run, setRun] = useState(0);

  const chunk = () => {
    setCut(false);
    setRun((r) => r + 1);
    requestAnimationFrame(() => requestAnimationFrame(() => setCut(true)));
  };

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h3 className="text-lg font-semibold text-fg">Watch a page get cut into chunks</h3>
        <button
          type="button"
          onClick={chunk}
          className="btn rounded-md border border-line px-3 py-1.5 font-mono text-xs text-mut hover:border-accent hover:text-accent"
        >
          ✂ cut it again
        </button>
      </div>
      <p className="mt-1.5 text-sm leading-relaxed text-mut">
        The cuts follow the page’s own structure: a new chunk starts at every
        heading, and wherever text turns into code. Each blue bar is one chunk.{" "}
        <span className="text-[12px] text-faint">(example page)</span>
      </p>

      <div key={run} className="mt-4 rounded-xl border border-line bg-well py-3 pl-3 pr-3">
        {GROUPS.map((g, gi) => (
          <div key={gi} className="relative">
            {g.reason && (
              <div
                className="relative my-1 ml-12 border-t-[1.5px] border-dashed border-bad transition-opacity duration-300"
                style={{ opacity: cut ? 1 : 0, transitionDelay: `${gi * 140}ms` }}
              >
                <span className="absolute -top-2.5 right-0 bg-well px-1.5 font-mono text-[10px] text-bad">
                  cut · {g.reason}
                </span>
              </div>
            )}
            <div className="relative grid grid-cols-[36px_6px_minmax(0,1fr)] gap-x-2">
              <span
                aria-hidden
                className="col-start-2 row-span-full w-[5px] origin-top rounded-full transition-transform duration-500 ease-out-strong"
                style={{
                  gridRow: `1 / span ${g.els.length}`,
                  background: gi % 2 ? "color-mix(in srgb, var(--color-s1) 55%, transparent)" : "var(--color-s1)",
                  transform: `scaleY(${cut ? 1 : 0})`,
                  transitionDelay: `${gi * 140}ms`,
                }}
              />
              {g.els.map((el, i) => (
                <div key={i} className="contents">
                  <span className="col-start-1 pt-1.5 text-right font-mono text-[10px] text-faint" style={{ gridRow: i + 1 }}>
                    {el.tag}
                  </span>
                  <div
                    className={`col-start-3 my-0.5 rounded px-2 py-1 ${
                      el.k === "heading"
                        ? "font-display text-[15px] font-bold text-fg"
                        : el.k === "code"
                          ? "bg-raised font-mono text-[11.5px] text-mut"
                          : "text-sm leading-snug text-mut"
                    }`}
                    style={{ gridRow: i + 1 }}
                  >
                    {el.text}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div className="mt-2.5 flex flex-wrap gap-x-4 gap-y-1 font-mono text-[11px] text-faint">
        <span className="inline-flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-sm bg-s1" />
          one chunk
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="h-0 w-3 border-t-[1.5px] border-dashed border-bad" />
          cut
        </span>
      </div>
    </div>
  );
}
