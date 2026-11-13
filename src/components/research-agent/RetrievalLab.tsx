"use client";

import { useMemo, useState } from "react";

/* Hypothetical ranks that reproduce the documented "gamma" situation:
   an exact-token answer chunk that dense ranks too low for fusion to lift.
   Scores are computed live from the real formulas. */
type Chunk = { id: string; t: string; d: number | null; b: number | null; answer?: boolean };
const CH: Chunk[] = [
  { id: "A", t: "semantically close, no exact token", d: 1, b: 3 },
  { id: "B", t: "semantically close, no exact token", d: 2, b: 5 },
  { id: "C", t: "same topic, different section", d: 3, b: 7 },
  { id: "D", t: "same topic, different section", d: 4, b: 4 },
  { id: "E", t: "loosely related", d: 5, b: 10 },
  { id: "F", t: "loosely related, no keyword hit", d: 6, b: null },
  { id: "H", t: "exact token, wrong context", d: 20, b: 1 },
  { id: "G", t: "answer chunk — exact token match", d: 40, b: 2, answer: true },
];

const STOP = new Set(
  "a an and are as at be by for from how in is it of on or that the this to what when where which who why with does do did".split(" "),
);
const tokenize = (t: string) => t.normalize("NFKC").toLowerCase().match(/[\p{L}\p{N}_]+/gu) ?? [];

const K = 5;
const ROW = 44;
type Mode = "dense" | "bm25" | "hybrid";

