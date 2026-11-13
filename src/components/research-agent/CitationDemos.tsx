"use client";

import { useState } from "react";

/* Illustrative inputs; the mapping and renumbering rules are the real
   WorkerAgent byNum lookup and SynthesizerAgent._renumber(). */

const MAP_ROWS = [
  { from: "cites 2", to: "on the list, a real chunk", ok: true },
  { from: "cites 9", to: "only 8 chunks were given", ok: false },
  { from: 'cites "two"', to: "not a number", ok: false },
];

export function ByNumDemo() {
  const [shown, setShown] = useState(3);

  const run = async () => {
    setShown(0);
    for (let i = 1; i <= MAP_ROWS.length; i++) {
      await new Promise((r) => setTimeout(r, 380));
      setShown(i);
    }
  };

  return (
    <div className="h-full rounded-2xl border border-line bg-raised p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h3 className="text-lg font-semibold text-fg">
          Step 1: check every citation
        </h3>
        <button
          type="button"
          onClick={run}
          className="btn rounded-md border border-line px-3 py-1.5 font-mono text-xs text-mut hover:border-accent hover:text-accent"
        >
          ▶ check them
        </button>
      </div>
      <p className="mt-1.5 text-sm leading-relaxed text-mut">
        The model was given 8 chunks, numbered 1 to 8. Its reply cites three
        things. Only a number that is really on the list survives.{" "}
        <span className="text-[12px] text-faint">(example)</span>
      </p>
      <pre className="mt-4 overflow-x-auto rounded-lg border border-line bg-well p-3 font-mono text-[11.5px] leading-relaxed text-mut">
        {`{"answer": "hf = K + E_B …",
 "citations": [{"chunk_num": 2, …},
               {"chunk_num": 9, …},
               {"chunk_num": "two", …}],
 "confidence": 0.9}`}
      </pre>
      <div className="mt-3 grid gap-1.5">
        {MAP_ROWS.map((r, i) => (
          <div
            key={r.from}
            className="grid grid-cols-[minmax(0,7.5rem)_16px_minmax(0,1fr)_auto] items-center gap-2 rounded-md border border-line bg-well px-2.5 py-2 font-mono text-[11.5px] transition-all duration-300"
            style={{ opacity: i < shown ? 1 : 0.2, transform: i < shown ? "none" : "translateX(-6px)" }}
          >
            <span className="truncate text-fg">{r.from}</span>
            <span className="text-faint">→</span>
            <span className="truncate text-mut">{r.to}</span>
            <span
              className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${r.ok ? "bg-ok/15 text-ok" : "bg-bad/15 text-bad"}`}
            >
              {r.ok ? "kept" : "dropped"}
            </span>
          </div>
        ))}
      </div>
      <p className="mt-3 text-[12px] text-faint">
        The answer is kept. The 2 bad citations are removed and noted.
      </p>
    </div>
  );
}

const SOURCES = [
  "Chapter12.pdf: hf = K + E … photoelectric equation",
  "Chapter12.pdf: Δλ = h/(m_e c)(1 − cos θ)",
  "Chapter12.pdf: h/p is called the de Broglie wavelength",
];
const RAW = "The photoelectric equation is hf = K + E_B [1]. A particle has wavelength λ = h/p [3]. Both are fixed by Planck’s constant [1][3][6].";

function renumber(after: boolean) {
  const map: Record<number, number> = {};
  const cited: number[] = [];
  const parts = RAW.split(/(\[\d+\])/).map((p, i) => {
    const m = p.match(/^\[(\d+)\]$/);
    if (!m) return <span key={i}>{p}</span>;
    const n = Number(m[1]);
    if (n < 1 || n > SOURCES.length) {
      return after ? null : (
        <span key={i} className="rounded bg-bad/15 px-0.5 font-mono text-[0.78em] font-semibold text-bad line-through">
          [{n}]
        </span>
      );
    }
    if (!(n in map)) {
      cited.push(n);
      map[n] = cited.length;
    }
    return (
      <span
        key={i}
        className={`rounded px-0.5 font-mono text-[0.78em] font-semibold ${after ? "bg-accent/25 text-fg" : "bg-blue/15 text-blue"}`}
      >
        [{after ? map[n] : n}]
      </span>
    );
  });
  return { parts, cited };
}

export function RenumberDemo() {
  const [after, setAfter] = useState(false);
  const { parts, cited } = renumber(after);

  return (
    <div className="h-full rounded-2xl border border-line bg-raised p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h3 className="text-lg font-semibold text-fg">
          Step 2: tidy the final answer
        </h3>
        <button
          type="button"
          onClick={() => setAfter((v) => !v)}
          className="btn rounded-md border border-line px-3 py-1.5 font-mono text-xs text-mut hover:border-accent hover:text-accent"
        >
          {after ? "↺ show before" : "▶ clean up"}
        </button>
      </div>
      <p className="mt-1.5 text-sm leading-relaxed text-mut">
        When the workers’ answers are merged, any marker that points to
        nothing is deleted, and the rest are renumbered in order.
      </p>
      <p className="mt-4 rounded-lg border border-line bg-well px-3.5 py-3 text-[15px] leading-loose text-fg">{parts}</p>
      <ul className="mt-3 grid gap-1 font-mono text-[11.5px]">
        {after
          ? cited.map((n, i) => (
              <li key={n} className="rounded-md border border-line bg-well px-2.5 py-1.5 text-mut">
                <b className="text-blue">[{i + 1}]</b> {SOURCES[n - 1]}
              </li>
            ))
          : SOURCES.map((s, i) => (
              <li
                key={s}
                className={`rounded-md border border-line bg-well px-2.5 py-1.5 text-mut ${cited.includes(i + 1) ? "" : "opacity-45"}`}
              >
                <b className="text-blue">[{i + 1}]</b> {s}
              </li>
            ))}
      </ul>
      <p className="mt-3 text-[12px] text-faint">
        {after
          ? "[6] removed (there are only 3 sources) · [3] became [2] · the unused source is dropped"
          : "the merged answer before clean-up · example"}
      </p>
    </div>
  );
}