export function RetrievalLab() {
  const [q, setQ] = useState("In the ML study guide, what does gamma represent?");
  const [mode, setMode] = useState<Mode>("hybrid");
  const [alpha, setAlpha] = useState(0.5);
  const toks = tokenize(q);

  const ranked = useMemo(() => {
    const score = (c: Chunk) => {
      if (mode === "dense") return c.d ? 1 / c.d : -1;
      if (mode === "bm25") return c.b ? 1 / c.b : -1;
      return (c.d ? alpha / (60 + c.d) : 0) + (c.b ? (1 - alpha) / (60 + c.b) : 0);
    };
    return [...CH]
      .map((c) => ({ c, s: score(c) }))
      .sort((x, y) => y.s - x.s || (x.c.id < y.c.id ? -1 : 1));
  }, [mode, alpha]);

  const pos = new Map(ranked.map((r, i) => [r.c.id, i]));
  const gi = pos.get("G") ?? 0;
  const hit = gi < K;
  const G = CH.find((c) => c.answer)!;
  const fusedG = alpha / (60 + G.d!) + (1 - alpha) / (60 + G.b!);

  const label = (c: Chunk, s: number) => {
    if (mode === "dense") return c.d ? `#${c.d}` : "—";
    if (mode === "bm25") return c.b ? `#${c.b}` : "—";
    return s.toFixed(4);
  };

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-[0.9fr_1.1fr]">
      <div>
        <label htmlFor="q-in" className="font-mono text-[11px] uppercase tracking-[0.15em] text-faint">
          query
        </label>
        <input
          id="q-in"
          type="text"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          spellCheck={false}
          autoComplete="off"
          className="mt-1.5 w-full rounded-lg border border-line bg-well px-3 py-2.5 text-[15px] text-fg outline-none focus:border-accent"
        />

        <p className="mt-5 font-mono text-[11px] uppercase tracking-[0.15em] text-faint">
          tokenizer → bm25 terms
        </p>
        <div className="mt-2 flex min-h-[30px] flex-wrap gap-1.5" aria-live="polite">
          {toks.length ? (
            toks.map((t, i) => (
              <span
                key={t + i}
                className={`rounded px-2 py-0.5 font-mono text-xs ${
                  STOP.has(t) ? "border border-dashed border-line text-faint line-through" : "bg-accent/20 text-fg"
                }`}
              >
                {t}
              </span>
            ))
          ) : (
            <span className="font-mono text-xs text-faint">no tokens → bm25 returns []</span>
          )}
        </div>
        <p className="mt-1.5 font-mono text-[11px] text-faint">
          NFKC → lowercase → \w+ (keeps Greek letters) → drop stopwords
        </p>

        <p className="mt-7 font-mono text-[11px] uppercase tracking-[0.15em] text-faint">retrieval mode</p>
        <div role="group" aria-label="Retrieval mode" className="mt-2 inline-flex gap-1 rounded-lg border border-line bg-well p-1">
          {(["dense", "bm25", "hybrid"] as Mode[]).map((m) => (
            <button
              key={m}
              type="button"
              aria-pressed={mode === m}
              onClick={() => setMode(m)}
              className={`btn rounded-md px-3.5 py-1.5 font-mono text-xs ${mode === m ? "bg-accent text-ink" : "text-mut hover:text-fg"}`}
            >
              {m}
            </button>
          ))}
        </div>

        <div className={`mt-4 flex flex-wrap items-center gap-3 transition-opacity ${mode === "hybrid" ? "" : "opacity-35"}`}>
          <label htmlFor="alpha" className="font-mono text-[11px] tracking-[0.15em] text-faint">
            <span className="normal-case">α</span> <span className="uppercase">dense weight</span>
          </label>
          <input
            id="alpha"
            type="range"
            min={0.05}
            max={0.95}
            step={0.05}
            value={alpha}
            disabled={mode !== "hybrid"}
            onChange={(e) => setAlpha(Number(e.target.value))}
            className="min-w-[140px] flex-1 accent-[var(--color-accent)]"
          />
          <output className="w-16 font-mono text-sm text-fg">α = {alpha.toFixed(2)}</output>
        </div>

        <div className="mt-4 overflow-x-auto rounded-lg border border-dashed border-line bg-well px-3 py-2.5 font-mono text-[11.5px] leading-relaxed text-mut">
          {mode === "hybrid" ? (
            <>
              fused = α/(60+rank_dense) + (1−α)/(60+rank_bm25)
              <br />
              answer chunk = {alpha.toFixed(2)}/(60+{G.d}) + {(1 - alpha).toFixed(2)}/(60+{G.b}) ={" "}
              <span className="text-fg">{fusedG.toFixed(4)}</span>
            </>
          ) : mode === "dense" ? (
            "score = 1 − cosine_distance · query vector from the embedding cache"
          ) : (
            "BM25Okapi over live_chunks() · zero-score hits dropped"
          )}
        </div>

        <p className="mt-5 flex flex-wrap items-center gap-2 text-sm text-mut">
          <span
            className={`rounded-full px-2.5 py-0.5 font-mono text-[11px] font-semibold ${hit ? "bg-ok/15 text-ok" : "bg-bad/15 text-bad"}`}
          >
            {hit ? "hit" : "miss"} at k=5
          </span>
          The answer chunk is ranked <span className="font-mono text-fg">#{gi + 1}</span>.
        </p>
      </div>

      <div>
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <h3 className="font-semibold text-fg">
            {mode === "hybrid" ? "Fused ranking" : mode === "dense" ? "Dense ranking" : "BM25 ranking"}
          </h3>
          <span className="font-mono text-[10.5px] text-faint">hypothetical ranks · real formulas</span>
        </div>
        <div className="relative mt-3" style={{ height: CH.length * ROW + 12 }} aria-live="polite">
          {CH.map((c) => {
            const i = pos.get(c.id) ?? 0;
            const s = ranked[i].s;
            return (
              <div
                key={c.id}
                className={`absolute inset-x-0 grid h-[38px] grid-cols-[28px_minmax(0,1fr)_72px] items-center gap-2.5 rounded-lg border px-3 transition-[transform,opacity] duration-500 ease-out-strong ${
                  c.answer ? "border-accent/60 bg-accent/10" : "border-line bg-well"
                } ${i >= K ? "opacity-40" : ""}`}
                style={{ transform: `translateY(${i * ROW + (i >= K ? 12 : 0)}px)` }}
              >
                <span className="font-mono text-[11px] text-faint">{i + 1}</span>
                <span className="truncate text-[13px] text-fg">
                  <span className="mr-2 font-mono text-[11px] text-faint">{c.id}</span>
                  {c.t}
                </span>
                <span className="text-right font-mono text-[11px] tabular-nums text-mut">{label(c, s)}</span>
              </div>
            );
          })}
          <div
            className="absolute inset-x-0 border-t-2 border-fg/70"
            style={{ transform: `translateY(${K * ROW + 3}px)` }}
          >
            <span className="absolute -top-2.5 right-0 bg-raised px-1.5 font-mono text-[10px] text-fg">k = 5 cutoff</span>
          </div>
        </div>
      </div>
    </div>
  );
}
